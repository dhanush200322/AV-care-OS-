import { useMemo } from 'react';
import {
  notificationMatches,
  PortalAudience,
  useCommunicationStore,
} from '../store/communicationStore';

/** Unread notification count for a portal role (sidebar badges, headers). */
export function useCommunicationUnread(portalRole: PortalAudience, userId?: string) {
  const allNotifications = useCommunicationStore((s) => s.notifications);

  return useMemo(() => {
    return allNotifications.filter(
      (n) => notificationMatches(n, portalRole, userId) && !n.isRead
    ).length;
  }, [allNotifications, portalRole, userId]);
}
