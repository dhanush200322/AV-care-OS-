import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RoleId } from '../types';
import { getDashboardPathForRole } from '../lib/authRoutes';
import { normalizePortalRole } from '../lib/authService';

interface ProtectedRouteProps {
  allowedRoles: RoleId[];
  children: React.ReactNode;
}

function normalizeRoleForCompare(role: string): string {
  const normalized = normalizePortalRole(role);
  return normalized ?? role.trim().toLowerCase();
}

function roleFromSession(session: { user: { user_metadata?: Record<string, unknown>; email?: string } }): string | null {
  const meta = session.user.user_metadata ?? {};
  const raw = String(meta.active_role ?? meta.role ?? '');
  return normalizePortalRole(raw);
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { profile, initializing, session } = useAuth();
  const location = useLocation();

  const portalSegment = location.pathname.split('/')[1] || 'admin';
  const loginPath = `/${portalSegment === 'reception' ? 'receptionist' : portalSegment}/login`;

  if (initializing) {
    return (
      <div className="min-h-screen w-full bg-[#050816] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to={loginPath} replace />;
  }

  const effectiveRole =
    (profile && normalizeRoleForCompare(profile.role)) ||
    roleFromSession(session) ||
    null;

  if (!effectiveRole) {
    return <Navigate to={loginPath} replace />;
  }

  const allowed = allowedRoles.map(normalizeRoleForCompare);
  const hasAccess = allowed.includes(effectiveRole);

  if (!hasAccess) {
    const correctDashboard = getDashboardPathForRole(effectiveRole);
    if (correctDashboard) {
      return <Navigate to={correctDashboard} replace />;
    }
    return <Navigate to={`${loginPath}?error=${encodeURIComponent('Unauthorized access for this role.')}`} replace />;
  }

  return <>{children}</>;
};
