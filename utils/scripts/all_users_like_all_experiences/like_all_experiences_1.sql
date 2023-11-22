insert into experience_selections (profile_id, experience_id)
select user_id as profile_id, e.id as experience_id
from profiles p
cross join experiences e
where p.onboarded = true

