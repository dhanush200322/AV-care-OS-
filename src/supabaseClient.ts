import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://bifxppsanaalorhvmjte.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZnhwcHNhbmFhbG9yaHZtanRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjA0MjAsImV4cCI6MjA5NDA5NjQyMH0.uZH25LkYaHDOvLW-VmFJlnsnKu5QHEB7qhdvW9zpx-s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});
