-- AV CareOS: Complete Birthday System Module SQL
-- Run this in Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.birthday_dashboard_themes (
  dashboard_key TEXT PRIMARY KEY CHECK (
    dashboard_key IN ('admin', 'doctor', 'reception', 'security', 'ambulance')
  ),
  dashboard_name TEXT NOT NULL,
  theme_colour TEXT NOT NULL CHECK (theme_colour ~ '^#[0-9A-F]{6}$'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (dashboard_key, theme_colour)
);

INSERT INTO public.birthday_dashboard_themes (dashboard_key, dashboard_name, theme_colour)
VALUES
  ('admin', 'Admin Dashboard', '#A855F7'),
  ('doctor', 'Doctor Dashboard', '#22C55E'),
  ('reception', 'Reception Dashboard', '#14B8A6'),
  ('security', 'Security Dashboard', '#EF4444'),
  ('ambulance', 'Ambulance Dashboard', '#F59E0B')
ON CONFLICT (dashboard_key) DO UPDATE
SET dashboard_name = EXCLUDED.dashboard_name,
    theme_colour = EXCLUDED.theme_colour;

CREATE TABLE IF NOT EXISTS public.birthday_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_key TEXT NOT NULL,
  theme_colour TEXT NOT NULL,
  auto_wishes_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  wish_type TEXT NOT NULL DEFAULT 'WhatsApp' CHECK (
    wish_type IN ('SMS', 'Email', 'WhatsApp', 'Dashboard')
  ),
  sending_time TIME NOT NULL DEFAULT '09:00',
  hospital_name TEXT NOT NULL DEFAULT 'AV Care Super Speciality Hospital',
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT birthday_settings_theme_fk
    FOREIGN KEY (dashboard_key, theme_colour)
    REFERENCES public.birthday_dashboard_themes (dashboard_key, theme_colour),
  UNIQUE (dashboard_key)
);

CREATE TABLE IF NOT EXISTS public.birthday_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_key TEXT NOT NULL,
  theme_colour TEXT NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SMS', 'Email', 'WhatsApp', 'Dashboard')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT birthday_templates_theme_fk
    FOREIGN KEY (dashboard_key, theme_colour)
    REFERENCES public.birthday_dashboard_themes (dashboard_key, theme_colour)
);

CREATE TABLE IF NOT EXISTS public.birthday_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_key TEXT NOT NULL,
  theme_colour TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('Admin', 'Doctor', 'Reception', 'Security', 'Ambulance')
  ),
  birthday_date DATE NOT NULL,
  birth_month SMALLINT GENERATED ALWAYS AS (EXTRACT(MONTH FROM birthday_date)::SMALLINT) STORED,
  birth_day SMALLINT GENERATED ALWAYS AS (EXTRACT(DAY FROM birthday_date)::SMALLINT) STORED,
  avatar TEXT,
  phone TEXT,
  email TEXT,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT birthday_people_theme_fk
    FOREIGN KEY (dashboard_key, theme_colour)
    REFERENCES public.birthday_dashboard_themes (dashboard_key, theme_colour),
  CONSTRAINT birthday_people_category_theme_required CHECK (
    (category = 'Admin' AND dashboard_key = 'admin' AND theme_colour = '#A855F7') OR
    (category = 'Doctor' AND dashboard_key = 'doctor' AND theme_colour = '#22C55E') OR
    (category = 'Reception' AND dashboard_key = 'reception' AND theme_colour = '#14B8A6') OR
    (category = 'Security' AND dashboard_key = 'security' AND theme_colour = '#EF4444') OR
    (category = 'Ambulance' AND dashboard_key = 'ambulance' AND theme_colour = '#F59E0B')
  )
);

CREATE TABLE IF NOT EXISTS public.birthday_wishing_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_key TEXT NOT NULL,
  theme_colour TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT birthday_wishing_dashboards_theme_fk
    FOREIGN KEY (dashboard_key, theme_colour)
    REFERENCES public.birthday_dashboard_themes (dashboard_key, theme_colour)
);

CREATE TABLE IF NOT EXISTS public.birthday_sent_wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  birthday_person_id UUID REFERENCES public.birthday_people (id) ON DELETE SET NULL,
  source_dashboard_key TEXT NOT NULL,
  source_theme_colour TEXT NOT NULL,
  target_dashboard_key TEXT NOT NULL,
  target_theme_colour TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_role TEXT NOT NULL,
  wish_type TEXT NOT NULL CHECK (wish_type IN ('SMS', 'Email', 'WhatsApp', 'Dashboard')),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Delivered' CHECK (status IN ('Sent', 'Delivered', 'Pending')),
  sender_name TEXT,
  dashboard_source TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL DEFAULT auth.uid(),
  CONSTRAINT birthday_sent_wishes_source_theme_fk
    FOREIGN KEY (source_dashboard_key, source_theme_colour)
    REFERENCES public.birthday_dashboard_themes (dashboard_key, theme_colour),
  CONSTRAINT birthday_sent_wishes_target_theme_fk
    FOREIGN KEY (target_dashboard_key, target_theme_colour)
    REFERENCES public.birthday_dashboard_themes (dashboard_key, theme_colour)
);

CREATE INDEX IF NOT EXISTS idx_birthday_people_dashboard_date
  ON public.birthday_people (dashboard_key, birth_month, birth_day);

CREATE INDEX IF NOT EXISTS idx_birthday_sent_wishes_source_sent_at
  ON public.birthday_sent_wishes (source_dashboard_key, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_birthday_sent_wishes_target_sent_at
  ON public.birthday_sent_wishes (target_dashboard_key, sent_at DESC);

CREATE OR REPLACE FUNCTION public.get_birthday_dashboard_key(dashboard_name TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE dashboard_name
    WHEN 'Admin Dashboard' THEN 'admin'
    WHEN 'Doctor Dashboard' THEN 'doctor'
    WHEN 'Reception Dashboard' THEN 'reception'
    WHEN 'Security Dashboard' THEN 'security'
    WHEN 'Ambulance Dashboard' THEN 'ambulance'
    ELSE dashboard_name
  END;
$$;

CREATE OR REPLACE FUNCTION public.create_birthday_sent_wish(
  p_recipient_name TEXT,
  p_recipient_role TEXT,
  p_wish_type TEXT,
  p_content TEXT,
  p_sender_name TEXT DEFAULT NULL,
  p_source_dashboard TEXT DEFAULT 'Admin Dashboard',
  p_target_dashboard TEXT DEFAULT 'Admin Dashboard',
  p_birthday_person_id UUID DEFAULT NULL,
  p_status TEXT DEFAULT 'Delivered'
)
RETURNS public.birthday_sent_wishes
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_source_key TEXT;
  v_target_key TEXT;
  v_source_theme TEXT;
  v_target_theme TEXT;
  v_target_dashboard_name TEXT;
  v_inserted public.birthday_sent_wishes;
BEGIN
  v_source_key := public.get_birthday_dashboard_key(p_source_dashboard);
  v_target_key := public.get_birthday_dashboard_key(p_target_dashboard);

  SELECT dashboard_name, theme_colour
  INTO v_target_dashboard_name, v_target_theme
  FROM public.birthday_dashboard_themes
  WHERE dashboard_key = v_target_key;

  SELECT theme_colour
  INTO v_source_theme
  FROM public.birthday_dashboard_themes
  WHERE dashboard_key = v_source_key;

  IF v_source_theme IS NULL THEN
    RAISE EXCEPTION 'Invalid source dashboard: %', p_source_dashboard;
  END IF;

  IF v_target_theme IS NULL THEN
    RAISE EXCEPTION 'Invalid target dashboard: %', p_target_dashboard;
  END IF;

  INSERT INTO public.birthday_sent_wishes (
    birthday_person_id,
    source_dashboard_key,
    source_theme_colour,
    target_dashboard_key,
    target_theme_colour,
    recipient_name,
    recipient_role,
    wish_type,
    content,
    status,
    sender_name,
    dashboard_source,
    created_by
  )
  VALUES (
    p_birthday_person_id,
    v_source_key,
    v_source_theme,
    v_target_key,
    v_target_theme,
    p_recipient_name,
    p_recipient_role,
    p_wish_type,
    p_content,
    p_status,
    p_sender_name,
    v_target_dashboard_name,
    auth.uid()
  )
  RETURNING * INTO v_inserted;

  RETURN v_inserted;
END;
$$;

DROP VIEW IF EXISTS public.birthday_dashboard_wishes;

CREATE VIEW public.birthday_dashboard_wishes
WITH (security_invoker = true) AS
SELECT
  wishes.id,
  wishes.birthday_person_id,
  wishes.recipient_name,
  wishes.recipient_role,
  wishes.wish_type,
  wishes.content,
  wishes.status,
  wishes.sender_name,
  wishes.dashboard_source,
  wishes.source_dashboard_key,
  source_theme.dashboard_name AS source_dashboard_name,
  wishes.source_theme_colour,
  wishes.target_dashboard_key,
  target_theme.dashboard_name AS target_dashboard_name,
  wishes.target_theme_colour,
  wishes.sent_at,
  wishes.created_by
FROM public.birthday_sent_wishes AS wishes
JOIN public.birthday_dashboard_themes AS source_theme
  ON source_theme.dashboard_key = wishes.source_dashboard_key
JOIN public.birthday_dashboard_themes AS target_theme
  ON target_theme.dashboard_key = wishes.target_dashboard_key;

CREATE OR REPLACE FUNCTION public.touch_birthday_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := timezone('utc', now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS touch_birthday_settings_updated_at ON public.birthday_settings;
CREATE TRIGGER touch_birthday_settings_updated_at
  BEFORE UPDATE ON public.birthday_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_birthday_updated_at();

DROP TRIGGER IF EXISTS touch_birthday_templates_updated_at ON public.birthday_templates;
CREATE TRIGGER touch_birthday_templates_updated_at
  BEFORE UPDATE ON public.birthday_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_birthday_updated_at();

DROP TRIGGER IF EXISTS touch_birthday_people_updated_at ON public.birthday_people;
CREATE TRIGGER touch_birthday_people_updated_at
  BEFORE UPDATE ON public.birthday_people
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_birthday_updated_at();

-- Contacts, message threads and messages for birthday communication CRUD
CREATE TABLE IF NOT EXISTS public.birthday_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_key TEXT NOT NULL,
  theme_colour TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  relationship TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT birthday_contacts_theme_fk
    FOREIGN KEY (dashboard_key, theme_colour)
    REFERENCES public.birthday_dashboard_themes (dashboard_key, theme_colour)
);

CREATE TABLE IF NOT EXISTS public.birthday_message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_key TEXT NOT NULL,
  theme_colour TEXT NOT NULL,
  subject TEXT,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT birthday_message_threads_theme_fk
    FOREIGN KEY (dashboard_key, theme_colour)
    REFERENCES public.birthday_dashboard_themes (dashboard_key, theme_colour)
);

CREATE TABLE IF NOT EXISTS public.birthday_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.birthday_message_threads (id) ON DELETE CASCADE,
  dashboard_key TEXT,
  theme_colour TEXT,
  birthday_person_id UUID REFERENCES public.birthday_people (id) ON DELETE SET NULL,
  recipient_person_id UUID REFERENCES public.birthday_people (id) ON DELETE SET NULL,
  sender_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  sender_contact_id UUID REFERENCES public.birthday_contacts (id) ON DELETE SET NULL,
  recipient_contact_id UUID REFERENCES public.birthday_contacts (id) ON DELETE SET NULL,
  subject TEXT,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'Dashboard' CHECK (message_type IN ('SMS', 'Email', 'WhatsApp', 'Dashboard', 'Internal')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Draft','Sent','Delivered','Read','Pending','Failed')),
  parent_message_id UUID REFERENCES public.birthday_messages (id) ON DELETE SET NULL,
  external_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_birthday_messages_thread_created_at
  ON public.birthday_messages (thread_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_birthday_messages_sender_created_at
  ON public.birthday_messages (sender_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_birthday_contacts_dashboard_name
  ON public.birthday_contacts (dashboard_key, name);


-- Consolidated CRUD and messaging helpers (create/update/delete contacts, create/reply messages)
CREATE OR REPLACE FUNCTION public.create_birthday_contact(
  p_name TEXT,
  p_phone TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_preferred_contact_method TEXT DEFAULT 'WhatsApp',
  p_dashboard TEXT DEFAULT 'Admin Dashboard',
  p_theme_colour TEXT DEFAULT NULL,
  p_birthday_person_id UUID DEFAULT NULL
)
RETURNS public.birthday_contacts
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_dashboard_key TEXT;
  v_theme_colour TEXT;
  v_inserted public.birthday_contacts;
BEGIN
  v_dashboard_key := public.get_birthday_dashboard_key(p_dashboard);

  IF p_theme_colour IS NOT NULL THEN
    v_theme_colour := p_theme_colour;
  ELSE
    SELECT theme_colour INTO v_theme_colour
    FROM public.birthday_dashboard_themes
    WHERE dashboard_key = v_dashboard_key
    LIMIT 1;
  END IF;

  INSERT INTO public.birthday_contacts (
    dashboard_key, theme_colour, birthday_person_id,
    name, phone, email, preferred_contact_method,
    created_by
  ) VALUES (
    v_dashboard_key, v_theme_colour, p_birthday_person_id,
    p_name, p_phone, p_email, p_preferred_contact_method,
    auth.uid()
  )
  RETURNING * INTO v_inserted;

  RETURN v_inserted;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_birthday_contact(
  p_contact_id UUID,
  p_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_preferred_contact_method TEXT DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL
)
RETURNS public.birthday_contacts
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_updated public.birthday_contacts;
BEGIN
  UPDATE public.birthday_contacts
  SET
    name = COALESCE(p_name, name),
    phone = COALESCE(p_phone, phone),
    email = COALESCE(p_email, email),
    preferred_contact_method = COALESCE(p_preferred_contact_method, preferred_contact_method),
    is_active = COALESCE(p_is_active, is_active),
    updated_at = timezone('utc', now())
  WHERE id = p_contact_id
  RETURNING * INTO v_updated;

  IF v_updated IS NULL THEN
    RAISE EXCEPTION 'Contact not found: %', p_contact_id;
  END IF;

  RETURN v_updated;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_birthday_contact(
  p_contact_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM public.birthday_contacts WHERE id = p_contact_id;
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count > 0;
END;
$$;

-- Create message (supports creating thread when none exists)
CREATE OR REPLACE FUNCTION public.create_birthday_message(
  p_content TEXT,
  p_thread_id UUID DEFAULT NULL,
  p_sender_user_id UUID DEFAULT auth.uid(),
  p_sender_contact_id UUID DEFAULT NULL,
  p_recipient_contact_id UUID DEFAULT NULL,
  p_recipient_person_id UUID DEFAULT NULL,
  p_subject TEXT DEFAULT NULL,
  p_message_type TEXT DEFAULT 'Dashboard',
  p_parent_message_id UUID DEFAULT NULL,
  p_status TEXT DEFAULT 'Sent',
  p_sent_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
  p_source_dashboard TEXT DEFAULT 'Admin Dashboard'
)
RETURNS public.birthday_messages
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_thread UUID := p_thread_id;
  v_source_key TEXT;
  v_source_theme TEXT;
  v_inserted public.birthday_messages;
BEGIN
  IF v_thread IS NULL THEN
    v_source_key := public.get_birthday_dashboard_key(p_source_dashboard);
    SELECT theme_colour INTO v_source_theme FROM public.birthday_dashboard_themes WHERE dashboard_key = v_source_key LIMIT 1;
    INSERT INTO public.birthday_message_threads (dashboard_key, theme_colour, subject, created_by)
    VALUES (v_source_key, v_source_theme, COALESCE(p_subject, 'Direct Message'), auth.uid())
    RETURNING id INTO v_thread;
  END IF;

  INSERT INTO public.birthday_messages (
    thread_id, dashboard_key, theme_colour, sender_id, sender_contact_id,
    recipient_contact_id, recipient_person_id, subject, content, message_type,
    status, parent_message_id, sent_at, created_by
  )
  VALUES (
    v_thread,
    (SELECT dashboard_key FROM public.birthday_message_threads WHERE id = v_thread),
    (SELECT theme_colour FROM public.birthday_message_threads WHERE id = v_thread),
    p_sender_user_id,
    p_sender_contact_id,
    p_recipient_contact_id,
    p_recipient_person_id,
    p_subject,
    p_content,
    p_message_type,
    p_status,
    p_parent_message_id,
    p_sent_at,
    auth.uid()
  )
  RETURNING * INTO v_inserted;

  RETURN v_inserted;
END;
$$;

CREATE OR REPLACE FUNCTION public.reply_birthday_message(
  p_parent_message_id UUID,
  p_content TEXT,
  p_sender_user_id UUID DEFAULT auth.uid(),
  p_sender_contact_id UUID DEFAULT NULL,
  p_message_type TEXT DEFAULT 'Dashboard',
  p_sent_at TIMESTAMPTZ DEFAULT timezone('utc', now())
)
RETURNS public.birthday_messages
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_parent public.birthday_messages%ROWTYPE;
  v_inserted public.birthday_messages;
BEGIN
  SELECT * INTO v_parent FROM public.birthday_messages WHERE id = p_parent_message_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Parent message not found: %', p_parent_message_id;
  END IF;

  INSERT INTO public.birthday_messages (
    thread_id, dashboard_key, theme_colour, sender_id, sender_contact_id,
    recipient_contact_id, recipient_person_id, subject, content, message_type,
    status, parent_message_id, sent_at, created_by
  ) VALUES (
    v_parent.thread_id,
    v_parent.dashboard_key,
    v_parent.theme_colour,
    p_sender_user_id,
    p_sender_contact_id,
    v_parent.sender_contact_id,
    v_parent.recipient_person_id,
    NULL,
    p_content,
    p_message_type,
    'Sent',
    p_parent_message_id,
    p_sent_at,
    auth.uid()
  )
  RETURNING * INTO v_inserted;

  UPDATE public.birthday_messages
  SET status = 'Delivered', updated_at = timezone('utc', now())
  WHERE id = p_parent_message_id;

  RETURN v_inserted;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_birthday_message_status(
  p_message_id UUID,
  p_status TEXT
)
RETURNS public.birthday_messages
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_updated public.birthday_messages;
BEGIN
  UPDATE public.birthday_messages
  SET status = p_status, updated_at = timezone('utc', now())
  WHERE id = p_message_id
  RETURNING * INTO v_updated;

  IF v_updated IS NULL THEN
    RAISE EXCEPTION 'Message not found: %', p_message_id;
  END IF;

  RETURN v_updated;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_birthday_messages_for_dashboard(
  p_dashboard TEXT DEFAULT 'Admin Dashboard',
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS SETOF public.birthday_messages
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT m.*
  FROM public.birthday_messages m
  JOIN public.birthday_message_threads t ON t.id = m.thread_id
  WHERE t.dashboard_key = public.get_birthday_dashboard_key(p_dashboard)
  ORDER BY m.sent_at DESC NULLS LAST, m.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

CREATE OR REPLACE VIEW public.birthday_messages_view
WITH (security_invoker = true) AS
SELECT
  m.*,
  t.subject AS thread_subject,
  t.dashboard_key AS thread_dashboard_key,
  t.theme_colour AS thread_theme_colour,
  su.email AS sender_email,
  rc.name AS recipient_contact_name,
  sc.name AS sender_contact_name
FROM public.birthday_messages m
LEFT JOIN public.birthday_message_threads t ON t.id = m.thread_id
LEFT JOIN auth.users su ON su.id = m.sender_id
LEFT JOIN public.birthday_contacts rc ON rc.id = m.recipient_contact_id
LEFT JOIN public.birthday_contacts sc ON sc.id = m.sender_contact_id;

-- Ensure updated_at triggers exist for new tables
DROP TRIGGER IF EXISTS touch_birthday_contacts_updated_at ON public.birthday_contacts;
CREATE TRIGGER touch_birthday_contacts_updated_at
  BEFORE UPDATE ON public.birthday_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_birthday_updated_at();

DROP TRIGGER IF EXISTS touch_birthday_message_threads_updated_at ON public.birthday_message_threads;
CREATE TRIGGER touch_birthday_message_threads_updated_at
  BEFORE UPDATE ON public.birthday_message_threads
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_birthday_updated_at();

DROP TRIGGER IF EXISTS touch_birthday_messages_updated_at ON public.birthday_messages;
CREATE TRIGGER touch_birthday_messages_updated_at
  BEFORE UPDATE ON public.birthday_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_birthday_updated_at();

-- Enable RLS for new tables
ALTER TABLE public.birthday_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.birthday_dashboard_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_wishing_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_sent_wishes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "birthday_dashboard_themes_select" ON public.birthday_dashboard_themes;
DROP POLICY IF EXISTS "birthday_settings_manage" ON public.birthday_settings;
DROP POLICY IF EXISTS "birthday_templates_manage" ON public.birthday_templates;
DROP POLICY IF EXISTS "birthday_people_manage" ON public.birthday_people;
DROP POLICY IF EXISTS "birthday_wishing_dashboards_manage" ON public.birthday_wishing_dashboards;
DROP POLICY IF EXISTS "birthday_sent_wishes_manage" ON public.birthday_sent_wishes;

CREATE POLICY "birthday_dashboard_themes_select"
  ON public.birthday_dashboard_themes FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "birthday_settings_manage"
  ON public.birthday_settings FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "birthday_templates_manage"
  ON public.birthday_templates FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "birthday_people_manage"
  ON public.birthday_people FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "birthday_wishing_dashboards_manage"
  ON public.birthday_wishing_dashboards FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "birthday_sent_wishes_manage"
  ON public.birthday_sent_wishes FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Enable RLS and policies for newly added contacts/messages/tthreads
ALTER TABLE public.birthday_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_message_threads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "birthday_contacts_manage" ON public.birthday_contacts;
CREATE POLICY "birthday_contacts_manage"
  ON public.birthday_contacts FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "birthday_messages_manage" ON public.birthday_messages;
CREATE POLICY "birthday_messages_manage"
  ON public.birthday_messages FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "birthday_message_threads_manage" ON public.birthday_message_threads;
CREATE POLICY "birthday_message_threads_manage"
  ON public.birthday_message_threads FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
