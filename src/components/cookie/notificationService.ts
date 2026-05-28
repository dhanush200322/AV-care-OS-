import { useStore } from '../../store/useStore';
import { useSecurityStore } from '../../store/securityStore';
import type { NotificationConsentEvent } from './consent.types';

const CONSENT_EVENT_NAME = 'avcare:consent-notification';
const EMAIL_EVENT_NAME = 'avcare:consent-email-notification';

export const pushConsentNotificationEvent = (event: NotificationConsentEvent) => {
  const adminMessage = `Privacy consent ${event.consentAction} for ${event.selectedRole} role. Audit: ${event.auditLogId}`;
  const securityMessage = `Cookie consent ${event.consentAction}; security status ${event.securityStatus}.`;

  useStore.getState().addNotification({
    message: adminMessage,
    type: 'system',
  });

  useSecurityStore.getState().addAlert({
    title: 'Privacy consent event',
    source: 'AV CARE OS Consent Layer',
    severity: event.securityStatus === 'limited' ? 'Warning' : 'Info',
    message: securityMessage,
    status: 'Active',
  });

  useSecurityStore.getState().logActivity({
    module: 'alerts',
    action: 'create',
    entityId: event.auditLogId,
    summary: securityMessage,
  });

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT_NAME, { detail: event }));
  window.dispatchEvent(new CustomEvent(EMAIL_EVENT_NAME, { detail: event }));
};

export const consentNotificationEvents = {
  notification: CONSENT_EVENT_NAME,
  email: EMAIL_EVENT_NAME,
};
