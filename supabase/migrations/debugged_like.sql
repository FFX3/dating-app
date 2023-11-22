drop function if exists "public"."like"(_profile_id uuid);

CREATE UNIQUE INDEX members_matches_key ON public.matches USING btree (LEAST(members[1], members[2]), GREATEST(members[1], members[2]));

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public."like"(profile_id uuid)
 RETURNS SETOF matches
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
#variable_conflict use_column
<<_>>
declare
match_id uuid;
begin
assert 0 = (select count(*) from users_at_like_cap where users_at_like_cap.user_id = auth.uid()), 'user is at like cap';

select match_id 
from pending_matches 
where profile_id = "like".profile_id
limit 1
into _.match_id;

insert into likes(match_id) values (_.match_id); -- just for like count tracking

return query update matches
  set liked 
    = array_append(liked, auth.uid())
where id = _.match_id
and auth.uid() = any(members)
returning *;

end$function$
;

CREATE OR REPLACE FUNCTION public.like_profile(profile_id uuid)
 RETURNS SETOF matches
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
#variable_conflict use_column
<<_>>
declare
match_id uuid;
begin
assert 0 = (select count(*) from users_at_like_cap where users_at_like_cap.user_id = auth.uid()), 'user is at like cap';

select match_id 
from pending_matches 
where profile_id = like_profile.profile_id
limit 1
into _.match_id;

insert into likes(match_id) values (_.match_id); -- just for like count tracking

return query update matches
  set liked 
    = array_append(liked, auth.uid())
where id = _.match_id
and auth.uid() = any(members)
returning *;

end$function$
;

create or replace view "public"."pending_matches" as  SELECT profiles.name,
    profiles.bio,
    profiles.sex,
    profiles.user_id AS profile_id,
    matches.id AS match_id,
    images.image_ids
   FROM ((profiles
     JOIN matches ON ((ARRAY[profiles.user_id, auth.uid()] @> matches.members)))
     LEFT JOIN ( SELECT array_agg(profile_images.id) AS image_ids,
            profile_images.profile_id,
            profile_images.profile_id AS user_id
           FROM profile_images
          GROUP BY profile_images.profile_id) images USING (user_id))
  WHERE (((NOT (auth.uid() = ANY (matches.liked))) OR (matches.liked IS NULL)) AND ((NOT (auth.uid() = ANY (matches.passed))) OR (matches.passed IS NULL)) AND (auth.uid() <> profiles.user_id));




