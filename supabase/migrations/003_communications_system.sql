-- AV CareOS: Global Communication & Notification System
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL DEFAULT 'System',
  sender_role TEXT NOT NULL DEFAULT 'admin',
  target_type TEXT NOT NULL CHECK (target_type IN ('all', 'role', 'department', 'user')),
  target_role TEXT,
  target_department TEXT,
  target_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  target_user_name TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'announcement' CHECK (
    priority IN ('system', 'announcement', 'emergency', 'critical', 'department', 'direct', 'information')
  ),
  delivery_status TEXT NOT NULL DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'read')),
  is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.communication_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id UUID NOT NULL REFERENCES public.communications (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (communication_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
  target_role TEXT,
  communication_id UUID REFERENCES public.communications (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'information' CHECK (
    type IN ('system', 'announcement', 'emergency', 'critical', 'department', 'direct', 'information', 'broadcast')
  ),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_communications_target_role ON public.communications (target_role);
CREATE INDEX IF NOT EXISTS idx_communications_created ON public.communications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_target_role ON public.notifications (target_role);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id);

ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "communications_select_authenticated" ON public.communications;
DROP POLICY IF EXISTS "communications_insert_authenticated" ON public.communications;
DROP POLICY IF EXISTS "communication_reads_all_own" ON public.communication_reads;
DROP POLICY IF EXISTS "notifications_select_authenticated" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_authenticated" ON public.notifications;

CREATE POLICY "communications_select_authenticated"
  ON public.communications FOR SELECT TO authenticated USING (true);

CREATE POLICY "communications_insert_authenticated"
  ON public.communications FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id OR sender_id IS NULL);

CREATE POLICY "communication_reads_all_own"
  ON public.communication_reads FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_select_authenticated"
  ON public.notifications FOR SELECT TO authenticated USING (true);

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE TO authenticated
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "notifications_insert_authenticated"
  ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

GRANT SELECT, INSERT ON public.communications TO authenticated;
GRANT ALL ON public.communication_reads TO authenticated;
GRANT SELECT, UPDATE, INSERT ON public.notifications TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.communications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
