import React, { useEffect } from 'react';
import { useCommunicationHub } from '../../../hooks/useCommunicationHub';
import { EmergencyBroadcastBanner } from './EmergencyBroadcastBanner';

interface CommunicationHubLayerProps {
  accent?: string;
  onToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

/** Mount once per dashboard — realtime sync, emergency overlay, toast bridge. */
export const CommunicationHubLayer: React.FC<CommunicationHubLayerProps> = ({
  accent,
  onToast,
}) => {
  useCommunicationHub();

  useEffect(() => {
    if (!onToast) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ type?: 'success' | 'error' | 'info'; message: string }>).detail;
      if (detail?.message) onToast(detail.type ?? 'info', detail.message);
    };
    window.addEventListener('avcare:toast', handler);
    return () => window.removeEventListener('avcare:toast', handler);
  }, [onToast]);

  return <EmergencyBroadcastBanner accent={accent} />;
};
