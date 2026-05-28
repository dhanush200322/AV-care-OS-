import type { RoleId } from '../../types';

export type ConsentAction = 'accepted' | 'denied' | 'customized' | 'reset';

export type CookieCategoryId =
  | 'essential'
  | 'authentication'
  | 'analytics'
  | 'securityMonitoring'
  | 'preferences';

export type SecurityStatus = 'secured' | 'limited' | 'custom';

export interface CookiePreferences {
  essential: true;
  authentication: boolean;
  analytics: boolean;
  securityMonitoring: boolean;
  preferences: boolean;
}

export interface StoredCookieConsent {
  action: ConsentAction;
  preferences: CookiePreferences;
  selectedRole: RoleId;
  timestamp: string;
  auditLogId: string;
  securityStatus: SecurityStatus;
}

export interface ConsentDeviceInfo {
  platform: string;
  language: string;
  timezone: string;
  screen: string;
  viewport: string;
}

export interface ConsentBrowserInfo {
  userAgent: string;
  vendor: string;
  cookieEnabled: boolean;
}

export interface ConsentSessionMetadata {
  ipAddress: 'backend-resolved';
  sessionId: string;
  websocketReady: boolean;
  emailNotificationQueued: boolean;
}

export interface NotificationConsentEvent {
  selectedRole: RoleId;
  consentAction: ConsentAction;
  timestamp: string;
  deviceInfo: ConsentDeviceInfo;
  browserInfo: ConsentBrowserInfo;
  sessionMetadata: ConsentSessionMetadata;
  securityStatus: SecurityStatus;
  auditLogId: string;
}

export type ConsentToast = {
  id: string;
  type: 'success' | 'warning';
  message: string;
};
