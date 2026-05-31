import type { PortalRole } from './authService';

export const DASHBOARD_BY_PORTAL_ROLE: Record<PortalRole, string> = {
  admin: '/admin/dashboard',
  doctor: '/doctor/dashboard',
  receptionist: '/receptionist/dashboard',
  security: '/security/dashboard',
  ambulance: '/ambulance/dashboard',
};

export function getDashboardPathForRole(role: string): string | null {
  const r = role.trim().toLowerCase();
  const normalized = r === 'reception' ? 'receptionist' : r;
  if (normalized in DASHBOARD_BY_PORTAL_ROLE) {
    return DASHBOARD_BY_PORTAL_ROLE[normalized as PortalRole];
  }
  return null;
}

export function isAuthPage(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/auth' ||
    pathname.endsWith('/login') ||
    pathname.endsWith('/register')
  );
}

export function portalRoleFromPath(pathname: string): PortalRole | null {
  const segment = pathname.split('/')[1]?.toLowerCase();
  if (segment === 'reception') return 'receptionist';
  const roles: PortalRole[] = ['admin', 'doctor', 'receptionist', 'security', 'ambulance'];
  return roles.includes(segment as PortalRole) ? (segment as PortalRole) : null;
}

/** Only redirect away from auth pages when the URL matches the user's role. */
export function canAutoRedirectFromAuthPath(pathname: string, userRole: string): boolean {
  if (!isAuthPage(pathname)) return false;
  if (pathname === '/' || pathname === '/auth') return true;

  const pathPortal = portalRoleFromPath(pathname);
  if (!pathPortal) return true;

  const userNorm = userRole === 'reception' ? 'receptionist' : userRole.trim().toLowerCase();
  return pathPortal === userNorm;
}
