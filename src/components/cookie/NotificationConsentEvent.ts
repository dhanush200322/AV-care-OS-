import type {
  ConsentAction,
  ConsentBrowserInfo,
  ConsentDeviceInfo,
  ConsentSessionMetadata,
  NotificationConsentEvent,
  SecurityStatus,
} from './consent.types';
import type { RoleId } from '../../types';

const getSessionId = () => {
  const key = 'avcare_consent_session_id';
  const existing = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : null;

  if (existing) return existing;

  const nextId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(key, nextId);
  }

  return nextId;
};

export const createAuditLogId = () =>
  `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const getDeviceInfo = (): ConsentDeviceInfo => ({
  platform: navigator.platform || 'unknown',
  language: navigator.language || 'unknown',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
  screen: `${window.screen.width}x${window.screen.height}`,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
});

const getBrowserInfo = (): ConsentBrowserInfo => ({
  userAgent: navigator.userAgent || 'unknown',
  vendor: navigator.vendor || 'unknown',
  cookieEnabled: navigator.cookieEnabled,
});

const getSessionMetadata = (): ConsentSessionMetadata => ({
  ipAddress: 'backend-resolved',
  sessionId: getSessionId(),
  websocketReady: true,
  emailNotificationQueued: true,
});

export const createConsentNotificationEvent = (
  selectedRole: RoleId,
  consentAction: ConsentAction,
  securityStatus: SecurityStatus,
  auditLogId = createAuditLogId(),
): NotificationConsentEvent => ({
  selectedRole,
  consentAction,
  timestamp: new Date().toISOString(),
  deviceInfo: getDeviceInfo(),
  browserInfo: getBrowserInfo(),
  sessionMetadata: getSessionMetadata(),
  securityStatus,
  auditLogId,
});
