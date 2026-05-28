import type { Invoice } from '../../store/useStore';
import { mapDepartmentBreakdown, toUnifiedServiceLines } from './departmentBillingMapper';
import type { UnifiedInvoice } from './unifiedInvoice.types';

export const createUnifiedTransactionId = (invoiceId: string) =>
  `TXN-${invoiceId}-${Date.now().toString(36).toUpperCase()}`;

export const generateUnifiedInvoice = (
  invoice: Invoice,
  patientId = 'patient-id-pending',
  insuranceDeduction = 0,
): UnifiedInvoice => {
  const services = toUnifiedServiceLines(invoice);
  const departmentBreakdown = mapDepartmentBreakdown(services);
  const taxAmount = Number((invoice.amount * 0.18).toFixed(2));
  const outstandingBalance = invoice.status === 'Paid' ? 0 : Math.max(0, invoice.amount + taxAmount - insuranceDeduction);

  return {
    ...invoice,
    patientId,
    services,
    departmentBreakdown,
    taxAmount,
    insuranceDeduction,
    outstandingBalance,
    transactionId: createUnifiedTransactionId(invoice.id),
  };
};
