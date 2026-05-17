import { create } from 'zustand';

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  audience: 'all' | 'doctor' | 'reception' | 'security' | 'ambulance';
  createdAt: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: 'broadcast' | 'system' | 'emergency';
  createdAt: string;
}

export interface Invoice {
  id: string;
  patient: string;
  amount: number;
  status: 'Paid' | 'Pending';
  date: string;
  services: { name: string; price: number }[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  method: 'UPI' | 'Card' | 'Cash';
  amount: number;
  status: 'Paid' | 'Failed' | 'Pending';
  date: string;
}

export interface InsuranceClaim {
  id: string;
  patient: string;
  provider: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  amount: number;
  date: string;
}

export interface Refund {
  id: string;
  patient: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Rejected';
  reason: string;
  date: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  ward: string;
  admission: string;
  status: string;
}

export interface LabReport {
  id: string;
  patient: string;
  test: string;
  status: 'Completed' | 'Pending';
  date: string;
  technician: string;
  billed?: boolean;
  invoiceId?: string;
}

interface AppState {
  broadcasts: Broadcast[];
  notifications: Notification[];
  invoices: Invoice[];
  payments: Payment[];
  claims: InsuranceClaim[];
  refunds: Refund[];
  labReports: LabReport[];
  patients: Patient[];
  prefilledInvoice: Partial<Invoice> | null;
  selectedInvoice: Invoice | null;
  selectedPatient: Patient | null;
  isBillingModalOpen: boolean;
  isPatientEditModalOpen: boolean;
  addBroadcast: (broadcast: Omit<Broadcast, 'id' | 'createdAt'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  // Billing Actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'date'>) => string;
  markInvoicePaid: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'date'>) => void;
  addRefund: (refund: Omit<Refund, 'id' | 'date'>) => void;
  setPrefilledInvoice: (data: Partial<Invoice> | null) => void;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  setIsBillingModalOpen: (isOpen: boolean) => void;
  // Lab Actions
  markReportAsBilled: (id: string, invoiceId: string) => void;
  // Patient Actions
  updatePatient: (patient: Patient) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setIsPatientEditModalOpen: (isOpen: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  broadcasts: [
    {
       id: '1',
       title: 'System Integration Active',
       message: 'Hospital core systems are now unified under AV CARE OS.',
       audience: 'all',
       createdAt: new Date().toISOString()
    }
  ],
  notifications: [
    {
      id: 'n1',
      message: 'Welcome to the new AV CARE OS dashboard.',
      read: false,
      type: 'system',
      createdAt: new Date().toISOString()
    }
  ],
  invoices: [
    { id: "INV001", patient: "Ravi Kumar", amount: 2500, status: "Paid", date: "2026-05-14", services: [{ name: 'Consultation', price: 2500 }] },
    { id: "INV002", patient: "Anjali Verma", amount: 5400, status: "Pending", date: "2026-05-15", services: [{ name: 'Lab Test', price: 5400 }] },
    { id: "INV003", patient: "Suresh Raina", amount: 1200, status: "Paid", date: "2026-05-15", services: [{ name: 'Pharmacy', price: 1200 }] }
  ],
  payments: [
    { id: "PAY-001", invoiceId: "INV001", method: "UPI", amount: 2500, status: "Paid", date: "2026-05-14" },
    { id: "PAY-002", invoiceId: "INV003", method: "Card", amount: 1200, status: "Paid", date: "2026-05-15" }
  ],
  claims: [
    { id: "CLM-901", patient: "Ravi Shashtri", provider: "Aetna", status: "Approved", amount: 45000, date: "2026-05-10" },
    { id: "CLM-902", patient: "Virat Kohli", provider: "Max Life", status: "Pending", amount: 12500, date: "2026-05-15" }
  ],
  refunds: [
    { id: "RFD-001", patient: "Rohit Sharma", amount: 500, status: "Completed", reason: "Overcharged", date: "2026-05-12" }
  ],
  labReports: [
    { id: "LAB-701", patient: "Rahul Dravid", test: "CBC + Lipid Profile", status: "Completed", date: "2026-05-15", technician: "Dr. Satish", billed: false },
    { id: "LAB-702", patient: "MS Dhoni", test: "HbA1c (Diabetes)", status: "Pending", date: "2026-05-16", technician: "Dr. Satish", billed: false },
    { id: "LAB-703", patient: "Hardik Pandya", test: "Liver Function Test", status: "Completed", date: "2026-05-14", technician: "Dr. Ananya", billed: true },
    { id: "LAB-704", patient: "Jasprit Bumrah", test: "MRI Scan (Spine)", status: "Pending", date: "2026-05-16", technician: "Dr. Vinay", billed: false },
  ],
  patients: [
    { id: "P-10024", name: "Alice Thompson", age: 34, gender: "Female", condition: "Stable", ward: "Ward 4B", admission: "2026-05-14", status: "Active" },
    { id: "P-10025", name: "Robert Miller", age: 52, gender: "Male", condition: "Critical", ward: "ICU-2", admission: "2026-05-15", status: "Active" },
    { id: "P-10026", name: "Elena Rodriguez", age: 28, gender: "Female", condition: "Recovering", ward: "General", admission: "2026-05-10", status: "Discharged" },
    { id: "P-10027", name: "David Kim", age: 45, gender: "Male", condition: "Under Obs", ward: "Ward 1A", admission: "2026-05-16", status: "Active" },
    { id: "P-10028", name: "Sophia Lewis", age: 61, gender: "Female", condition: "Stable", ward: "Ward 3C", admission: "2026-05-15", status: "Active" },
  ],
  prefilledInvoice: null,
  selectedInvoice: null,
  selectedPatient: null,
  isBillingModalOpen: false,
  isPatientEditModalOpen: false,
  addBroadcast: (broadcast) => {
    const newBroadcast: Broadcast = {
      ...broadcast,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      broadcasts: [newBroadcast, ...state.broadcasts],
      notifications: [
        {
          id: Math.random().toString(36).substring(7),
          message: `New Broadcast: ${broadcast.title}`,
          read: false,
          type: 'broadcast',
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
      isBillingModalOpen: false,
    }));
  },
  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Math.random().toString(36).substring(7),
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    }));
  },
  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
  clearAllNotifications: () => {
    set({ notifications: [] });
  },
  addInvoice: (invoice) => {
    const newId = `INV${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv: Invoice = {
      ...invoice,
      id: newId,
      date: new Date().toISOString().split('T')[0]
    };
    set(state => ({
      invoices: [newInv, ...state.invoices],
      notifications: [{
        id: Math.random().toString(36).substring(7),
        message: `New Invoice Generated: ${newInv.id} for ${newInv.patient}`,
        read: false,
        type: 'system',
        createdAt: new Date().toISOString()
      }, ...state.notifications]
    }));
    return newId;
  },
  markInvoicePaid: (id) => {
    set(state => {
      const inv = state.invoices.find(i => i.id === id);
      if (!inv) return state;
      return {
        invoices: state.invoices.map(i => i.id === id ? { ...i, status: 'Paid' } : i),
        notifications: [{
          id: Math.random().toString(36).substring(7),
          message: `Invoice ${id} marked as Paid`,
          read: false,
          type: 'system',
          createdAt: new Date().toISOString()
        }, ...state.notifications],
        payments: [{
          id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
          invoiceId: id,
          amount: inv.amount,
          method: 'Card',
          status: 'Paid',
          date: new Date().toISOString().split('T')[0]
        }, ...state.payments]
      };
    });
  },
  addPayment: (payment) => {
     set(state => ({
        payments: [{ ...payment, id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toISOString().split('T')[0] }, ...state.payments]
     }));
  },
  addRefund: (refund) => {
     set(state => ({
        refunds: [{ ...refund, id: `RFD-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toISOString().split('T')[0] }, ...state.refunds]
     }));
  },
  setPrefilledInvoice: (data) => {
    set({ prefilledInvoice: data });
  },
  setSelectedInvoice: (invoice) => {
    set({ selectedInvoice: invoice });
  },
  setIsBillingModalOpen: (isOpen) => {
    set({ isBillingModalOpen: isOpen });
  },
  markReportAsBilled: (id, invoiceId) => {
    set(state => ({
      labReports: state.labReports.map(r => r.id === id ? { ...r, billed: true, invoiceId } : r),
      notifications: [{
        id: Math.random().toString(36).substring(7),
        message: `Invoice ${invoiceId} linked to Lab Report ${id}`,
        read: false,
        type: 'system',
        createdAt: new Date().toISOString()
      }, ...state.notifications]
    }));
  },
  updatePatient: (patient) => {
    set(state => ({
      patients: state.patients.map(p => p.id === patient.id ? patient : p),
      notifications: [{
        id: Math.random().toString(36).substring(7),
        message: `Patient ${patient.id} details updated`,
        read: false,
        type: 'system',
        createdAt: new Date().toISOString()
      }, ...state.notifications]
    }));
  },
  setSelectedPatient: (patient) => {
    set({ selectedPatient: patient });
  },
  setIsPatientEditModalOpen: (isOpen) => {
    set({ isPatientEditModalOpen: isOpen });
  }
}));
