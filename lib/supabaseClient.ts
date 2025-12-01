import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

const isValidSupabaseUrl = (url?: string | null) =>
  !!url && /^https?:\/\/.+\..+/i.test(url);

export const getSupabaseClient = () => {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL or anon key is missing or invalid. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment."
    );
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
};
