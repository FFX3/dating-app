create or replace function pg_temp.create_test_user()
returns table (id uuid)
language plpgsql
as $$
#variable_conflict use_column
<<_>>
begin

create temp table test_user_values as 
select
    'test' as name,
    '00000000-0000-0000-0000-000000000000'::uuid as id;

-- create test users
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
             test_user_values.id,
            'authenticated',
            'authenticated',
            -- 'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            test_user_values.name || '@example.com',
            crypt ('password', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
          test_user_values
    );

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            u.id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users u
    );

-- create profiles
insert into profiles ( 
    user_id,
    name
)
select 
    profiles.id as user_id, 
    profiles.name
from (
    select * from test_user_values
) profiles;

update profiles
    set onboarded = true,
    sex = 'male',
    interested_in = '{"male", "other", "female"}',
    bio = 'test user',
    availability = (
        '{[10:00,20:00]}',
        '{[10:00,20:00]}',
        '{[10:00,20:00]}',
        '{[10:00,20:00]}',
        '{[10:00,20:00]}',
        '{[10:00,20:00]}',
        '{[10:00,20:00]}'
    )::availability.weekly_availability
where user_id = (select test_user_values.id from test_user_values);

return query select profiles.user_id as id from profiles;
end;
$$;

select pg_temp.create_test_user()
