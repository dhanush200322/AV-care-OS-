import type { Invoice, LabReport, Patient, PharmacyItem } from '../../store/useStore';
import { orchestratePaymentSuccess } from './paymentSuccessOrchestrator';
import type { UnifiedPaymentMethod } from './unifiedInvoice.types';

export const completeUnifiedPaymentWorkflow = (
  invoice: Invoice,
  context: {
    patients: Patient[];
    pharmacyItems: PharmacyItem[];
    labReports: LabReport[];
    paymentMethod?: UnifiedPaymentMethod;
  },
) => orchestratePaymentSuccess(invoice, context);
