import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Database } from '../types/database.types.ts';
import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
const env = await load();

export const supabase = createClient<Database>(
    env.API_URL,
    env.SERVICE_ROLE_KEY,
);

export function buildProfileImagePath(userId: string, imageId: string){
    return `${userId}/profile-images/${imageId}`
}
