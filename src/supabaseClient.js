import { createClient } from "@supabase/supabase-js";

// REPLACE THESE WITH YOUR OWN SUPABASE PROJECT VALUES
const SUPABASE_URL = "https://bifxppsanaalorhvmjte.supabase.co";
const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZnhwcHNhbmFhbG9yaHZtanRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjA0MjAsImV4cCI6MjA5NDA5NjQyMH0.uZH25LkYaHDOvLW-VmFJlnsnKu5QHEB7qhdvW9zpx-s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
