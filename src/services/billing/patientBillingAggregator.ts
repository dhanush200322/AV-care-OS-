import type { Invoice, Patient, Payment } from '../../store/useStore';
import { mapDepartmentBreakdown, toUnifiedServiceLines } from './departmentBillingMapper';
import type { PatientBillingProfile } from './unifiedInvoice.types';

export const resolvePatientId = (patients: Patient[], patientName: string) =>
  patients.find((patient) => patient.name.toLowerCase() === patientName.toLowerCase())?.id || 'patient-id-pending';

export const aggregatePatientBilling = (
  patientName: string,
  patients: Patient[],
  invoices: Invoice[],
  payments: Payment[],
): PatientBillingProfile => {
  const patientInvoices = invoices.filter((invoice) => invoice.patient.toLowerCase() === patientName.toLowerCase());
  const patient = patients.find((item) => item.name.toLowerCase() === patientName.toLowerCase()) || null;
  const invoiceIds = new Set(patientInvoices.map((invoice) => invoice.id));
  const patientPayments = payments.filter((payment) => invoiceIds.has(payment.invoiceId));
  const services = patientInvoices.flatMap(toUnifiedServiceLines);

  return {
    patient,
    patientName,
    patientId: patient?.id || 'patient-id-pending',
    invoices: patientInvoices,
    payments: patientPayments,
    outstandingBalance: patientInvoices
      .filter((invoice) => invoice.status === 'Pending')
      .reduce((sum, invoice) => sum + invoice.amount, 0),
    departmentBreakdown: mapDepartmentBreakdown(services),
  };
};
