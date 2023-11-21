create or replace function pg_temp.create_experiences()
returns table (id uuid)
language plpgsql
as $$
#variable_conflict use_column
<<_>>
begin
    return query insert into experiences (
        name, 
        description, 
        availability
    ) values 
    ( 'The Keg', 'A steakhouse', (
            null,
            null,
            null,
            null,
            null,
            null,
            '{(10:00,20:00)}'
    )),
    ( 'Irish Town Park', 'A nature park in Irish Town', (
            '{(10:00,20:00)}',
            null,
            null,
            null,
            null,
            null,
            null
    )) returning id;
end;
$$;

select pg_temp.create_experiences()
