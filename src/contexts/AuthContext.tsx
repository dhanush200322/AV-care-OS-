import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { UserProfile, RoleId } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  hasRole: (roles: RoleId[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (id: string, email: string, metadata: any) => {
    try {
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('fetch timeout')), 1000)
      );
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error || !data) {
        // Handle owner override or auto-creation
        if (email === 'ro224313@gmail.com') {
          const adminProfile: UserProfile = {
            id,
            email,
            full_name: metadata?.full_name || 'System Admin',
            role: 'admin'
          };
          setProfile(adminProfile);
          return adminProfile;
        }

        const intendedRole = localStorage.getItem('intended_role') as RoleId;
        if (intendedRole) {
           const insertPromise = supabase
            .from('users')
            .insert([{
              id,
              email,
              full_name: metadata?.full_name || 'New User',
              role: intendedRole
            }])
            .select()
            .single();
           
           const { data: newUser, error: createError } = await Promise.race([insertPromise, timeoutPromise]) as any;
           
           if (!createError && newUser) {
             localStorage.removeItem('intended_role');
             setProfile(newUser);
             return newUser;
           }

           // MOCK FALLBACK for offline/paused Supabase
           console.warn("Supabase insert failed or timed out. Using mock profile.");
           const mockProfile: UserProfile = {
             id,
             email,
             full_name: metadata?.full_name || 'Mock User',
             role: intendedRole
           };
           setProfile(mockProfile);
           return mockProfile;
        }

        // MOCK FALLBACK for missing intendedRole but failed fetch
        console.warn("Supabase query failed or timed out. Using mock profile.");
        const fallbackRole = localStorage.getItem('intended_role') as RoleId || 'admin';
        const mockProfile: UserProfile = {
          id,
          email,
          full_name: metadata?.full_name || 'Mock User',
          role: fallbackRole
        };
        setProfile(mockProfile);
        return mockProfile;
      }

      // Sync owner role
      if (email === 'ro224313@gmail.com' && data.role !== 'admin') {
         const updatePromise = supabase
           .from('users')
           .update({ role: 'admin' })
           .eq('id', id)
           .select()
           .single();
         const { data: updated } = await Promise.race([updatePromise, timeoutPromise]) as any;
         if (updated) {
           setProfile(updated);
           return updated;
         }
      }

      setProfile(data);
      return data;
    } catch (e) {
      console.error("Auth profile fetch error:", e);
      // Failsafe Mock Profile
      const fallbackRole = localStorage.getItem('intended_role') as RoleId || 'admin';
      const mockProfile: UserProfile = {
        id,
        email,
        full_name: metadata?.full_name || 'Mock User',
        role: fallbackRole
      };
      setProfile(mockProfile);
      return mockProfile;
    }
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        let initialSession = null;
        
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('fetch timeout')), 1000)
        );
        
        const { data, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error("Supabase getSession error:", error);
        } else {
          initialSession = data?.session;
        }

        // Fallback for offline prototype
        if (!initialSession) {
           const mockTokenStr = localStorage.getItem('sb-bifxppsanaalorhvmjte-auth-token');
           if (mockTokenStr) {
              try {
                const mockToken = JSON.parse(mockTokenStr);
                if (mockToken && mockToken.access_token) {
                   initialSession = {
                      access_token: mockToken.access_token,
                      refresh_token: mockToken.refresh_token,
                      expires_in: 3600,
                      token_type: "bearer",
                      user: mockToken.user
                   } as any;
                }
              } catch (e) {}
           }
        }

        setSession(initialSession);
        
        if (initialSession) {
          await fetchProfile(
            initialSession.user.id,
            initialSession.user.email || '',
            initialSession.user.user_metadata
          );
        }
      } catch (err: any) {
        console.error("Failed to initialize session (network error?):", err);
        
        // Final fallback if await getSession() outright throws an exception or timeouts
        const mockTokenStr = localStorage.getItem('sb-bifxppsanaalorhvmjte-auth-token');
        if (mockTokenStr) {
           try {
             const mockToken = JSON.parse(mockTokenStr);
             if (mockToken && mockToken.access_token) {
                const initialSession = {
                   access_token: mockToken.access_token,
                   refresh_token: mockToken.refresh_token,
                   expires_in: 3600,
                   token_type: "bearer",
                   user: mockToken.user
                } as any;
                setSession(initialSession);
                await fetchProfile(
                  initialSession.user.id,
                  initialSession.user.email || '',
                  initialSession.user.user_metadata
                );
             }
           } catch (e) {}
        }
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        await fetchProfile(
          currentSession.user.id,
          currentSession.user.email || '',
          currentSession.user.user_metadata
        );
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('intended_role');
    setSession(null);
    setProfile(null);
  };

  const hasRole = (roles: RoleId[]) => {
    return profile ? roles.includes(profile.role) : false;
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signOut,
    isAdmin: profile?.role === 'admin',
    hasRole
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
