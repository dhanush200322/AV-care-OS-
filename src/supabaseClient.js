import { createClient } from '@supabase/supabase-js';

// ==========================================
// REPLACE WITH YOUR OWN CREDENTIALS LATER
// ==========================================
// Paste your Supabase URL in this variable:
const SUPABASE_URL = "https://ubqkvvsfujyrlflgsoas.supabase.co";

// Paste your Supabase Anon Public Key in this variable:
const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicWt2dnNmdWp5cmxmbGdzb2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDgyNzIsImV4cCI6MjA5NTAyNDI3Mn0.v1Flb9FwPyZybTM76av1Tv_QVpQj7_BnpM9cDWLMbBA";
// ==========================================

// Create and export the Supabase client connection instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
