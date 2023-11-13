create or replace function time_subtype_diff(x time, y time) returns float8
strict immutable
language sql
as $function$
	select extract(epoch from (x - y))
$function$;

create type timerange as range (
	subtype = time,
	subtype_diff = time_subtype_diff,
	multirange_type_name = multitimerange
);

create domain availability.intra_day_multi_time_range as multitimerange
check (
	lower(value) >= '00:00'::time
	and upper(value) <= '23:59'::time
);

create type availability.weekly_availability as (
	monday availability.intra_day_multi_time_range,
	tuesday availability.intra_day_multi_time_range,
	wednesday availability.intra_day_multi_time_range,
	thursday availability.intra_day_multi_time_range,
	friday availability.intra_day_multi_time_range,
	saturday availability.intra_day_multi_time_range,
	sunday availability.intra_day_multi_time_range
);