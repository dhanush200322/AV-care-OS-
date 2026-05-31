import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { normalizePortalRole, useCommunicationStore } from '../store/communicationStore';

/** Initializes communication realtime + storage sync for the signed-in portal role. */
export function useCommunicationHub() {
  const { profile, user } = useAuth();
  const subscribeRealtime = useCommunicationStore((s) => s.subscribeRealtime);
  const initFromStorage = useCommunicationStore((s) => s.initFromStorage);

  const portalRole = profile?.role ? normalizePortalRole(profile.role) ?? 'admin' : 'admin';

  useEffect(() => {
    initFromStorage();
    const unsub = subscribeRealtime();
    return unsub;
  }, [initFromStorage, subscribeRealtime]);

  return { portalRole, userId: user?.id };
}
