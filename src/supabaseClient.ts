import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://ubqkvvsfujyrlflgsoas.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicWt2dnNmdWp5cmxmbGdzb2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDgyNzIsImV4cCI6MjA5NTAyNDI3Mn0.v1Flb9FwPyZybTM76av1Tv_QVpQj7_BnpM9cDWLMbBA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
