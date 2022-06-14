import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PROJ_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string
);
