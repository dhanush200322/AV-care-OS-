-- FIX: "Database error saving new user" on signup
-- Cause: auth.users trigger inserts into profiles with columns your table does not have,
-- or a broken duplicate trigger from an older Supabase template.
-- Run this entire file in Supabase → SQL Editor.

-- ---------------------------------------------------------------------------
-- 1) Align public.profiles with AV CareOS schema (safe if table already exists)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_role TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc', now());
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc', now());

-- Legacy column from older templates → active_role
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'active_role'
  ) THEN
    UPDATE public.profiles
    SET active_role = COALESCE(active_role, role)
    WHERE active_role IS NULL AND role IS NOT NULL;
  END IF;
END $$;

UPDATE public.profiles SET is_active = TRUE WHERE is_active IS NULL;
UPDATE public.profiles SET active_role = 'receptionist' WHERE active_role IS NULL;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_active_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_active_role_check CHECK (
    active_role IN ('admin', 'doctor', 'receptionist', 'security', 'ambulance')
  );

-- ---------------------------------------------------------------------------
-- 2) user_roles table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_role_check CHECK (
    role IN ('admin', 'doctor', 'receptionist', 'security', 'ambulance')
  );

-- ---------------------------------------------------------------------------
-- 3) Remove conflicting auth triggers / functions (common signup breaker)
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ---------------------------------------------------------------------------
-- 4) RLS policies
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_own" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update_own" ON public.user_roles;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_roles_insert_own" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_roles_update_own" ON public.user_roles FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_roles TO authenticated;

-- ---------------------------------------------------------------------------
-- 5) Remove signup trigger (app creates profile via /api/auth/register or client upsert)
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_user() CASCADE;
