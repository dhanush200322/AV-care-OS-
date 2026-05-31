import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  fetchProfile,
  loginUser,
  mapProfileToUserProfile,
  PortalRole,
  profileFromAuthUser,
  registerUser,
  RegisterInput,
  RegisterResult,
} from '../lib/authService';
import { canAutoRedirectFromAuthPath, getDashboardPathForRole } from '../lib/authRoutes';
import { UserProfile, RoleId } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  initializing: boolean;
  signUp: (input: RegisterInput) => Promise<RegisterResult>;
  signIn: (
    email: string,
    password: string,
    portalRole: PortalRole
  ) => Promise<{ success: boolean; message: string; dashboardPath?: string }>;
  signOut: (customRedirectPath?: string) => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  hasRole: (roles: RoleId[]) => boolean;
  updatePlan?: (newPlan: 'free' | 'pro') => Promise<void>;
  updateProfile?: (updatedFields: Partial<UserProfile & { phone?: string; location?: string }>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INIT_TIMEOUT_MS = 2500;

export const clearLegacyMockAuthStorage = () => {
  try {
    localStorage.removeItem('mock_authed_user');
    localStorage.removeItem('mock_signed_out');
    localStorage.removeItem('sb-bifxppsanaalorhvmjte-auth-token');
    localStorage.removeItem('intended_role');
  } catch (e) {
    console.warn('Legacy auth storage cleanup failed:', e);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const redirectingRef = useRef(false);
  const initCompletedRef = useRef(false);

  const completeInitializing = useCallback(() => {
    if (!initCompletedRef.current) {
      initCompletedRef.current = true;
      setInitializing(false);
    }
  }, []);

  const applyAuthState = useCallback((nextSession: Session | null, nextProfile: UserProfile | null) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
    setProfile(nextProfile);
  }, []);

  const resolveProfile = useCallback(async (authUser: User): Promise<UserProfile | null> => {
    const dbProfile = await fetchProfile(authUser.id);
    if (dbProfile) {
      return mapProfileToUserProfile(dbProfile);
    }
    const fallback = profileFromAuthUser(authUser);
    return fallback ? mapProfileToUserProfile(fallback) : null;
  }, []);

  const loadProfileInBackground = useCallback(
    async (authUser: User, currentSession: Session) => {
      const mapped = await resolveProfile(authUser);
      if (mapped) {
        applyAuthState(currentSession, mapped);
        const pathname = window.location.pathname;
        if (
          canAutoRedirectFromAuthPath(pathname, mapped.role) &&
          !redirectingRef.current
        ) {
          redirectingRef.current = true;
          const path = getDashboardPathForRole(mapped.role);
          if (path) {
            console.log('[ROUTER] Dashboard Redirect', path);
            navigate(path, { replace: true });
          }
          setTimeout(() => {
            redirectingRef.current = false;
          }, 300);
        }
      }
    },
    [applyAuthState, navigate, resolveProfile]
  );

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const mapped = await resolveProfile(data.user);
      setProfile(mapped);
    } else {
      setProfile(null);
    }
  }, [resolveProfile]);

  useEffect(() => {
    let mounted = true;
    clearLegacyMockAuthStorage();

    const safetyTimer = window.setTimeout(() => {
      if (mounted) {
        console.warn('[AUTH] Init safety timeout — showing UI');
        completeInitializing();
      }
    }, INIT_TIMEOUT_MS);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;

      // Defer async work — awaiting inside this callback can deadlock getSession (infinite spinner).
      window.setTimeout(() => {
        if (!mounted) return;

        void (async () => {
          try {
            if (event === 'SIGNED_OUT' || !nextSession?.user) {
              applyAuthState(null, null);
              completeInitializing();
              return;
            }

            const authUser = nextSession.user;
            const fallback = profileFromAuthUser(authUser);
            const quickProfile = fallback ? mapProfileToUserProfile(fallback) : null;
            const pathname = window.location.pathname;

            if (
              quickProfile &&
              pathname.endsWith('/login') &&
              !canAutoRedirectFromAuthPath(pathname, quickProfile.role)
            ) {
              completeInitializing();
              return;
            }

            applyAuthState(nextSession, quickProfile);
            completeInitializing();

            await loadProfileInBackground(authUser, nextSession);
          } catch (err) {
            console.error('[ERROR] Failure Reason:', err);
            completeInitializing();
          }
        })();
      }, 0);
    });

    return () => {
      mounted = false;
      window.clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, [applyAuthState, completeInitializing, loadProfileInBackground]);

  const signUp = async (input: RegisterInput): Promise<RegisterResult> => {
    return registerUser(input);
  };

  const signIn = async (email: string, password: string, portalRole: PortalRole) => {
    const result = await loginUser(email, password, portalRole);

    if (!result.success || !result.dashboardPath) {
      applyAuthState(null, null);
      return { success: result.success, message: result.message };
    }

    const nextSession = result.session ?? null;
    let mappedProfile: UserProfile | null = null;
    if (result.profile) {
      mappedProfile = mapProfileToUserProfile(result.profile);
    } else if (nextSession?.user) {
      const fallback = profileFromAuthUser(nextSession.user);
      if (fallback) mappedProfile = mapProfileToUserProfile(fallback);
    }

    applyAuthState(nextSession, mappedProfile);

    if (mappedProfile) {
      console.log('[PROFILE] Role Loaded:', mappedProfile.role);
    }

    const path = result.dashboardPath;
    console.log('[ROUTER] Dashboard Redirect', path);
    redirectingRef.current = true;
    navigate(path, { replace: true });
    setTimeout(() => {
      redirectingRef.current = false;
    }, 300);

    if (nextSession?.user) {
      void loadProfileInBackground(nextSession.user, nextSession);
    }

    return {
      success: true,
      message: result.message,
      dashboardPath: path,
    };
  };

  const getCurrentUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  };

  const signOut = async (customRedirectPath?: string | unknown) => {
    const targetRedirect = typeof customRedirectPath === 'string' ? customRedirectPath : '/';
    redirectingRef.current = false;
    await supabase.auth.signOut();
    clearLegacyMockAuthStorage();
    applyAuthState(null, null);
    navigate(targetRedirect);
  };

  const hasRole = (roles: RoleId[]) => {
    if (!profile) return false;
    const userRole = profile.role === 'reception' ? 'receptionist' : profile.role;
    const normalized = roles.map((r) => (r === 'reception' || r === 'receptionist' ? 'receptionist' : r));
    return normalized.includes(userRole as RoleId);
  };

  const updatePlan = async (newPlan: 'free' | 'pro') => {
    if (profile) {
      setProfile({ ...profile, plan: newPlan });
      localStorage.setItem(`plan_${profile.id}`, newPlan);
    }
  };

  const updateProfile = async (
    updatedFields: Partial<UserProfile & { phone?: string; location?: string }>
  ) => {
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updatedFields.full_name ?? profile.full_name,
        email: updatedFields.email ?? profile.email,
      })
      .eq('id', profile.id);

    if (error) {
      console.error('[ERROR] Failure Reason:', error.message);
      return;
    }

    setProfile({ ...profile, ...updatedFields });
  };

  const value: AuthContextType = {
    session,
    user,
    profile,
    initializing,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    refreshProfile,
    isAdmin: profile?.role === 'admin',
    hasRole,
    updatePlan,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useCurrentUser = () => {
  const { profile, initializing } = useAuth();
  return { user: profile, loading: initializing };
};

export const useRole = () => {
  const { profile } = useAuth();
  return profile?.role ?? null;
};
