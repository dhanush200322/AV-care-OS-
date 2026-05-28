import type { BillingAuditEntry, PaymentSuccessEvent, UnifiedPaymentMethod } from './unifiedInvoice.types';
import { persistPaymentAuditEntry } from './paymentAuditLogger';
import { useSharedPaymentStore } from './sharedPaymentStore';

export const createBillingAuditEntry = (
  event: PaymentSuccessEvent,
  paymentMethod: UnifiedPaymentMethod,
): BillingAuditEntry => ({
  id: event.auditLogId,
  patientId: event.patientId,
  patientName: event.patientName,
  invoiceId: event.invoiceId,
  transactionId: event.transactionId,
  paymentAmount: event.amount,
  paymentMethod,
  medicinesDeducted: event.medicinesDeducted,
  labConfirmations: event.labConfirmations,
  departmentMappings: event.departmentBreakdown,
  timestamp: event.timestamp,
  billingOperator: 'AV CARE OS Billing Counter',
  refundHistory: [],
});

export const recordBillingAuditEntry = (entry: BillingAuditEntry) => {
  useSharedPaymentStore.getState().pushAuditEntry(entry);
  persistPaymentAuditEntry(entry);
};
