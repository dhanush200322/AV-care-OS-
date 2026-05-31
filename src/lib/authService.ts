import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { RoleId } from '../types';
import { DASHBOARD_BY_PORTAL_ROLE } from './authRoutes';
import { withTimeout } from './authUtils';

export type PortalRole = 'admin' | 'doctor' | 'receptionist' | 'security' | 'ambulance';

export interface DbProfile {
  id: string;
  email: string;
  full_name: string | null;
  active_role: PortalRole;
  is_active: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  selectedRole: PortalRole;
}

export interface RegisterResult {
  success: boolean;
  needsEmailConfirmation: boolean;
  message: string;
  userId?: string;
}

export interface LoginResult {
  success: boolean;
  message: string;
  dashboardPath?: string;
  session?: Session | null;
  profile?: DbProfile | null;
}

const PORTAL_ROLES: PortalRole[] = ['admin', 'doctor', 'receptionist', 'security', 'ambulance'];

export function normalizePortalRole(role: string): PortalRole | null {
  const r = role.trim().toLowerCase();
  const normalized = r === 'reception' ? 'receptionist' : r;
  return PORTAL_ROLES.includes(normalized as PortalRole) ? (normalized as PortalRole) : null;
}

export function roleToDashboardPath(role: PortalRole): string {
  return DASHBOARD_BY_PORTAL_ROLE[role];
}

export function friendlyAuthError(error: AuthError | Error | null): string {
  if (!error) return 'An unexpected error occurred.';
  const msg = error.message.toLowerCase();
  if (msg.includes('database error saving new user')) {
    return (
      'Signup failed in the database. In Supabase SQL Editor, run the script ' +
      'supabase/migrations/002_fix_signup_database_error.sql then try again.'
    );
  }
  if (msg.includes('already registered') || msg.includes('already been registered')) {
    return 'This email is already registered. Try signing in instead.';
  }
  if (msg.includes('invalid login credentials')) {
    return 'Invalid email or password.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please verify your email before logging in.';
  }
  if (msg.includes('password')) {
    return 'Password must be at least 6 characters.';
  }
  return error.message;
}

async function rollbackPartialSignup(userId: string, reason: string) {
  console.error('[ERROR] Failure Reason:', reason);
  await supabase.from('user_roles').delete().eq('user_id', userId);
  await supabase.from('profiles').delete().eq('id', userId);
}

async function verifySignupRows(userId: string): Promise<{ ok: boolean; reason?: string }> {
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (profileErr || !profile) {
    return { ok: false, reason: profileErr?.message ?? 'Profile row missing after signup.' };
  }

  const { data: roleRow, error: roleErr } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (roleErr || !roleRow) {
    return { ok: false, reason: roleErr?.message ?? 'user_roles row missing after signup.' };
  }

  return { ok: true };
}

export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  const { data, error } = await withTimeout(
    supabase
      .from('profiles')
      .select('id, email, full_name, active_role, is_active')
      .eq('id', userId)
      .maybeSingle(),
    8000,
    { data: null, error: { message: 'Profile fetch timed out' } as { message: string } }
  );

  if (error) {
    console.error('[ERROR] Failure Reason:', error.message);
    return null;
  }
  if (!data) return null;

  let rawRole = data.active_role ?? '';
  if (!rawRole) {
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user?.id === userId) {
      const meta = userData.user.user_metadata ?? {};
      rawRole = String(meta.active_role ?? meta.role ?? '');
    }
  }

  const activeRole = normalizePortalRole(String(rawRole));
  if (!activeRole) {
    console.error('[ERROR] Failure Reason: invalid active_role in DB:', rawRole);
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    active_role: activeRole,
    is_active: data.is_active ?? true,
  };
}

async function registerViaServer(input: RegisterInput): Promise<RegisterResult | null> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (res.status === 503) {
      return null;
    }

    const payload = await res.json();
    if (!res.ok) {
      return {
        success: false,
        needsEmailConfirmation: false,
        message: payload.message ?? 'Registration failed.',
      };
    }

    return {
      success: payload.success,
      needsEmailConfirmation: payload.needsEmailConfirmation ?? false,
      userId: payload.userId,
      message: payload.message,
    };
  } catch {
    return null;
  }
}

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  const email = input.email.trim().toLowerCase();
  const { password, fullName, selectedRole } = input;

  console.log('[AUTH] Signup Start');

  const serverResult = await registerViaServer({
    email,
    password,
    fullName,
    selectedRole,
  });
  if (serverResult) {
    return serverResult;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        active_role: selectedRole,
      },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });

  if (error) {
    console.error('[ERROR] Failure Reason:', error.message);
    return { success: false, needsEmailConfirmation: false, message: friendlyAuthError(error) };
  }

  if (!data.user) {
    return {
      success: false,
      needsEmailConfirmation: false,
      message: 'Signup did not return a user. Check Supabase Auth settings.',
    };
  }

  console.log('[AUTH] User Created');
  const userId = data.user.id;
  const needsEmailConfirmation = !data.session;

  const waitForTriggerRows = async () => {
    for (let i = 0; i < 5; i++) {
      const verified = await verifySignupRows(userId);
      if (verified.ok) return true;
      await new Promise((r) => setTimeout(r, 400));
    }
    return false;
  };

  if (await waitForTriggerRows()) {
    console.log('[PROFILE] Insert Success');
    console.log('[ROLE] Insert Success');
    return {
      success: true,
      needsEmailConfirmation,
      userId,
      message: needsEmailConfirmation
        ? 'Account created successfully. Please verify your email before logging in.'
        : 'Account created successfully. You can sign in now.',
    };
  }

  if (!data.session) {
    return {
      success: false,
      needsEmailConfirmation: true,
      userId,
      message:
        'Account may have been created. Verify your email, then sign in. If login fails, run 002_fix_signup_database_error.sql in Supabase.',
    };
  }

  const profilePayload = {
    id: userId,
    email,
    full_name: fullName,
    active_role: selectedRole,
    is_active: true,
  };

  const { error: profileError } = await supabase.from('profiles').upsert(profilePayload, {
    onConflict: 'id',
  });

  if (profileError) {
    await rollbackPartialSignup(userId, profileError.message);
    return {
      success: false,
      needsEmailConfirmation: false,
      message: `Profile setup failed: ${profileError.message}`,
    };
  }
  console.log('[PROFILE] Insert Success');

  const { error: roleError } = await supabase.from('user_roles').upsert(
    { user_id: userId, role: selectedRole },
    { onConflict: 'user_id,role' }
  );

  if (roleError) {
    await rollbackPartialSignup(userId, roleError.message);
    return {
      success: false,
      needsEmailConfirmation: false,
      message: `Role assignment failed: ${roleError.message}`,
    };
  }
  console.log('[ROLE] Insert Success');

  const verified = await verifySignupRows(userId);
  if (!verified.ok) {
    return {
      success: false,
      needsEmailConfirmation: false,
      message: verified.reason ?? 'Could not verify account data after registration.',
    };
  }

  return {
    success: true,
    needsEmailConfirmation: false,
    userId,
    message: 'Account created successfully. You can sign in now.',
  };
}

export async function loginUser(
  email: string,
  password: string,
  portalRole: PortalRole
): Promise<LoginResult> {
  const emailNorm = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailNorm,
    password,
  });

  if (error || !data.user) {
    console.error('[ERROR] Failure Reason:', error?.message ?? 'No user in session');
    return { success: false, message: friendlyAuthError(error ?? new Error('Login failed')) };
  }

  console.log('[LOGIN] Login Success');

  const profile = await fetchProfile(data.user.id);
  if (!profile) {
    await supabase.auth.signOut();
    return {
      success: false,
      message: 'Profile not found. Complete registration or contact an administrator.',
    };
  }

  console.log('[PROFILE] Role Loaded:', profile.active_role);

  const activeRole = normalizePortalRole(profile.active_role);
  if (!activeRole || activeRole !== portalRole) {
    await supabase.auth.signOut();
    return {
      success: false,
      message: 'Access denied. This account belongs to a different portal.',
    };
  }

  const dashboardPath = roleToDashboardPath(activeRole);
  console.log('[ROUTER] Dashboard Redirect', dashboardPath);

  return {
    success: true,
    message: 'Login successful',
    dashboardPath,
    session: data.session,
    profile,
  };
}

export function profileFromAuthUser(user: User): DbProfile | null {
  const meta = user.user_metadata ?? {};
  const activeRole = normalizePortalRole(String(meta.active_role ?? meta.role ?? ''));
  if (!activeRole) return null;

  return {
    id: user.id,
    email: user.email ?? '',
    full_name: String(meta.full_name ?? user.email?.split('@')[0] ?? 'User'),
    active_role: activeRole,
    is_active: true,
  };
}

export function mapProfileToUserProfile(db: DbProfile) {
  return {
    id: db.id,
    email: db.email,
    full_name: db.full_name ?? '',
    role: db.active_role as RoleId,
    plan: 'pro' as const,
  };
}
