import { create } from 'zustand';
import type { BillingAuditEntry, PaymentSuccessEvent } from './unifiedInvoice.types';

interface SharedPaymentState {
  processedInvoiceIds: string[];
  stockDeductionKeys: string[];
  labConfirmationKeys: string[];
  paymentEvents: PaymentSuccessEvent[];
  auditEntries: BillingAuditEntry[];
  markInvoiceProcessed: (invoiceId: string) => void;
  markStockDeducted: (key: string) => void;
  markLabConfirmed: (key: string) => void;
  pushPaymentEvent: (event: PaymentSuccessEvent) => void;
  pushAuditEntry: (entry: BillingAuditEntry) => void;
  hasProcessedInvoice: (invoiceId: string) => boolean;
  hasStockDeduction: (key: string) => boolean;
  hasLabConfirmation: (key: string) => boolean;
}

const unique = (items: string[], next: string) => (items.includes(next) ? items : [next, ...items]);

export const useSharedPaymentStore = create<SharedPaymentState>((set, get) => ({
  processedInvoiceIds: [],
  stockDeductionKeys: [],
  labConfirmationKeys: [],
  paymentEvents: [],
  auditEntries: [],
  markInvoiceProcessed: (invoiceId) => set((state) => ({
    processedInvoiceIds: unique(state.processedInvoiceIds, invoiceId),
  })),
  markStockDeducted: (key) => set((state) => ({
    stockDeductionKeys: unique(state.stockDeductionKeys, key),
  })),
  markLabConfirmed: (key) => set((state) => ({
    labConfirmationKeys: unique(state.labConfirmationKeys, key),
  })),
  pushPaymentEvent: (event) => set((state) => ({
    paymentEvents: [event, ...state.paymentEvents].slice(0, 100),
  })),
  pushAuditEntry: (entry) => set((state) => ({
    auditEntries: [entry, ...state.auditEntries].slice(0, 200),
  })),
  hasProcessedInvoice: (invoiceId) => get().processedInvoiceIds.includes(invoiceId),
  hasStockDeduction: (key) => get().stockDeductionKeys.includes(key),
  hasLabConfirmation: (key) => get().labConfirmationKeys.includes(key),
}));
