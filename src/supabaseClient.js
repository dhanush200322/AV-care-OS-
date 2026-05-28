import { createClient } from '@supabase/supabase-js';

// ==========================================
// REPLACE WITH YOUR OWN CREDENTIALS LATER
// ==========================================
// Paste your Supabase URL in this variable:
const SUPABASE_URL = "https://ubqkvvsfujyrlflgsoas.supabase.co/rest/v1/";

// Paste your Supabase Anon Public Key in this variable:
const SUPABASE_PUBLIC_KEY = "sb_publishable_b-kLpGBdHaBaBBO7bheVCg_HKJCnSuO";
// ==========================================

// Create and export the Supabase client connection instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
