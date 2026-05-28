import type { LabReport } from '../../store/useStore';
import type { LabPaymentConfirmation, UnifiedServiceLine } from './unifiedInvoice.types';
import { inferBillingDepartment } from './departmentBillingMapper';
import { useSharedPaymentStore } from './sharedPaymentStore';

const serviceMatchesReport = (service: UnifiedServiceLine, report: LabReport) => {
  if (service.labReportId) return service.labReportId === report.id;

  const serviceName = service.name.toLowerCase();
  return (
    serviceName.includes(report.id.toLowerCase()) ||
    serviceName.includes(report.test.toLowerCase()) ||
    serviceName.includes(`lab test: ${report.test.toLowerCase()}`)
  );
};

export const confirmLabPaymentAfterSuccess = (
  invoiceId: string,
  patientName: string,
  services: UnifiedServiceLine[],
  labReports: LabReport[],
): { updatedReports: LabReport[]; confirmations: LabPaymentConfirmation[] } => {
  const sharedStore = useSharedPaymentStore.getState();
  const confirmations: LabPaymentConfirmation[] = [];
  const labServices = services.filter((service) => inferBillingDepartment(service) === 'lab');
  const updatedReports = labReports.map((report) => {
    if (report.patient.toLowerCase() !== patientName.toLowerCase()) return report;
    const matched = labServices.some((service) => serviceMatchesReport(service, report));
    if (!matched) return report;

    const key = `${invoiceId}:${report.id}`;
    const alreadyConfirmed = sharedStore.hasLabConfirmation(key) || report.invoiceId === invoiceId;
    confirmations.push({
      reportId: report.id,
      invoiceId,
      patient: report.patient,
      previousStatus: report.status,
      nextStatus: report.status === 'Pending' ? 'Completed' : report.status,
      alreadyConfirmed,
    });

    if (alreadyConfirmed) return report;

    sharedStore.markLabConfirmed(key);
    return {
      ...report,
      status: report.status === 'Pending' ? 'Completed' : report.status,
      billed: true,
      invoiceId,
      paymentStatus: 'Payment Completed' as const,
      workflowStatus: 'Lab Confirmed' as const,
    };
  });

  return { updatedReports, confirmations };
};
