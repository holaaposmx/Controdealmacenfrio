import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://curiyzquwufanvvrrkkj.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cml5enF1d3VmYW52dnJya2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODI0NTgsImV4cCI6MjA1NzQ1ODQ1OH0.kTQjhVVKcfMIT7UrcNxR_jM6KHgbRlxesUbiWK4Gf1w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
