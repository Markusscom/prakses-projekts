import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;

export function getSupabase() {
    if (supabaseInstance) return supabaseInstance;

    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    return supabaseInstance;
}