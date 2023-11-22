--insert into matches (members)
--select array[user_id, intersecting_user_id] as members
--from intersecting_experiences;

select jobs.fill_matcher_queue();
