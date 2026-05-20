-- SUPABASE RLS POLICIES FOR AV CARE OS
-- Execute this in your Supabase SQL Editor

-- 1. Create the users table (if not exists)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'patient' CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'lab_staff', 'patient', 'accountant', 'pharmacist')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can read their own profile
CREATE POLICY "Users can view own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- 4. Policy: Admins can read all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Policy: Admins can update any profile (promotion/demotion)
CREATE POLICY "Admins can update profiles" 
ON public.users 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 6. Policy: System can insert new profiles (on signup)
CREATE POLICY "Enable insert for authenticated users only" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);


-- LAB REPORTS TABLE EXAMPLE RLS
-- CREATE TABLE lab_reports (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   patient_id UUID REFERENCES public.users(id),
--   doctor_id UUID REFERENCES public.users(id),
--   data JSONB,
--   status TEXT
-- );

-- ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;

-- -- Only Admin and the specific Doctor/Patient can see the report
-- CREATE POLICY "Restricted lab report access"
-- ON lab_reports
-- FOR SELECT
-- USING (
--   auth.uid() = patient_id OR 
--   auth.uid() = doctor_id OR
--   EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
-- );
