import { createClient } from '@supabase/supabase-js';
import type { Request, Response } from 'express';

const PORTAL_ROLES = ['admin', 'doctor', 'receptionist', 'security', 'ambulance'] as const;
type PortalRole = (typeof PORTAL_ROLES)[number];

function getAdminClient() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function handleAuthRegister(req: Request, res: Response) {
  const admin = getAdminClient();
  if (!admin) {
    return res.status(503).json({
      fallback: true,
      message: 'Server registration unavailable. Using client signup.',
    });
  }

  const { email, password, fullName, selectedRole } = req.body ?? {};
  const emailNorm = String(email ?? '')
    .trim()
    .toLowerCase();

  if (!emailNorm || !password || !fullName || !selectedRole) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  if (!PORTAL_ROLES.includes(selectedRole as PortalRole)) {
    return res.status(400).json({ success: false, message: 'Invalid role.' });
  }

  try {
    console.log('[AUTH] Signup Start (server)');

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: emailNorm,
      password: String(password),
      email_confirm: true,
      user_metadata: {
        full_name: String(fullName),
        active_role: selectedRole,
      },
    });

    if (createError) {
      console.error('[ERROR] Failure Reason:', createError.message);
      const msg = createError.message.toLowerCase();
      if (msg.includes('already') || msg.includes('registered')) {
        return res.status(409).json({
          success: false,
          message: 'This email is already registered. Try signing in instead.',
        });
      }
      return res.status(400).json({ success: false, message: createError.message });
    }

    const userId = created.user?.id;
    if (!userId) {
      return res.status(500).json({ success: false, message: 'User id missing after createUser.' });
    }

    console.log('[AUTH] User Created');

    const { error: profileError } = await admin.from('profiles').upsert(
      {
        id: userId,
        email: emailNorm,
        full_name: String(fullName),
        active_role: selectedRole,
        is_active: true,
      },
      { onConflict: 'id' }
    );

    if (profileError) {
      console.error('[ERROR] Failure Reason:', profileError.message);
      await admin.auth.admin.deleteUser(userId);
      return res.status(500).json({
        success: false,
        message: `Profile setup failed: ${profileError.message}. Run 002_fix_signup_database_error.sql in Supabase.`,
      });
    }
    console.log('[PROFILE] Insert Success');

    const { error: roleError } = await admin.from('user_roles').upsert(
      { user_id: userId, role: selectedRole },
      { onConflict: 'user_id,role' }
    );

    if (roleError) {
      console.error('[ERROR] Failure Reason:', roleError.message);
      await admin.from('profiles').delete().eq('id', userId);
      await admin.auth.admin.deleteUser(userId);
      return res.status(500).json({
        success: false,
        message: `Role setup failed: ${roleError.message}`,
      });
    }
    console.log('[ROLE] Insert Success');

    return res.json({
      success: true,
      needsEmailConfirmation: false,
      userId,
      message: 'Account created successfully. You can sign in now.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    console.error('[ERROR] Failure Reason:', message);
    return res.status(500).json({ success: false, message });
  }
}
