import type { Invoice, Payment, Patient } from '../../store/useStore';
import { generateUnifiedInvoice } from './invoiceGenerator';
import { aggregatePatientBilling, resolvePatientId } from './patientBillingAggregator';
import type { UnifiedInvoice } from './unifiedInvoice.types';

export const createUnifiedInvoiceView = (invoice: Invoice, patients: Patient[]): UnifiedInvoice =>
  generateUnifiedInvoice(invoice, resolvePatientId(patients, invoice.patient));

export const getUnifiedPatientBillingProfile = (
  patientName: string,
  patients: Patient[],
  invoices: Invoice[],
  payments: Payment[],
) => aggregatePatientBilling(patientName, patients, invoices, payments);
