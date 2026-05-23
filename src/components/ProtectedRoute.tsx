import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RoleId } from '../types';

interface ProtectedRouteProps {
  allowedRoles: RoleId[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles, 
  children 
}) => {
  const { profile, loading, session, signOut } = useAuth();
  const location = useLocation();

  const userRoleNorm = profile?.role === 'receptionist' ? 'reception' : profile?.role; 
  const allowedRolesNorm = allowedRoles.map(r => r === 'receptionist' ? 'reception' : r); 
  const hasMismatch = profile && !allowedRolesNorm.includes(userRoleNorm as any);

  useEffect(() => {
    if (hasMismatch) {
      console.warn(`STRICT RBAC PROTECTION: signed-in user role is "${profile?.role}", which is not authorized for "${location.pathname}". Logging out.`);
      signOut();
    }
  }, [hasMismatch, profile, signOut, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#050816] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    const pathParts = location.pathname.split('/');
    const attemptedSection = pathParts[1] || 'admin';
    const loginPath = `/${attemptedSection === 'receptionist' ? 'reception' : attemptedSection}/login`;
    return <Navigate to={loginPath} replace />;
  }

  if (hasMismatch) {
    const pathParts = location.pathname.split('/');
    const attemptedSection = pathParts[1] || 'admin';
    const loginPath = `/${attemptedSection === 'receptionist' ? 'reception' : attemptedSection}/login`;
    return <Navigate to={`${loginPath}?error=${encodeURIComponent("Unauthorized access for this role.")}`} replace />;
  }

  return <>{children}</>;
};
