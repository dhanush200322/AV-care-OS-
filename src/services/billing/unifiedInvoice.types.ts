import type { Invoice, LabReport, Patient, PharmacyItem } from '../../store/useStore';

export type BillingDepartment = 'consultation' | 'pharmacy' | 'lab' | 'insurance' | 'refund' | 'general';
export type UnifiedPaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Insurance' | 'Split';
export type UnifiedPaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Failed' | 'Refunded';

export interface UnifiedServiceLine {
  name: string;
  price: number;
  department?: BillingDepartment;
  itemId?: string;
  quantity?: number;
  labReportId?: string;
  invoiceId?: string;
}

export interface DepartmentBillingBreakdown {
  department: BillingDepartment;
  subtotal: number;
  items: UnifiedServiceLine[];
}

export interface UnifiedInvoice extends Omit<Invoice, 'services' | 'status'> {
  patientId?: string;
  services: UnifiedServiceLine[];
  departmentBreakdown: DepartmentBillingBreakdown[];
  taxAmount: number;
  insuranceDeduction: number;
  outstandingBalance: number;
  transactionId: string;
  status: Extract<UnifiedPaymentStatus, 'Paid' | 'Pending'>;
}

export interface PatientBillingProfile {
  patient: Patient | null;
  patientName: string;
  patientId: string;
  invoices: Invoice[];
  payments: Array<{ invoiceId: string; amount: number; status: string; date: string }>;
  outstandingBalance: number;
  departmentBreakdown: DepartmentBillingBreakdown[];
}

export interface StockDeduction {
  itemId: string;
  itemName: string;
  requestedQuantity: number;
  deductedQuantity: number;
  previousQty: number;
  nextQty: number;
  status: 'deducted' | 'skipped' | 'insufficient-stock';
}

export interface LabPaymentConfirmation {
  reportId: string;
  invoiceId: string;
  patient: string;
  previousStatus: LabReport['status'];
  nextStatus: LabReport['status'];
  alreadyConfirmed: boolean;
}

export interface BillingAuditEntry {
  id: string;
  patientId: string;
  patientName: string;
  invoiceId: string;
  transactionId: string;
  paymentAmount: number;
  paymentMethod: UnifiedPaymentMethod;
  medicinesDeducted: StockDeduction[];
  labConfirmations: LabPaymentConfirmation[];
  departmentMappings: DepartmentBillingBreakdown[];
  timestamp: string;
  billingOperator: string;
  refundHistory: string[];
}

export interface PaymentSuccessEvent {
  type: 'PAYMENT_SUCCESS_EVENT';
  invoiceId: string;
  patientId: string;
  patientName: string;
  amount: number;
  paymentMethod: UnifiedPaymentMethod;
  transactionId: string;
  timestamp: string;
  auditLogId: string;
  departmentBreakdown: DepartmentBillingBreakdown[];
  medicinesDeducted: StockDeduction[];
  labConfirmations: LabPaymentConfirmation[];
}

export interface BillingStateSnapshot {
  invoices: Invoice[];
  payments: Array<{ invoiceId: string; amount: number; status: string; date: string }>;
  patients: Patient[];
  pharmacyItems: PharmacyItem[];
  labReports: LabReport[];
}
