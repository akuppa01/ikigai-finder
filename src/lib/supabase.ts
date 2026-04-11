import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.'
  );
}

// Browser / public client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (service role — never expose to browser)
if (!serviceRoleKey) {
  console.warn(
    'SUPABASE_SERVICE_ROLE_KEY is not set — server-side DB writes will fail.'
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey ?? supabaseAnonKey, // fallback to anon so the app still boots
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
