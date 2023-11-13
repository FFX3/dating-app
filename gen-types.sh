dir=$(dirname $(realpath $0));
echo $dir
(cd $dir/supabase; npx supabase gen types typescript --local > ./../types/database.types.ts;)
#(cd $dir/supabase; npx supabase gen types typescript --linked > ./../types/database.types.ts)
