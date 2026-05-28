import type { BillingAuditEntry } from './unifiedInvoice.types';

const AUDIT_STORAGE_KEY = 'avcare_unified_billing_audit_v1';

export const persistPaymentAuditEntry = (entry: BillingAuditEntry) => {
  if (typeof window === 'undefined') return;

  try {
    const current = JSON.parse(window.localStorage.getItem(AUDIT_STORAGE_KEY) || '[]') as BillingAuditEntry[];
    window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([entry, ...current].slice(0, 250)));
  } catch {
    window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([entry]));
  }
};
