import React, { Suspense } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import type { RoleId } from '../../types';
import { CookieConsentCard } from './CookieConsentCard';
import {
  appendConsentAuditLog,
  defaultCookiePreferences,
  deniedCookiePreferences,
  readStoredConsent,
  resetStoredConsent,
  saveStoredConsent,
} from './cookieConsentStore';
import {
  createAuditLogId,
  createConsentNotificationEvent,
} from './NotificationConsentEvent';
import { pushConsentNotificationEvent } from './notificationService';
import type {
  ConsentToast,
  CookieCategoryId,
  CookiePreferences,
  SecurityStatus,
  StoredCookieConsent,
} from './consent.types';

const CookiePreferencesModal = React.lazy(() =>
  import('./CookiePreferencesModal').then((module) => ({ default: module.CookiePreferencesModal })),
);

type CookieConsentContextValue = {
  acceptAll: () => void;
  closePreferences: () => void;
  denyAll: () => void;
  draftPreferences: CookiePreferences;
  openPreferences: () => void;
  resetPreferences: () => void;
  savePreferences: () => void;
  setDraftPreference: (category: CookieCategoryId, value: boolean) => void;
};

type CookieConsentProviderProps = {
  activePath: string;
  selectedRole: RoleId;
};

export const CookieConsentContext = React.createContext<CookieConsentContextValue | null>(null);

const getSecurityStatus = (preferences: CookiePreferences): SecurityStatus => {
  if (!preferences.analytics && !preferences.securityMonitoring && !preferences.preferences && !preferences.authentication) {
    return 'limited';
  }

  if (Object.values(preferences).every(Boolean)) {
    return 'secured';
  }

  return 'custom';
};

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({
  activePath,
  selectedRole,
}) => {
  const [isReady, setIsReady] = React.useState(false);
  const [hasConsent, setHasConsent] = React.useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = React.useState(false);
  const [draftPreferences, setDraftPreferences] = React.useState<CookiePreferences>(defaultCookiePreferences);
  const [toasts, setToasts] = React.useState<ConsentToast[]>([]);

  React.useEffect(() => {
    const stored = readStoredConsent();
    setHasConsent(Boolean(stored));
    if (stored) setDraftPreferences(stored.preferences);
    setIsReady(true);
  }, []);

  const showToast = React.useCallback((type: ConsentToast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4600);
  }, []);

  const persistConsent = React.useCallback((
    action: StoredCookieConsent['action'],
    preferences: CookiePreferences,
  ) => {
    const securityStatus = getSecurityStatus(preferences);
    const auditLogId = createAuditLogId();
    const consent: StoredCookieConsent = {
      action,
      preferences,
      selectedRole,
      timestamp: new Date().toISOString(),
      auditLogId,
      securityStatus,
    };

    saveStoredConsent(consent);
    appendConsentAuditLog(consent);
    setHasConsent(true);
    setDraftPreferences(preferences);

    const event = createConsentNotificationEvent(selectedRole, action, securityStatus, auditLogId);

    if (action === 'denied') {
      pushConsentNotificationEvent(event);
    } else {
      window.dispatchEvent(new CustomEvent('avcare:consent-notification', { detail: event }));
    }
  }, [selectedRole]);

  const acceptAll = React.useCallback(() => {
    persistConsent('accepted', defaultCookiePreferences);
    showToast('success', 'Privacy preferences secured successfully.');
  }, [persistConsent, showToast]);

  const denyAll = React.useCallback(() => {
    persistConsent('denied', deniedCookiePreferences);
    showToast('warning', 'Some secure platform features may be limited.');
  }, [persistConsent, showToast]);

  const openPreferences = React.useCallback(() => setIsPreferencesOpen(true), []);
  const closePreferences = React.useCallback(() => setIsPreferencesOpen(false), []);

  const setDraftPreference = React.useCallback((category: CookieCategoryId, value: boolean) => {
    if (category === 'essential') return;
    setDraftPreferences((current) => ({ ...current, [category]: value }));
  }, []);

  const resetPreferences = React.useCallback(() => {
    resetStoredConsent();
    setHasConsent(false);
    setDraftPreferences(defaultCookiePreferences);
    showToast('warning', 'Privacy preferences reset.');
  }, [showToast]);

  const savePreferences = React.useCallback(() => {
    persistConsent('customized', { ...draftPreferences, essential: true });
    setIsPreferencesOpen(false);
    showToast('success', 'Privacy preferences secured successfully.');
  }, [draftPreferences, persistConsent, showToast]);

  const contextValue = React.useMemo<CookieConsentContextValue>(() => ({
    acceptAll,
    closePreferences,
    denyAll,
    draftPreferences,
    openPreferences,
    resetPreferences,
    savePreferences,
    setDraftPreference,
  }), [
    acceptAll,
    closePreferences,
    denyAll,
    draftPreferences,
    openPreferences,
    resetPreferences,
    savePreferences,
    setDraftPreference,
  ]);

  if (!isReady || typeof document === 'undefined') {
    return null;
  }

  const shouldShowCard = activePath === '/' && !hasConsent;

  return createPortal(
    <CookieConsentContext.Provider value={contextValue}>
      <div className="pointer-events-none fixed inset-0 z-[2147482999] font-sans">
        <AnimatePresence>
          {shouldShowCard && <CookieConsentCard />}
          {isPreferencesOpen && (
            <Suspense fallback={null}>
              <CookiePreferencesModal />
            </Suspense>
          )}
        </AnimatePresence>

        <div aria-live="polite" className="fixed right-3 top-3 z-[2147483002] flex w-[min(360px,calc(100vw-1.5rem))] flex-col gap-2 sm:right-5 sm:top-5">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.98 }}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-3 pr-9 text-[11px] font-bold tracking-[0.02em] shadow-2xl backdrop-blur-2xl ${
                  toast.type === 'success'
                    ? 'border-emerald-300/20 bg-emerald-950/80 text-emerald-100'
                    : 'border-amber-300/20 bg-amber-950/80 text-amber-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  {toast.type === 'success' ? <CheckCircle2 size={15} aria-hidden="true" /> : <AlertTriangle size={15} aria-hidden="true" />}
                  <span>{toast.message}</span>
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-current/60 hover:bg-white/10 hover:text-current"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </CookieConsentContext.Provider>,
    document.body,
  );
};
