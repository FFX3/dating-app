
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "availability";

ALTER SCHEMA "availability" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";

CREATE SCHEMA IF NOT EXISTS "jobs";

ALTER SCHEMA "jobs" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "plv8" WITH SCHEMA "pg_catalog";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "availability"."time_subtype_diff"("x" time without time zone, "y" time without time zone) RETURNS double precision
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
	select extract(epoch from (x - y))
$$;

ALTER FUNCTION "availability"."time_subtype_diff"("x" time without time zone, "y" time without time zone) OWNER TO "postgres";

CREATE TYPE "availability"."timerange" AS RANGE (
    subtype = time without time zone,
    multirange_type_name = "availability"."multitimerange",
    subtype_diff = "availability"."time_subtype_diff"
);

ALTER TYPE "availability"."timerange" OWNER TO "postgres";

CREATE DOMAIN "availability"."intra_day_multi_time_range" AS "availability"."multitimerange"
	CONSTRAINT "intra_day_multi_time_range_check" CHECK ((("lower"(VALUE) >= '00:00:00'::time without time zone) AND ("upper"(VALUE) <= '23:59:00'::time without time zone)));

ALTER DOMAIN "availability"."intra_day_multi_time_range" OWNER TO "postgres";

CREATE TYPE "availability"."weekly_availability" AS (
	"monday" "availability"."intra_day_multi_time_range",
	"tuesday" "availability"."intra_day_multi_time_range",
	"wednesday" "availability"."intra_day_multi_time_range",
	"thursday" "availability"."intra_day_multi_time_range",
	"friday" "availability"."intra_day_multi_time_range",
	"saturday" "availability"."intra_day_multi_time_range",
	"sunday" "availability"."intra_day_multi_time_range"
);

ALTER TYPE "availability"."weekly_availability" OWNER TO "postgres";

CREATE TYPE "public"."has_availability" AS ENUM (
    'profile',
    'experience'
);

ALTER TYPE "public"."has_availability" OWNER TO "postgres";

CREATE TYPE "public"."sex" AS ENUM (
    'male',
    'female',
    'other'
);

ALTER TYPE "public"."sex" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "availability"."to_array"("availability" "availability"."weekly_availability") RETURNS "availability"."timerange"[]
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
	select array[
		unnest((availability).monday),
		unnest((availability).tuesday),
		unnest((availability).wednesday),
		unnest((availability).thursday),
		unnest((availability).friday),
		unnest((availability).saturday),
		unnest((availability).sunday)
	];
$$;

ALTER FUNCTION "availability"."to_array"("availability" "availability"."weekly_availability") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "jobs"."fill_matcher_queue"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
	
insert into matches(members)
select 
  array[intersecting_experiences.user_id, intersecting_experiences.intersecting_user_id] as members
from intersecting_experiences
join profiles
      on profiles.user_id = intersecting_experiences.user_id
      -- only onboaded
      and profiles.onboarded
join profiles as partners
        on intersecting_experiences.intersecting_user_id = partners.user_id
      -- only onboaded
      and partners.onboarded
left join matches
	on array[profiles.user_id, partners.user_id] @> matches.members
  	or array[profiles.user_id, partners.user_id] <@ matches.members
where intersecting_experiences.user_id < intersecting_experiences.intersecting_user_id
and profiles.sex = any(partners.interested_in)
and partners.sex = any(profiles.interested_in)
and matches.id is null;

end;
$$;

ALTER FUNCTION "jobs"."fill_matcher_queue"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."add_availability_exception"("_start" timestamp without time zone, "_end" timestamp without time zone) RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
declare
  new_row_id uuid;
  _availability_id uuid;
begin

  insert into availabilities (item_id, item_type)
  values (auth.uid(), 'profile')
  on conflict (item_id, item_type) do update
    set item_type = 'profile'
  returning id into _availability_id;

  insert into availability_exceptions (start, "end", availability_id)
  values (_start, _end, _availability_id)
  returning id into new_row_id;

  return new_row_id;

end;
$$;

ALTER FUNCTION "public"."add_availability_exception"("_start" timestamp without time zone, "_end" timestamp without time zone) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."filter_minimum_window_weekly_availability"("availability" "availability"."weekly_availability", "minimum_interval" integer) RETURNS "availability"."weekly_availability"
    LANGUAGE "plv8" IMMUTABLE STRICT
    AS $_$
	plv8.elog(INFO, 'filter_minimum_window_weekly_availability');
	const daysOfTheWeek = [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'sunday'
	]
	
	const newAvailability = {};
	
	daysOfTheWeek.forEach((day)=>{
		const dayRanges = availability[day]
		if(!dayRanges) {
			newAvailability[day] = null
			return
		}
		
		const ranges = availability[day]
			.slice(2,-2)
			.split('),(')
			.map(
				rangeString=>rangeString
					.split(',')
					.map(
						timeString=>timeString.split(':')
							.map(n=>parseInt(n))
					)
			)
		
		const filteredRanges = ranges.filter(([start, end])=>{
			plv8.elog(INFO, 'start:', start.join(':'), 'end:', end.join(':'));
		
			function inSeconds(time){
				return (
					time[0] * 3600
					+ time[1] * 60
					+ time[2]
				)
			}
			
			const duration = inSeconds(end) - inSeconds(start)
			plv8.elog(INFO, 'start:', duration / 60);
		
			return duration / 60 >= minimum_interval
		})
		
		if(filteredRanges.length == 0){
			newAvailability[day] = null
			return
		}

		
		newAvailability[day] = '{' + filteredRanges.map(([start, end])=>{
			return `(${start.join(":")},${end.join(":")})`
		}) + '}'
	});

	return newAvailability;
$_$;

ALTER FUNCTION "public"."filter_minimum_window_weekly_availability"("availability" "availability"."weekly_availability", "minimum_interval" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."intersect_weekly_availability"("a" "availability"."weekly_availability", "b" "availability"."weekly_availability") RETURNS "availability"."weekly_availability"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
	select (
		a.monday * b.monday,
		a.tuesday * b.tuesday,
		a.wednesday * b.wednesday,
		a.thursday * b.thursday,
		a.friday * b.friday,
		a.saturday * b.saturday,
		a.sunday * b.sunday
	)
$$;

ALTER FUNCTION "public"."intersect_weekly_availability"("a" "availability"."weekly_availability", "b" "availability"."weekly_availability") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."isempty"("availability"."weekly_availability") RETURNS boolean
    LANGUAGE "plpgsql" IMMUTABLE STRICT
    AS $_$
 begin
 	return not (
 		isempty($1.monday)
 		and isempty($1.tuesday)
 		and isempty($1.wednesday)
 		and isempty($1.thursday)
 		and isempty($1.friday)
 		and isempty($1.saturday)
 		and isempty($1.sunday)
 	);
 end
 $_$;

ALTER FUNCTION "public"."isempty"("availability"."weekly_availability") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."like"("_profile_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
_match_id uuid;
begin

assert 0 = (select count(*) users_at_like_cap where user_id = auth.uid()), 'user is at like cap';

select match_id 
  from pending_matches 
  where id = (
    select match_id 
    from pending_matches 
    where profile_id = _profile_id
    limit 1
  )
into _match_id;

insert into likes(match_id) values (_match_id); -- just for like count tracking

update matches
  set liked 
    = array_append(liked, auth.uid())
where id = _match_id
and auth.uid() = any(members);

end$$;

ALTER FUNCTION "public"."like"("_profile_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."pass"("_profile_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare _match_id uuid;
begin

select match_id 
  from pending_matches 
  where profile_id = _profile_id
  limit 1
into _match_id;

update matches
  set passed = array_append(passed, auth.uid())
where id = _match_id
and auth.uid() = any(members);

if (
  select count(*) 
  from matches 
  where id = _match_id
  and passed = members
 ) = 1 then
 	delete from matches where id = _match_id;
 end if;

end$$;

ALTER FUNCTION "public"."pass"("_profile_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."send_message"("_message" "text", "_contact_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  insert into messages(
    message,
    match_id
  ) values (
    _message,
    (select match_id 
    from message_view
    where contact_id = _contact_id
    limit 1)
  );
END;
$$;

ALTER FUNCTION "public"."send_message"("_message" "text", "_contact_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."union_weekly_availability"("a" "availability"."weekly_availability", "b" "availability"."weekly_availability") RETURNS "availability"."weekly_availability"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
	select (
		a.monday + b.monday,
		a.tuesday + b.tuesday,
		a.wednesday + b.wednesday,
		a.thursday + b.thursday,
		a.friday + b.friday,
		a.saturday + b.saturday,
		a.sunday + b.sunday
	)
$$;

ALTER FUNCTION "public"."union_weekly_availability"("a" "availability"."weekly_availability", "b" "availability"."weekly_availability") OWNER TO "postgres";

CREATE OPERATOR "public".* (
    FUNCTION = "public"."intersect_weekly_availability",
    LEFTARG = "availability"."weekly_availability",
    RIGHTARG = "availability"."weekly_availability",
    COMMUTATOR = OPERATOR("public".*)
);

ALTER OPERATOR "public".* ("availability"."weekly_availability", "availability"."weekly_availability") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."availabilities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "item_id" "uuid" NOT NULL,
    "item_type" "public"."has_availability" NOT NULL,
    "start_monday" time without time zone,
    "end_monday" time without time zone,
    "start_tuesday" time without time zone,
    "end_tuesday" time without time zone,
    "start_wednesday" time without time zone,
    "end_wednesday" time without time zone,
    "start_thursday" time without time zone,
    "end_thursday" time without time zone,
    "start_friday" time without time zone,
    "end_friday" time without time zone,
    "start_saturday" time without time zone,
    "end_saturday" time without time zone,
    "start_sunday" time without time zone,
    "end_sunday" time without time zone
);

ALTER TABLE "public"."availabilities" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."availability_exceptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "availability_id" "uuid" NOT NULL,
    "start" timestamp without time zone NOT NULL,
    "end" timestamp without time zone NOT NULL
);

ALTER TABLE "public"."availability_exceptions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."matches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "members" "uuid"[] NOT NULL,
    "seen_by" "uuid"[],
    "liked" "uuid"[],
    "passed" "uuid"[]
);

ALTER TABLE ONLY "public"."matches" REPLICA IDENTITY FULL;

ALTER TABLE "public"."matches" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profile_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "index" integer NOT NULL
);

ALTER TABLE "public"."profile_images" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "name" "text",
    "bio" "text",
    "sex" "public"."sex",
    "interested_in" "public"."sex"[],
    "onboarded" boolean DEFAULT false NOT NULL,
    "availability" "availability"."weekly_availability"
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."contacts" AS
 SELECT "profiles"."name",
    "profiles"."bio",
    "profiles"."sex",
    "profiles"."user_id" AS "profile_id",
    "matches"."id" AS "match_id",
    "images"."image_ids"
   FROM (("public"."profiles"
     JOIN "public"."matches" ON (("profiles"."user_id" = ANY ("matches"."members"))))
     LEFT JOIN ( SELECT "array_agg"("profile_images"."id") AS "image_ids",
            "profile_images"."profile_id" AS "user_id"
           FROM "public"."profile_images"
          GROUP BY "profile_images"."profile_id") "images" USING ("user_id"))
  WHERE ((("matches"."members" <@ "matches"."liked") OR ("matches"."members" @> "matches"."liked")) AND (("auth"."uid"() <> "profiles"."user_id") OR ("auth"."uid"() IS NULL)));

ALTER TABLE "public"."contacts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."dates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "experience_id" "uuid" NOT NULL,
    "message_room_id" "uuid" NOT NULL,
    "start_time" time without time zone NOT NULL,
    "confirmed_by" "uuid"[]
);

ALTER TABLE "public"."dates" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."experience_selections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "experience_id" "uuid" NOT NULL,
    "profile_id" "uuid" DEFAULT "auth"."uid"() NOT NULL
);

ALTER TABLE "public"."experience_selections" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."experiences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "description" "text",
    "availability" "availability"."weekly_availability"
);

ALTER TABLE "public"."experiences" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."intersecting_experiences" AS
 SELECT "profiles"."user_id",
    "crossed"."user_id" AS "intersecting_user_id",
    "array_agg"("experience_selections"."experience_id") AS "experience_ids"
   FROM (((("public"."profiles"
     JOIN "public"."profiles" "crossed" ON (("profiles"."user_id" <> "crossed"."user_id")))
     LEFT JOIN "public"."experience_selections" ON (("experience_selections"."profile_id" = "profiles"."user_id")))
     LEFT JOIN "public"."experience_selections" "intersecting_selections" ON ((("intersecting_selections"."profile_id" = "crossed"."user_id") AND ("experience_selections"."experience_id" = "intersecting_selections"."experience_id"))))
     LEFT JOIN "public"."experiences" ON (("experiences"."id" = "experience_selections"."experience_id")))
  WHERE (("intersecting_selections"."experience_id" IS NOT NULL) AND "public"."isempty"("public"."filter_minimum_window_weekly_availability"((("profiles"."availability" OPERATOR("public".*) "crossed"."availability") OPERATOR("public".*) "experiences"."availability"), 60)))
  GROUP BY "profiles"."user_id", "crossed"."user_id";

ALTER TABLE "public"."intersecting_experiences" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "liker_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "match_id" "uuid" NOT NULL
);

ALTER TABLE "public"."likes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "match_id" "uuid" NOT NULL,
    "sender_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "message" "text" NOT NULL
);

ALTER TABLE "public"."messages" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."message_view" WITH ("security_invoker"='true') AS
 SELECT "messages"."id",
    "messages"."created_at",
    "messages"."match_id",
    "messages"."message",
    ("messages"."sender_id" = COALESCE("auth"."uid"(), '774deb9e-d1a0-41b9-99c6-8aa600f1814e'::"uuid")) AS "is_sender",
    ( SELECT "unnest"("matches"."members") AS "member_id"
        EXCEPT
         SELECT COALESCE("auth"."uid"(), '774deb9e-d1a0-41b9-99c6-8aa600f1814e'::"uuid") AS "coalesce"
 LIMIT 1) AS "contact_id"
   FROM ("public"."messages"
     JOIN "public"."matches" ON (("messages"."match_id" = "matches"."id")));

ALTER TABLE "public"."message_view" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."pending_matches" AS
 SELECT "profiles"."name",
    "profiles"."bio",
    "profiles"."sex",
    "profiles"."user_id" AS "profile_id",
    "matches"."id" AS "match_id",
    "images"."image_ids"
   FROM (("public"."profiles"
     JOIN "public"."matches" ON (("profiles"."user_id" = ANY ("matches"."members"))))
     LEFT JOIN ( SELECT "array_agg"("profile_images"."id") AS "image_ids",
            "profile_images"."profile_id" AS "user_id"
           FROM "public"."profile_images"
          GROUP BY "profile_images"."profile_id") "images" USING ("user_id"))
  WHERE (((NOT (COALESCE("auth"."uid"(), '774deb9e-d1a0-41b9-99c6-8aa600f1814e'::"uuid") = ANY ("matches"."liked"))) OR ("matches"."liked" IS NULL)) AND ((NOT (COALESCE("auth"."uid"(), '774deb9e-d1a0-41b9-99c6-8aa600f1814e'::"uuid") = ANY ("matches"."passed"))) OR ("matches"."passed" IS NULL)) AND (COALESCE("auth"."uid"(), '774deb9e-d1a0-41b9-99c6-8aa600f1814e'::"uuid") <> "profiles"."user_id"));

ALTER TABLE "public"."pending_matches" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."users_at_like_cap" WITH ("security_invoker"='true') AS
 SELECT "likes_passed_24h"."user_id"
   FROM ( SELECT "profiles"."user_id",
            "count"(*) AS "like_count"
           FROM ("public"."profiles"
             JOIN "public"."likes" ON (("profiles"."user_id" = "likes"."liker_id")))
          WHERE ("likes"."created_at" > ("now"() - '1 day'::interval))
          GROUP BY "profiles"."user_id") "likes_passed_24h"
  WHERE ("likes_passed_24h"."like_count" > 10);

ALTER TABLE "public"."users_at_like_cap" OWNER TO "postgres";

ALTER TABLE ONLY "public"."availabilities"
    ADD CONSTRAINT "availabilities_item_id_item_type_key" UNIQUE ("item_id", "item_type");

ALTER TABLE ONLY "public"."availabilities"
    ADD CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."availability_exceptions"
    ADD CONSTRAINT "availability_exception_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."dates"
    ADD CONSTRAINT "dates_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."experience_selections"
    ADD CONSTRAINT "experience_selection_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."experiences"
    ADD CONSTRAINT "experiences_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "message_rooms_members_key" UNIQUE ("members");

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "message_rooms_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profile_images"
    ADD CONSTRAINT "profile_images_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profile_user_uid_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."experience_selections"
    ADD CONSTRAINT "uq_experience_selection" UNIQUE ("profile_id", "experience_id");

ALTER TABLE ONLY "public"."profile_images"
    ADD CONSTRAINT "uq_profile_images" UNIQUE ("profile_id", "index");

ALTER TABLE ONLY "public"."availability_exceptions"
    ADD CONSTRAINT "availability_exceptions_availability_id_fkey" FOREIGN KEY ("availability_id") REFERENCES "public"."availabilities"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."dates"
    ADD CONSTRAINT "dates_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."dates"
    ADD CONSTRAINT "dates_message_room_id_fkey" FOREIGN KEY ("message_room_id") REFERENCES "public"."matches"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."experience_selections"
    ADD CONSTRAINT "experience_selections_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."experience_selections"
    ADD CONSTRAINT "experience_selections_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("user_id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_liker_id_fkey" FOREIGN KEY ("liker_id") REFERENCES "public"."profiles"("user_id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("user_id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profile_images"
    ADD CONSTRAINT "profile_images_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("user_id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

CREATE POLICY "Profiles are public" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Users can manipulate their row" ON "public"."profiles" TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));

CREATE POLICY "all users can see profile images" ON "public"."profile_images" FOR SELECT TO "authenticated" USING (true);

ALTER TABLE "public"."availabilities" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."availability_exceptions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "can edit their own rows" ON "public"."availabilities" TO "authenticated" USING ((("item_type" = 'profile'::"public"."has_availability") AND ("item_id" = "auth"."uid"()))) WITH CHECK ((("item_type" = 'profile'::"public"."has_availability") AND ("item_id" = "auth"."uid"())));

CREATE POLICY "can view their messages" ON "public"."messages" FOR SELECT TO "authenticated" USING (("auth"."uid"() IN ( SELECT "unnest"("matches"."members") AS "unnest"
   FROM "public"."matches"
  WHERE ("matches"."id" = "messages"."match_id"))));

CREATE POLICY "can view their own likes" ON "public"."likes" FOR SELECT TO "authenticated" USING (("liker_id" = "auth"."uid"()));

ALTER TABLE "public"."dates" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "everyone can select" ON "public"."experiences" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "experience availabilites are public" ON "public"."availabilities" FOR SELECT TO "authenticated" USING (("item_type" = 'experience'::"public"."has_availability"));

ALTER TABLE "public"."experience_selections" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."experiences" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."likes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."matches" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profile_images" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user can edit their own rows" ON "public"."experience_selections" TO "authenticated" USING (("profile_id" = "auth"."uid"())) WITH CHECK (("profile_id" = "auth"."uid"()));

CREATE POLICY "user can manipulate their own images" ON "public"."profile_images" TO "authenticated" USING (("profile_id" = "auth"."uid"())) WITH CHECK (("profile_id" = "auth"."uid"()));

CREATE POLICY "user can view their own matches" ON "public"."matches" FOR SELECT TO "authenticated" USING (("auth"."uid"() = ANY ("members")));

CREATE POLICY "users can manipulate their own exceptions" ON "public"."availability_exceptions" TO "authenticated" USING (("availability_id" = ( SELECT "availabilities"."id"
   FROM "public"."availabilities"
  WHERE (("availabilities"."item_type" = 'profile'::"public"."has_availability") AND ("availabilities"."item_id" = "auth"."uid"()))
 LIMIT 1))) WITH CHECK (("availability_id" = ( SELECT "availabilities"."id"
   FROM "public"."availabilities"
  WHERE (("availabilities"."item_type" = 'profile'::"public"."has_availability") AND ("availabilities"."item_id" = "auth"."uid"()))
 LIMIT 1)));

CREATE POLICY "users can send messages" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK (("sender_id" = "auth"."uid"()));

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."add_availability_exception"("_start" timestamp without time zone, "_end" timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."add_availability_exception"("_start" timestamp without time zone, "_end" timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_availability_exception"("_start" timestamp without time zone, "_end" timestamp without time zone) TO "service_role";

GRANT ALL ON FUNCTION "public"."filter_minimum_window_weekly_availability"("availability" "availability"."weekly_availability", "minimum_interval" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."filter_minimum_window_weekly_availability"("availability" "availability"."weekly_availability", "minimum_interval" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."filter_minimum_window_weekly_availability"("availability" "availability"."weekly_availability", "minimum_interval" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."intersect_weekly_availability"("a" "availability"."weekly_availability", "b" "availability"."weekly_availability") TO "anon";
GRANT ALL ON FUNCTION "public"."intersect_weekly_availability"("a" "availability"."weekly_availability", "b" "availability"."weekly_availability") TO "authenticated";
GRANT ALL ON FUNCTION "public"."intersect_weekly_availability"("a" "availability"."weekly_availability", "b" "availability"."weekly_availability") TO "service_role";

GRANT ALL ON FUNCTION "public"."isempty"("availability"."weekly_availability") TO "anon";
GRANT ALL ON FUNCTION "public"."isempty"("availability"."weekly_availability") TO "authenticated";
GRANT ALL ON FUNCTION "public"."isempty"("availability"."weekly_availability") TO "service_role";

GRANT ALL ON FUNCTION "public"."like"("_profile_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."like"("_profile_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."like"("_profile_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."pass"("_profile_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."pass"("_profile_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pass"("_profile_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."send_message"("_message" "text", "_contact_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."send_message"("_message" "text", "_contact_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_message"("_message" "text", "_contact_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."union_weekly_availability"("a" "availability"."weekly_availability", "b" "availability"."weekly_availability") TO "anon";
GRANT ALL ON FUNCTION "public"."union_weekly_availability"("a" "availability"."weekly_availability", "b" "availability"."weekly_availability") TO "authenticated";
GRANT ALL ON FUNCTION "public"."union_weekly_availability"("a" "availability"."weekly_availability", "b" "availability"."weekly_availability") TO "service_role";

GRANT ALL ON TABLE "public"."availabilities" TO "anon";
GRANT ALL ON TABLE "public"."availabilities" TO "authenticated";
GRANT ALL ON TABLE "public"."availabilities" TO "service_role";

GRANT ALL ON TABLE "public"."availability_exceptions" TO "anon";
GRANT ALL ON TABLE "public"."availability_exceptions" TO "authenticated";
GRANT ALL ON TABLE "public"."availability_exceptions" TO "service_role";

GRANT ALL ON TABLE "public"."matches" TO "anon";
GRANT ALL ON TABLE "public"."matches" TO "authenticated";
GRANT ALL ON TABLE "public"."matches" TO "service_role";

GRANT ALL ON TABLE "public"."profile_images" TO "anon";
GRANT ALL ON TABLE "public"."profile_images" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_images" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."contacts" TO "anon";
GRANT ALL ON TABLE "public"."contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."contacts" TO "service_role";

GRANT ALL ON TABLE "public"."dates" TO "anon";
GRANT ALL ON TABLE "public"."dates" TO "authenticated";
GRANT ALL ON TABLE "public"."dates" TO "service_role";

GRANT ALL ON TABLE "public"."experience_selections" TO "anon";
GRANT ALL ON TABLE "public"."experience_selections" TO "authenticated";
GRANT ALL ON TABLE "public"."experience_selections" TO "service_role";

GRANT ALL ON TABLE "public"."experiences" TO "anon";
GRANT ALL ON TABLE "public"."experiences" TO "authenticated";
GRANT ALL ON TABLE "public"."experiences" TO "service_role";

GRANT ALL ON TABLE "public"."intersecting_experiences" TO "anon";
GRANT ALL ON TABLE "public"."intersecting_experiences" TO "authenticated";
GRANT ALL ON TABLE "public"."intersecting_experiences" TO "service_role";

GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON TABLE "public"."message_view" TO "anon";
GRANT ALL ON TABLE "public"."message_view" TO "authenticated";
GRANT ALL ON TABLE "public"."message_view" TO "service_role";

GRANT ALL ON TABLE "public"."pending_matches" TO "anon";
GRANT ALL ON TABLE "public"."pending_matches" TO "authenticated";
GRANT ALL ON TABLE "public"."pending_matches" TO "service_role";

GRANT ALL ON TABLE "public"."users_at_like_cap" TO "anon";
GRANT ALL ON TABLE "public"."users_at_like_cap" TO "authenticated";
GRANT ALL ON TABLE "public"."users_at_like_cap" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
