import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { UserProfile, RoleId } from '../types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: (customRedirectPath?: string) => Promise<void>;
  isAdmin: boolean;
  hasRole: (roles: RoleId[]) => boolean;
  updatePlan?: (newPlan: 'free' | 'pro') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const clearAllAuthCookiesAndStorage = async () => {
  try {
    localStorage.removeItem("mock_authed_user");
    localStorage.removeItem("sb-bifxppsanaalorhvmjte-auth-token");
    localStorage.setItem("mock_signed_out", "true");
  } catch (e) {
    console.warn("localStorage clearing failed:", e);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const storedToken = localStorage.getItem('sb-bifxppsanaalorhvmjte-auth-token');
        if (storedToken) {
          const parsed = JSON.parse(storedToken);
          if (parsed && parsed.access_token) {
            const mockSession = {
              access_token: parsed.access_token,
              refresh_token: parsed.refresh_token || 'dummy-refresh',
              expires_in: 3600,
              token_type: "bearer",
              user: parsed.user
            } as any;
            
            setSession(mockSession);
            
            // Map profile dynamically from mock user or localStorage Profiles
            const user = parsed.user;
            const profiles = JSON.parse(localStorage.getItem("mock_db_profiles") || "[]");
            let userProfile = profiles.find((p: any) => p.id === user.id || p.email === user.email);
            
            if (!userProfile) {
              const savedIntended = (localStorage.getItem('intended_role') as RoleId) || 'admin';
              const activeRoleNorm = savedIntended === 'reception' ? 'receptionist' : savedIntended;
              
              userProfile = {
                id: user.id || 'mock-admin-user-uuid-12345',
                email: user.email || 'ro224313@gmail.com',
                full_name: user.user_metadata?.full_name || 'Protocol Executive',
                role: activeRoleNorm,
                plan: (localStorage.getItem(`plan_${user.id}`) as 'free' | 'pro') || 'pro'
              };
            }
            
            setProfile(userProfile);
          } else {
            setSession(null);
            setProfile(null);
          }
        } else {
          // If no custom logged in user and NOT signed out explicitly, log in as fallback admin
          const signedOut = localStorage.getItem("mock_signed_out") === "true";
          if (!signedOut) {
            const fallbackUser = {
              id: "mock-admin-user-uuid-12345",
              email: "ro224313@gmail.com",
              user_metadata: { full_name: "AV CARE Admin Executive" },
              aud: "authenticated",
              role: "authenticated"
            };
            const fallbackSession = {
              access_token: "dummy-token",
              refresh_token: "dummy-refresh",
              expires_in: 3600,
              token_type: "bearer",
              user: fallbackUser
            } as any;

            localStorage.setItem('sb-bifxppsanaalorhvmjte-auth-token', JSON.stringify(fallbackSession));
            localStorage.setItem('mock_authed_user', JSON.stringify(fallbackUser));
            localStorage.setItem('intended_role', 'admin');

            setSession(fallbackSession);
            setProfile({
              id: fallbackUser.id,
              email: fallbackUser.email,
              full_name: fallbackUser.user_metadata.full_name,
              role: 'admin',
              plan: 'pro'
            });
          } else {
            setSession(null);
            setProfile(null);
          }
        }
      } catch (err) {
        console.warn("Failed to load local simulation auth session:", err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen to mock login/logout triggers via supabase events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession) {
        setSession(currentSession as any);
        const user = currentSession.user;
        const profiles = JSON.parse(localStorage.getItem("mock_db_profiles") || "[]");
        let userProfile = profiles.find((p: any) => p.id === user.id || p.email === user.email);
        
        if (!userProfile) {
          const savedIntended = (localStorage.getItem('intended_role') as RoleId) || 'admin';
          const activeRoleNorm = savedIntended === 'reception' ? 'receptionist' : savedIntended;
          
          userProfile = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || 'System Worker',
            role: activeRoleNorm,
            plan: 'pro'
          };
        }
        setProfile(userProfile);
      } else {
        setSession(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async (customRedirectPath?: string | any) => {
    // Determine target redirect cleanly. Ignores mouse click events.
    const targetRedirect = (typeof customRedirectPath === 'string') ? customRedirectPath : '/';

    try {
      localStorage.removeItem("mock_authed_user");
      localStorage.removeItem("sb-bifxppsanaalorhvmjte-auth-token");
      localStorage.setItem("mock_signed_out", "true");
    } catch (e) {
      console.warn("Storage removal during signout failed:", e);
    }

    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Mock supabase signOut failed:", e);
    }

    setSession(null);
    setProfile(null);
    
    // Perform redirection to starting role selection view page smoothly
    navigate(targetRedirect);
  };

  const hasRole = (roles: RoleId[]) => {
    if (!profile) return false;
    const userRoleNorm = profile.role === 'receptionist' ? 'reception' : profile.role; 
    const rolesNorm = roles.map(r => r === 'receptionist' ? 'reception' : r);
    return rolesNorm.includes(userRoleNorm as any);
  };

  const updatePlan = async (newPlan: 'free' | 'pro') => {
    if (profile) {
      const updated = { ...profile, plan: newPlan };
      setProfile(updated);
      localStorage.setItem(`plan_${profile.id}`, newPlan);
    }
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signOut,
    isAdmin: profile?.role === 'admin',
    hasRole,
    updatePlan
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
  const { profile, loading } = useAuth();
  return { user: profile, loading };
};

export const useRole = () => {
  const { profile } = useAuth();
  return profile?.role ?? null;
};
