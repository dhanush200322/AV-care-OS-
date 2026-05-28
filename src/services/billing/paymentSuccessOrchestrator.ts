import type { Invoice, LabReport, Patient, PharmacyItem } from '../../store/useStore';
import { dispatchPaymentSuccessEvent, PAYMENT_SUCCESS_EVENT } from './billingRealtimeEvents';
import { createBillingAuditEntry, recordBillingAuditEntry } from './billingAuditService';
import { mapDepartmentBreakdown, toUnifiedServiceLines } from './departmentBillingMapper';
import { createUnifiedTransactionId } from './invoiceGenerator';
import { confirmLabPaymentAfterSuccess } from './labPaymentConfirmationService';
import { syncPharmacyInventoryAfterPayment } from './pharmacyInventorySync';
import { resolvePatientId } from './patientBillingAggregator';
import { useSharedPaymentStore } from './sharedPaymentStore';
import type { PaymentSuccessEvent, UnifiedPaymentMethod } from './unifiedInvoice.types';

export const orchestratePaymentSuccess = (
  invoice: Invoice,
  context: {
    patients: Patient[];
    pharmacyItems: PharmacyItem[];
    labReports: LabReport[];
    paymentMethod?: UnifiedPaymentMethod;
  },
) => {
  const sharedStore = useSharedPaymentStore.getState();
  const services = toUnifiedServiceLines(invoice);
  const departmentBreakdown = mapDepartmentBreakdown(services);
  const paymentMethod = context.paymentMethod || 'UPI';
  const transactionId = createUnifiedTransactionId(invoice.id);
  const auditLogId = `AUD-${invoice.id}-${Date.now().toString(36).toUpperCase()}`;
  const patientId = resolvePatientId(context.patients, invoice.patient);

  const { updatedItems, deductions } = sharedStore.hasProcessedInvoice(invoice.id)
    ? { updatedItems: context.pharmacyItems, deductions: [] }
    : syncPharmacyInventoryAfterPayment(invoice.id, services, context.pharmacyItems);

  const { updatedReports, confirmations } = sharedStore.hasProcessedInvoice(invoice.id)
    ? { updatedReports: context.labReports, confirmations: [] }
    : confirmLabPaymentAfterSuccess(invoice.id, invoice.patient, services, context.labReports);

  const event: PaymentSuccessEvent = {
    type: PAYMENT_SUCCESS_EVENT,
    invoiceId: invoice.id,
    patientId,
    patientName: invoice.patient,
    amount: invoice.amount,
    paymentMethod,
    transactionId,
    timestamp: new Date().toISOString(),
    auditLogId,
    departmentBreakdown,
    medicinesDeducted: deductions,
    labConfirmations: confirmations,
  };

  sharedStore.markInvoiceProcessed(invoice.id);
  sharedStore.pushPaymentEvent(event);
  recordBillingAuditEntry(createBillingAuditEntry(event, paymentMethod));
  dispatchPaymentSuccessEvent(event);

  return {
    event,
    updatedPharmacyItems: updatedItems,
    updatedLabReports: updatedReports,
  };
};
