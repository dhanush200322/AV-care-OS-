import { useMemo } from 'react';
import { matchesRole, PortalAudience, useCommunicationStore } from '../store/communicationStore';

/** Inbox broadcasts for dashboard announcement banners. */
export function useCommunicationInbox(portalRole: PortalAudience, userId?: string) {
  const communications = useCommunicationStore((s) => s.communications);

  return useMemo(
    () =>
      communications
        .filter((c) => !c.archived && c.targetType !== 'user' && matchesRole(c, portalRole, userId))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [communications, portalRole, userId]
  );
}
