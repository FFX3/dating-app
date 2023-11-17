create or replace function pg_temp.create_users()
returns table (id uuid)
language plpgsql
as $$
#variable_conflict use_column
<<_>>
begin

create temp table migrations_values as 
select
    'user' || (ROW_NUMBER() OVER ()) as name,
    uuid_generate_v4 () as id
from
    generate_series(1, 20);

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
             migrations_values.id,
            'authenticated',
            'authenticated',
            -- 'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            migrations_values.name || '@example.com',
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
          migrations_values
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
    select * from migrations_values
) profiles;

return query select profiles.user_id as id from profiles;
end;
$$;

select pg_temp.create_users()
