import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://mlxytrccbfoggzgfiizx.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHl0cmNjYmZvZ2d6Z2ZpaXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTIyNjIsImV4cCI6MjA3MDY2ODI2Mn0.jCFgdsb-tsrqWLtbc0iBOSEf8lvgYwWRwQ0UJpRk7RM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seHl0cmNjYmZvZ2d6Z2ZpaXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA5MjI2MiwiZXhwIjoyMDcwNjY4MjYyfQ.YT1gSWzCCceFx7tQfciFTv8SZ1m_kaBvhBQGnld0UCE';

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
