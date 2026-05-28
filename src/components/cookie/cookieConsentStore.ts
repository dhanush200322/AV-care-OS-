import type { CookiePreferences, StoredCookieConsent } from './consent.types';

const CONSENT_KEY = 'avcare_cookie_consent_v1';
const AUDIT_KEY = 'avcare_cookie_consent_audit_v1';

export const defaultCookiePreferences: CookiePreferences = {
  essential: true,
  authentication: true,
  analytics: true,
  securityMonitoring: true,
  preferences: true,
};

export const deniedCookiePreferences: CookiePreferences = {
  essential: true,
  authentication: false,
  analytics: false,
  securityMonitoring: false,
  preferences: false,
};

export const readStoredConsent = (): StoredCookieConsent | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as StoredCookieConsent) : null;
  } catch {
    return null;
  }
};

export const saveStoredConsent = (consent: StoredCookieConsent) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
};

export const resetStoredConsent = () => {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(CONSENT_KEY);
};

export const appendConsentAuditLog = (consent: StoredCookieConsent) => {
  if (typeof window === 'undefined') return;

  try {
    const current = JSON.parse(window.localStorage.getItem(AUDIT_KEY) || '[]') as StoredCookieConsent[];
    window.localStorage.setItem(AUDIT_KEY, JSON.stringify([consent, ...current].slice(0, 50)));
  } catch {
    window.localStorage.setItem(AUDIT_KEY, JSON.stringify([consent]));
  }
};
