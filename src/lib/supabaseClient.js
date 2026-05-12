import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://bifxppsanaalorhvmjte.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "sb_publishable_n4wJ5A5kHn13m4r9Di0A5Q_9fXSyX2V";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);