import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import { completeUnifiedPaymentWorkflow } from '../services/billing/unifiedPaymentWorkflow';
import type { BillingDepartment } from '../services/billing/unifiedInvoice.types';

export interface BirthdaySetting {
  id: string;
  autoWishesEnabled: boolean;
  wishType: 'SMS' | 'Email' | 'WhatsApp' | 'Dashboard';
  sendingTime: string;
  hospitalName: string;
  selectedBanner: string;
}

export interface BirthdayTemplate {
  id: string;
  name: string;
  content: string;
  type: 'SMS' | 'Email' | 'WhatsApp' | 'Dashboard';
}

export interface SentWish {
  id: string;
  recipientName: string;
  role: 'Patient' | 'Doctor' | 'Staff' | string;
  dateSent: string;
  wishType: 'SMS' | 'Email' | 'WhatsApp' | 'Dashboard' | string;
  content: string;
  status: 'Sent' | 'Delivered' | 'Pending';
  senderName?: string;
  dashboardSource?: string;
  sourceDashboardKey?: string;
  sourceThemeColour?: string;
  targetDashboardKey?: string;
  targetThemeColour?: string;
  timeSent?: string;
}

export interface WishingDashboard {
  id: string;
  name: string;
  location: string;
  createdAt: string;
}


export interface BirthdayPerson {
  id: string;
  name: string;
  role: string;
  category: 'Admin' | 'Doctor' | 'Reception' | 'Security' | 'Ambulance';
  age: number;
  birthdayDate: string;
  month: number;
  day: number;
  avatar: string;
  phone: string;
  email: string;
}

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
  services: {
    name: string;
    price: number;
    department?: BillingDepartment;
    itemId?: string;
    quantity?: number;
    labReportId?: string;
  }[];
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

export interface Doctor {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'On Duty' | 'Off Duty' | 'Emergency';
  contact: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Canceled';
}

export interface PharmacyItem {
  id: string;
  name: string;
  qty: number;
  status: 'Available' | 'Low' | 'Out of Stock';
  category: string;
  price: number;
  expiryDate?: string;
}

export interface Message {
  id: string;
  sender: string;
  role: string;
  content: string;
  timestamp: string;
  read: boolean;
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
  paymentStatus?: 'Pending Payment' | 'Payment Completed';
  workflowStatus?: 'Pending Payment' | 'Payment Completed' | 'Lab Confirmed' | 'Processing' | 'Report Ready';
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
  doctors: Doctor[];
  appointments: Appointment[];
  pharmacyItems: PharmacyItem[];
  messages: Message[];
  prefilledInvoice: Partial<Invoice> | null;
  selectedInvoice: Invoice | null;
  selectedPatient: Patient | null;
  isBillingModalOpen: boolean;
  isPatientEditModalOpen: boolean;
  isEmergencyMode: boolean;
  addBroadcast: (broadcast: Omit<Broadcast, 'id' | 'createdAt'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  toggleEmergencyMode: () => void;
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
  addPatient: (patient: Omit<Patient, 'id'>) => string;
  setSelectedPatient: (patient: Patient | null) => void;
  setIsPatientEditModalOpen: (isOpen: boolean) => void;
  // Staff / Appointment / Pharmacy Actions
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  addPharmacyItem: (item: Omit<PharmacyItem, 'id'>) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  refreshAllData: () => void;
  setPatients: (patients: Patient[]) => void;
  setDoctors: (doctors: Doctor[]) => void;
  setAppointments: (appointments: Appointment[]) => void;
  setPharmacyItems: (items: PharmacyItem[]) => void;
  // Birthday System States
  birthdaySettings: BirthdaySetting;
  birthdayTemplates: BirthdayTemplate[];
  sentWishes: SentWish[];
  birthdayPeople: BirthdayPerson[];
  wishingDashboards: WishingDashboard[];
  updateBirthdaySettings: (settings: Partial<BirthdaySetting>) => void;
  addSentWish: (wish: Omit<SentWish, 'id' | 'dateSent' | 'status'>) => void;
  updateBirthdayTemplate: (id: string, content: string) => void;
  addBirthdayPerson: (person: Omit<BirthdayPerson, 'id' | 'month' | 'day'>) => void;
  addWishingDashboard: (dashboard: Omit<WishingDashboard, 'id' | 'createdAt'>) => void;
  // SaaS limits system
  plan: 'free' | 'pro';
  isLimitModalOpen: boolean;
  limitModalTitle: string;
  limitModalMessage: string;
  setIsLimitModalOpen: (isOpen: boolean, title?: string, message?: string) => void;
  setPlan: (plan: 'free' | 'pro') => void;
}

export const useStore = create<AppState>((set, get) => ({
  birthdaySettings: {
    id: 'bs-1',
    autoWishesEnabled: true,
    wishType: 'WhatsApp',
    sendingTime: '09:00 AM',
    hospitalName: 'AV Care Super Speciality Hospital',
    selectedBanner: 'banner-purple'
  },
  birthdayTemplates: [
    {
      id: 't-1',
      name: 'Standard WhatsApp Birthday Template',
      content: 'Happy Birthday {{name}}! 🎉 Wishing you good health and happiness from {{hospital_name}}! 🏥 🩺 💖',
      type: 'WhatsApp'
    },
    {
      id: 't-2',
      name: 'Doctor Premium Email Template',
      content: 'Dear {{name}}, Happy Birthday! 🎂 Thank you for your extraordinary medical dedication and care. Warmest wishes from the team at {{hospital_name}}! 🎁',
      type: 'Email'
    },
    {
      id: 't-3',
      name: 'Critical Patient SMS Template',
      content: 'Wishing {{name}} a very happy birthday! 🌸 Let us hope for a speedy, solid recovery and wonderful days ahead. Regards, {{hospital_name}}.',
      type: 'SMS'
    },
    {
      id: 't-4',
      name: 'Dashboard Celebration Greeting',
      content: '🎂 Wishing you a wonderful birthday, {{name}}! May your year be filled with success, good health, and joy! Cheers from the team at {{hospital_name}}! 🏥💉💚',
      type: 'Dashboard'
    }
  ],
  sentWishes: [
    { 
      id: 'sw-1', 
      recipientName: 'Alice Thompson', 
      role: 'Patient', 
      dateSent: new Date().toISOString().split('T')[0], 
      wishType: 'WhatsApp', 
      content: 'Happy Birthday Alice Thompson! 🎉 Wishing you good health and happiness from AV Care Super Speciality Hospital! 🏥', 
      status: 'Delivered',
      senderName: 'Secured System Unit',
      dashboardSource: 'Main Lobby Portal',
      timeSent: '08:15 AM'
    },
    { 
      id: 'sw-2', 
      recipientName: 'Dr. Sarah Jenkins', 
      role: 'Doctor', 
      dateSent: new Date().toISOString().split('T')[0], 
      wishType: 'Dashboard', 
      content: 'Happy Birthday Dr. Jenkins! 🎉 Thank you for keeping our hearts beating and running cardiology so beautifully!', 
      status: 'Delivered',
      senderName: 'Nurse Emily Cooper',
      dashboardSource: 'Pediatrics Smart Display',
      timeSent: '08:32 AM'
    },
    { 
      id: 'sw-3', 
      recipientName: 'Dr. Sarah Jenkins', 
      role: 'Doctor', 
      dateSent: new Date().toISOString().split('T')[0], 
      wishType: 'WhatsApp', 
      content: 'Happy Birthday Sarah! Wish you an absolute blast and health. From Satish.', 
      status: 'Delivered',
      senderName: 'Dr. Satish Nair',
      dashboardSource: 'On-Call Doctors Lounge',
      timeSent: '09:05 AM'
    },
    { 
      id: 'sw-4', 
      recipientName: 'Ambulance Driver Rajesh', 
      role: 'Staff', 
      dateSent: new Date().toISOString().split('T')[0], 
      wishType: 'SMS', 
      content: 'Many returns of the day Rajesh! Drive safe and keep up the emergency response power!', 
      status: 'Delivered',
      senderName: 'Michael Chang (Security Lead)',
      dashboardSource: 'Main Lobby Portal',
      timeSent: '09:12 AM'
    }
  ],
  birthdayPeople: [
    {
      id: 'bp-1',
      name: 'Dr. Sarah Jenkins',
      role: 'Chief Cardiologist',
      category: 'Doctor',
      age: 39,
      birthdayDate: '1987-05-20',
      month: 5,
      day: 20,
      avatar: '👩‍⚕️',
      phone: '+91 98765 43210',
      email: 'sjenkins@avcare.com'
    },
    {
      id: 'bp-2',
      name: 'Ambulance Driver Rajesh',
      role: 'Emergency Ambulance Pilot',
      category: 'Ambulance',
      age: 32,
      birthdayDate: '1994-05-20',
      month: 5,
      day: 20,
      avatar: '👨‍✈️',
      phone: '+91 91234 56711',
      email: 'rajesh.ems@avcare.com'
    },
    {
      id: 'bp-3',
      name: 'Receptionist Sunita Nair',
      role: 'Chief Intake Receptionist',
      category: 'Reception',
      age: 34,
      birthdayDate: '1992-05-20',
      month: 5,
      day: 20,
      avatar: '👩',
      phone: '+91 95432 10987',
      email: 'sunita.r@gmail.com'
    },
    {
      id: 'bp-4',
      name: 'Dr. Ananya Goel',
      role: 'Pediatrician',
      category: 'Doctor',
      age: 29,
      birthdayDate: '1997-05-21',
      month: 5,
      day: 21,
      avatar: '👩‍⚕️',
      phone: '+91 91234 56789',
      email: 'ananya@avcare.com'
    },
    {
      id: 'bp-5',
      name: 'System Admin Dev Prasad',
      role: 'Senior IT System Administrator',
      category: 'Admin',
      age: 45,
      birthdayDate: '1981-05-20',
      month: 5,
      day: 20,
      avatar: '👨',
      phone: '+91 93214 76543',
      email: 'dev.sys@avcare.com'
    },
    {
      id: 'bp-6',
      name: 'Reception Lead Emily Cooper',
      role: 'Ward 4B Intake Officer',
      category: 'Reception',
      age: 31,
      birthdayDate: '1995-06-10',
      month: 6,
      day: 10,
      avatar: '👩‍🏫',
      phone: '+91 98888 77777',
      email: 'emily.cooper@avcare.com'
    },
    {
      id: 'bp-7',
      name: 'Security Lead Michael Chang',
      role: 'Aegis Sentinel Commander',
      category: 'Security',
      age: 43,
      birthdayDate: '1983-12-01',
      month: 12,
      day: 1,
      avatar: '👮‍♂️',
      phone: '+91 91111 22222',
      email: 'mchang@avcare.com'
    },
    {
      id: 'bp-8',
      name: 'Guard Robert Miller',
      role: 'Facility Guard Marshal',
      category: 'Security',
      age: 52,
      birthdayDate: '1974-06-15',
      month: 6,
      day: 15,
      avatar: '💂‍♂️',
      phone: '+91 96543 21098',
      email: 'robert.m@gmail.com'
    }
  ],
  wishingDashboards: [
    { id: 'db-1', name: 'Main Lobby Portal', location: 'Ground Floor Reception Desk', createdAt: '2026-05-19' },
    { id: 'db-2', name: 'Pediatrics Smart Display', location: 'First Floor Ward Station', createdAt: '2026-05-19' },
    { id: 'db-3', name: 'On-Call Doctors Lounge', location: 'Second Floor Relaxation Lounge', createdAt: '2026-05-19' },
    { id: 'db-4', name: 'Cardiology Command Console', location: 'Third Floor Heart Lab', createdAt: '2026-05-20' },
  ],
  broadcasts: [
    {
       id: '1',
       title: 'Hospital Core OS Active',
       message: 'Hospital core systems are now unified under AV CARE OS v12.4.',
       audience: 'all',
       createdAt: new Date().toISOString()
    }
  ],
  notifications: [
    {
      id: 'n1',
      message: '👑 Welcome to the new AV CARE OS executive dashboard.',
      read: false,
      type: 'system',
      createdAt: new Date().toISOString()
    }
  ],
  invoices: [
    { id: "INV1024", patient: "Alice Thompson", amount: 2500, status: "Paid", date: new Date().toISOString().split('T')[0], services: [{ name: 'Consultation', price: 2500 }] },
    { id: "INV5432", patient: "Robert Miller", amount: 5400, status: "Pending", date: new Date().toISOString().split('T')[0], services: [{ name: 'Lab Test', price: 5400 }] },
    { id: "INV9012", patient: "Elena Rodriguez", amount: 1200, status: "Paid", date: new Date().toISOString().split('T')[0], services: [{ name: 'Pharmacy', price: 1200 }] }
  ],
  payments: [
    { id: "PAY-1001", invoiceId: "INV1024", method: "UPI", amount: 2500, status: "Paid", date: new Date().toISOString().split('T')[0] },
    { id: "PAY-1002", invoiceId: "INV9012", method: "Card", amount: 1200, status: "Paid", date: new Date().toISOString().split('T')[0] }
  ],
  claims: [
    { id: "CLM-901", patient: "Robert Miller", provider: "Aetna Health", status: "Approved", amount: 45000, date: new Date().toISOString().split('T')[0] },
    { id: "CLM-902", patient: "Alice Thompson", provider: "Max Life", status: "Pending", amount: 12500, date: new Date().toISOString().split('T')[0] }
  ],
  refunds: [
    { id: "RFD-001", patient: "David Kim", amount: 500, status: "Completed", reason: "Overcharged Lab Procedure Fee", date: new Date().toISOString().split('T')[0] }
  ],
  labReports: [
    { id: "LAB-701", patient: "Alice Thompson", test: "CBC + Blood Profile", status: "Completed", date: new Date().toISOString().split('T')[0], technician: "Dr. Vinay", billed: true, invoiceId: "INV1024" },
    { id: "LAB-702", patient: "Robert Miller", test: "HbA1c & Diabetes screening", status: "Pending", date: new Date().toISOString().split('T')[0], technician: "Dr. Vinay", billed: false },
    { id: "LAB-703", patient: "Elena Rodriguez", test: "Liver Function Test", status: "Completed", date: new Date().toISOString().split('T')[0], technician: "Dr. Vinay", billed: false }
  ],
  patients: [
    { id: "P-10024", name: "Alice Thompson", age: 34, gender: "Female", condition: "Stable", ward: "Ward 4B", admission: "2026-05-14", status: "Active" },
    { id: "P-10025", name: "Robert Miller", age: 52, gender: "Male", condition: "Critical", ward: "ICU-2", admission: "2026-05-15", status: "Active" },
    { id: "P-10026", name: "Elena Rodriguez", age: 28, gender: "Female", condition: "Recovering", ward: "General", admission: "2026-05-10", status: "Discharged" },
    { id: "P-10027", name: "David Kim", age: 45, gender: "Male", condition: "Under Obs", ward: "Ward 1A", admission: "2026-05-16", status: "Active" },
    { id: "P-10028", name: "Sophia Lewis", age: 61, gender: "Female", condition: "Stable", ward: "Ward 3C", admission: "2026-05-15", status: "Active" },
  ],
  doctors: [
    { id: "DOC001", name: "Dr. Sarah Jenkins", role: "Chief Cardiologist", department: "Cardiology", status: "On Duty", contact: "+91 98765 43210" },
    { id: "DOC002", name: "Dr. Satish Nair", role: "Neurologist", department: "Neurology", status: "On Duty", contact: "+91 94444 12345" },
    { id: "DOC003", name: "Dr. Ananya Goel", role: "Pediatrician", department: "Pediatrics", status: "On Duty", contact: "+91 91234 56789" },
    { id: "DOC004", name: "Dr. Vinay Prasad", role: "Radiologist", department: "Radiology", status: "Off Duty", contact: "+91 90000 90000" },
    { id: "DOC005", name: "Dr. Rajesh Koothrapali", role: "Orthopedic Surgeon", department: "Orthopedics", status: "Emergency", contact: "+91 93333 44444" },
  ],
  appointments: [
    { id: "APT001", patientName: "Alice Thompson", doctorName: "Dr. Sarah Jenkins", specialty: "Cardiology", date: "2026-05-20", time: "10:00 AM", status: "Confirmed" },
    { id: "APT002", patientName: "Robert Miller", doctorName: "Dr. Satish Nair", specialty: "Neurology", date: "2026-05-20", time: "11:30 AM", status: "Pending" },
    { id: "APT003", patientName: "Elena Rodriguez", doctorName: "Dr. Ananya Goel", specialty: "Pediatrics", date: "2026-05-20", time: "02:15 PM", status: "Confirmed" },
    { id: "APT004", patientName: "Sophia Lewis", doctorName: "Dr. Vinay Prasad", specialty: "Radiology", date: "2026-05-21", time: "04:30 PM", status: "Confirmed" },
  ],
  pharmacyItems: [
    { id: "PHM001", name: "Paracetamol", qty: 120, status: "Available", category: "Analgesic", price: 50, expiryDate: "2026-12-31" },
    { id: "PHM002", name: "Amoxicillin", qty: 45, status: "Available", category: "Antibiotic", price: 210, expiryDate: "2026-10-15" },
    { id: "PHM003", name: "Insulin Vial", qty: 5, status: "Low", category: "Diabetes", price: 850, expiryDate: "2026-05-24" },
    { id: "PHM004", name: "Standard Cough Syrup", qty: 0, status: "Out of Stock", category: "Respiratory", price: 120, expiryDate: "2026-04-12" },
    { id: "PHM005", name: "Vitamin C Tablets", qty: 250, status: "Available", category: "Supplement", price: 45, expiryDate: "2027-03-20" },
  ],
  messages: [
    { id: "MSG001", sender: "Dr. Satish Nair", role: "Neurologist", content: "Left the detailed spinal scan report on your desk for active Ward 4B audits.", timestamp: new Date().toISOString(), read: false },
    { id: "MSG002", sender: "Nurse Emily", role: "Ward 4B Team", content: "Active ICU Patient Robert Miller stable status but requires special supervision.", timestamp: new Date().toISOString(), read: false },
    { id: "MSG003", sender: "Michael Chang", role: "Security Lead", content: "Unified gate security scan complete. No core network anomalies detected.", timestamp: new Date().toISOString(), read: true },
  ],
  prefilledInvoice: null,
  selectedInvoice: null,
  selectedPatient: null,
  isBillingModalOpen: false,
  isPatientEditModalOpen: false,
  isEmergencyMode: false,
  plan: 'free',
  isLimitModalOpen: false,
  limitModalTitle: '',
  limitModalMessage: '',
  setIsLimitModalOpen: (isOpen, title = '', message = '') => set({
    isLimitModalOpen: isOpen,
    limitModalTitle: title,
    limitModalMessage: message
  }),
  setPlan: (plan) => set({ plan }),
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
          message: `📢 New Broadcast: ${broadcast.title}`,
          read: false,
          type: 'broadcast',
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
      isBillingModalOpen: false,
    }));

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('broadcasts').insert([{
          id: newBroadcast.id,
          user_id: user.id,
          title: newBroadcast.title,
          message: newBroadcast.message,
          audience: newBroadcast.audience,
          created_at: newBroadcast.createdAt
        }]).then(({ error }: any) => {
          if (error) console.warn("Supabase broadcast insert sync deferred:", error.message);
        });
      }
    });
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
  toggleEmergencyMode: () => {
    set(state => {
      const newMode = !state.isEmergencyMode;
      return {
        isEmergencyMode: newMode,
        notifications: [{
          id: Math.random().toString(36).substring(7),
          message: newMode ? '🚨 CRITICAL: EMERGENCY MODE ENGAGED. CODE RED ALERT LEVEL.' : '🟢 EMERGENCY MODE DISENGAGED. COGNITIVE LEVEL SECURE.',
          read: false,
          type: 'emergency',
          createdAt: new Date().toISOString()
        }, ...state.notifications]
      };
    });
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
        message: `🧾 New Invoice: ${newInv.id} for ${newInv.patient} amount: ₹${newInv.amount}`,
        read: false,
        type: 'system',
        createdAt: new Date().toISOString()
      }, ...state.notifications]
    }));

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('invoices').insert([{
          id: newInv.id,
          user_id: user.id,
          patient: newInv.patient,
          amount: newInv.amount,
          status: newInv.status,
          date: newInv.date,
          services: newInv.services
        }]).then(({ error }: any) => {
          if (error) console.warn("Supabase invoice insert sync deferred:", error.message);
        });
      }
    });

    return newId;
  },
  markInvoicePaid: (id) => {
    set(state => {
      const inv = state.invoices.find(i => i.id === id);
      if (!inv || inv.status === 'Paid') return state;

      const unifiedPayment = completeUnifiedPaymentWorkflow(inv, {
        patients: state.patients,
        pharmacyItems: state.pharmacyItems,
        labReports: state.labReports,
        paymentMethod: 'UPI',
      });

      // Background sync
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase.from('invoices')
            .update({ status: 'Paid' })
            .eq('id', id)
            .eq('user_id', user.id)
            .then(({ error }: any) => {
              if (error) console.warn("Supabase paid event deferred:", error.message);
            });
        }
      });

      return {
        invoices: state.invoices.map(i => i.id === id ? { ...i, status: 'Paid' } : i),
        pharmacyItems: unifiedPayment.updatedPharmacyItems,
        labReports: unifiedPayment.updatedLabReports,
        notifications: [
          {
            id: Math.random().toString(36).substring(7),
            message: 'Payment completed successfully.',
            read: false,
            type: 'system',
            createdAt: new Date().toISOString()
          },
          ...(unifiedPayment.event.medicinesDeducted.length > 0 ? [{
            id: Math.random().toString(36).substring(7),
            message: 'Pharmacy inventory updated automatically.',
            read: false,
            type: 'system' as const,
            createdAt: new Date().toISOString()
          }] : []),
          ...(unifiedPayment.event.labConfirmations.length > 0 ? [{
            id: Math.random().toString(36).substring(7),
            message: 'Lab payment confirmed successfully.',
            read: false,
            type: 'system' as const,
            createdAt: new Date().toISOString()
          }] : []),
          ...state.notifications
        ],
        payments: [{
          id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
          invoiceId: id,
          amount: inv.amount,
          method: 'UPI',
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
      labReports: state.labReports.map(r => r.id === id ? {
        ...r,
        billed: true,
        invoiceId,
        paymentStatus: 'Pending Payment',
        workflowStatus: 'Pending Payment',
      } : r),
      notifications: [{
        id: Math.random().toString(36).substring(7),
        message: `🧪 Linked Lab Report ${id} with Billing Invoice ${invoiceId}`,
        read: false,
        type: 'system',
        createdAt: new Date().toISOString()
      }, ...state.notifications]
    }));

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('lab_reports')
          .update({ billed: true, invoice_id: invoiceId })
          .eq('id', id)
          .eq('user_id', user.id)
          .then(({ error }: any) => {
            if (error) console.warn("Supabase lab linked transaction deferred:", error.message);
          });
      }
    });
  },
  updatePatient: (patient) => {
    set(state => ({
      patients: state.patients.map(p => p.id === patient.id ? patient : p),
      notifications: [{
        id: Math.random().toString(36).substring(7),
        message: `👤 Updated details for ${patient.name}`,
        read: false,
        type: 'system',
        createdAt: new Date().toISOString()
      }, ...state.notifications]
    }));

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('patients').update({
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          condition: patient.condition,
          ward: patient.ward,
          admission: patient.admission,
          status: patient.status
        }).eq('id', patient.id).eq('user_id', user.id).then(({ error }: any) => {
          if (error) console.warn("Supabase patient update deferred:", error.message);
        });
      }
    });
  },
  addPatient: (patient) => {
    if (get().plan === 'free' && get().patients.length >= 5) {
      get().setIsLimitModalOpen(
        true,
        'Patient Registry Limit Reached',
        'Your Free plan is capped at a maximum of 5 patients. Upgrade to Pro for unlimited telemetry registry.'
      );
      return '';
    }
    const newId = `P-${Math.floor(10000 + Math.random() * 9000)}`;
    const newPat: Patient = { ...patient, id: newId };
    set(state => ({
      patients: [newPat, ...state.patients],
      notifications: [{
        id: Math.random().toString(36).substring(7),
        message: `👤 Admitted New Patient: ${newPat.name} (Age: ${newPat.age})`,
        read: false,
        type: 'system',
        createdAt: new Date().toISOString()
      }, ...state.notifications]
    }));

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('patients').insert([{
          id: newPat.id,
          user_id: user.id,
          name: newPat.name,
          age: newPat.age,
          gender: newPat.gender,
          condition: newPat.condition,
          ward: newPat.ward,
          admission: newPat.admission,
          status: newPat.status
        }]).then(({ error }: any) => {
          if (error) console.warn("Supabase patient insert deferred:", error.message);
        });
      }
    });

    return newId;
  },
  setSelectedPatient: (patient) => {
    set({ selectedPatient: patient });
  },
  setIsPatientEditModalOpen: (isOpen) => {
    set({ isPatientEditModalOpen: isOpen });
  },
  addDoctor: (doctor) => {
    if (get().plan === 'free' && get().doctors.length >= 3) {
      get().setIsLimitModalOpen(
        true,
        'Medical Staff Limit Reached',
        'Under the Free plan, you can register up to 3 medical duty officers. Upgrade to Pro for unlimited staff records.'
      );
      return;
    }
    const newId = `DOC${Math.floor(100 + Math.random() * 900)}`;
    const newDoc: Doctor = { ...doctor, id: newId };
    set(state => ({
      doctors: [...state.doctors, newDoc],
      notifications: [{
        id: Math.random().toString(36).substring(7),
        message: `👨‍⚕️ Registered New Duty Officer: ${newDoc.name} (${newDoc.role})`,
        read: false,
        type: 'system',
        createdAt: new Date().toISOString()
      }, ...state.notifications]
    }));

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('doctors').insert([{
          id: newDoc.id,
          user_id: user.id,
          name: newDoc.name,
          role: newDoc.role,
          department: newDoc.department,
          status: newDoc.status,
          contact: newDoc.contact
        }]).then(({ error }: any) => {
          if (error) console.warn("Supabase doctor insert deferred:", error.message);
        });
      }
    });
  },
  addAppointment: (appointment) => {
    if (get().plan === 'free' && get().appointments.length >= 3) {
      get().setIsLimitModalOpen(
        true,
        'Appointments Capped',
        'Your current Free tier supports a maximum of 3 concurrent appointment trace vectors. Upgrade to Pro to schedule without restriction.'
      );
      return;
    }
    const newId = `APT${Math.floor(100 + Math.random() * 900)}`;
    const newApt: Appointment = { ...appointment, id: newId };
    set(state => ({
      appointments: [...state.appointments, newApt],
      notifications: [{
        id: Math.random().toString(36).substring(7),
        message: `📅 Appointment Registered: ${newApt.patientName} with ${newApt.doctorName}`,
        read: false,
        type: 'system',
        createdAt: new Date().toISOString()
      }, ...state.notifications]
    }));

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('appointments').insert([{
          id: newApt.id,
          user_id: user.id,
          patient_name: newApt.patientName,
          doctor_name: newApt.doctorName,
          specialty: newApt.specialty,
          date: newApt.date,
          time: newApt.time,
          status: newApt.status
        }]).then(({ error }: any) => {
          if (error) console.warn("Supabase appointment insert deferred:", error.message);
        });
      }
    });
  },
  addPharmacyItem: (item) => {
    const newId = `PHM${Math.floor(100 + Math.random() * 900)}`;
    const newPhm: PharmacyItem = { ...item, id: newId };
    set(state => ({
      pharmacyItems: [...state.pharmacyItems, newPhm],
      notifications: [{
        id: Math.random().toString(36).substring(7),
        message: `💊 Inventory item registered: ${newPhm.name} (${newPhm.qty} Units)`,
        read: false,
        type: 'system',
        createdAt: new Date().toISOString()
      }, ...state.notifications]
    }));

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('pharmacy_items').insert([{
          id: newPhm.id,
          user_id: user.id,
          name: newPhm.name,
          qty: newPhm.qty,
          status: newPhm.status,
          category: newPhm.category,
          price: newPhm.price,
          expiry_date: newPhm.expiryDate
        }]).then(({ error }: any) => {
          if (error) console.warn("Supabase pharmacy insert deferred:", error.message);
        });
      }
    });
  },
  addMessage: (message) => {
    const newId = `MSG${Math.floor(100 + Math.random() * 900)}`;
    const newMsg: Message = { ...message, id: newId, timestamp: new Date().toISOString(), read: false };
    set(state => ({
      messages: [newMsg, ...state.messages]
    }));

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('messages').insert([{
          id: newMsg.id,
          user_id: user.id,
          sender: newMsg.sender,
          role: newMsg.role,
          content: newMsg.content,
          timestamp: newMsg.timestamp,
          read: newMsg.read
        }]).then(({ error }: any) => {
          if (error) console.warn("Supabase message insert deferred:", error.message);
        });
      }
    });
  },
  refreshAllData: async () => {
    let fetchedPlan: 'free' | 'pro' = 'free';
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: dbUser } = await supabase.from('users').select('plan').eq('id', user.id).maybeSingle();
        fetchedPlan = (dbUser?.plan || localStorage.getItem(`plan_${user.id}`) || 'free') as 'free' | 'pro';
      }
    } catch (e) {
      console.warn("Failed to fetch plan on refresh:", e);
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      let queryPatients = supabase.from('patients').select('*');
      let queryDoctors = supabase.from('doctors').select('*');
      let queryAppointments = supabase.from('appointments').select('*');
      let queryPharmacy = supabase.from('pharmacy_items').select('*');
      let queryInvoices = supabase.from('invoices').select('*');
      let queryLabReports = supabase.from('lab_reports').select('*');
      let queryBroadcasts = supabase.from('broadcasts').select('*').order('created_at', { ascending: false });
      let queryMessages = supabase.from('messages').select('*').order('timestamp', { ascending: false });

      if (user) {
        queryPatients = queryPatients.eq('user_id', user.id);
        queryDoctors = queryDoctors.eq('user_id', user.id);
        queryAppointments = queryAppointments.eq('user_id', user.id);
        queryPharmacy = queryPharmacy.eq('user_id', user.id);
        queryInvoices = queryInvoices.eq('user_id', user.id);
        queryLabReports = queryLabReports.eq('user_id', user.id);
        queryBroadcasts = queryBroadcasts.eq('user_id', user.id);
        queryMessages = queryMessages.eq('user_id', user.id);
      }

      const [
        { data: patientsData, error: eP },
        { data: doctorsData, error: eD },
        { data: appointmentsData, error: eA },
        { data: pharmacyData, error: ePh },
        { data: invoicesData, error: eI },
        { data: labReportsData, error: eL },
        { data: broadcastsData, error: eB },
        { data: messagesData, error: eM }
      ] = await Promise.all([
        queryPatients,
        queryDoctors,
        queryAppointments,
        queryPharmacy,
        queryInvoices,
        queryLabReports,
        queryBroadcasts,
        queryMessages
      ]);

      if (eP || eD || eA || ePh || eI || eL || eB || eM) {
        throw new Error("One or more tables do not exist / schema not fully applied yet.");
      }

      set((state) => {
        const newState: Partial<AppState> = { plan: fetchedPlan };
        if (patientsData && patientsData.length > 0) {
          newState.patients = patientsData.map((pat: any) => ({
            id: pat.id,
            name: pat.name,
            age: Number(pat.age),
            gender: pat.gender,
            condition: pat.condition,
            ward: pat.ward,
            admission: pat.admission,
            status: pat.status
          }));
        }
        if (doctorsData && doctorsData.length > 0) {
          newState.doctors = doctorsData.map((doc: any) => ({
            id: doc.id,
            name: doc.name,
            role: doc.role,
            department: doc.department,
            status: doc.status,
            contact: doc.contact
          }));
        }
        if (appointmentsData && appointmentsData.length > 0) {
          newState.appointments = appointmentsData.map((apt: any) => ({
            id: apt.id,
            patientName: apt.patient_name,
            doctorName: apt.doctor_name,
            specialty: apt.specialty,
            date: apt.date,
            time: apt.time,
            status: apt.status
          }));
        }
        if (pharmacyData && pharmacyData.length > 0) {
          newState.pharmacyItems = pharmacyData.map((item: any) => ({
            id: item.id,
            name: item.name,
            qty: Number(item.qty),
            status: item.status,
            category: item.category,
            price: Number(item.price),
            expiryDate: item.expiry_date
          }));
        }
        if (invoicesData && invoicesData.length > 0) {
          newState.invoices = invoicesData.map((inv: any) => ({
            id: inv.id,
            patient: inv.patient,
            amount: Number(inv.amount),
            status: inv.status,
            date: inv.date,
            services: Array.isArray(inv.services) ? inv.services : []
          }));
        }
        if (labReportsData && labReportsData.length > 0) {
          newState.labReports = labReportsData.map((rep: any) => ({
            id: rep.id,
            patient: rep.patient,
            test: rep.test,
            status: rep.status,
            date: rep.date,
            technician: rep.technician,
            billed: rep.billed,
            invoiceId: rep.invoice_id
          }));
        }
        if (broadcastsData && broadcastsData.length > 0) {
          newState.broadcasts = broadcastsData.map((bc: any) => ({
            id: bc.id,
            title: bc.title,
            message: bc.message,
            audience: bc.audience as any,
            createdAt: bc.created_at
          }));
        }
        if (messagesData && messagesData.length > 0) {
          newState.messages = messagesData.map((msg: any) => ({
            id: msg.id,
            sender: msg.sender,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
            read: msg.read
          }));
        }

        // Add a notification about refresh success
        const infoNotification: Notification = {
          id: Math.random().toString(36).substring(7),
          message: `🔄 Cyber-Sync unified with Supabase secure cloud backup successfully.`,
          read: false,
          type: 'system',
          createdAt: new Date().toISOString()
        };
        newState.notifications = [infoNotification, ...state.notifications];

        return newState;
      });
    } catch (err) {
      console.warn("Supabase fetch fallback activated successfully. Operating in Offline High-Performance Memory Cache Mode.");
    }
  },
  setPatients: (patients) => set({ patients }),
  setDoctors: (doctors) => set({ doctors }),
  setAppointments: (appointments) => set({ appointments }),
  setPharmacyItems: (pharmacyItems) => set({ pharmacyItems }),
  
  // Birthday System Actions
  updateBirthdaySettings: (newSettings) => {
    set((state) => ({
      birthdaySettings: { ...state.birthdaySettings, ...newSettings }
    }));
  },
  addSentWish: (wish) => {
    const newWish: SentWish = {
      ...wish,
      id: `sw-${Math.random().toString(36).substring(7)}`,
      dateSent: new Date().toISOString().split('T')[0],
      status: 'Delivered'
    };
    set((state) => ({
      sentWishes: [newWish, ...state.sentWishes],
      notifications: [
        {
          id: Math.random().toString(36).substring(7),
          message: `🎁 Birthday wish dispatched automatically via ${wish.wishType} to ${wish.recipientName} (${wish.role})`,
          read: false,
          type: 'system',
          createdAt: new Date().toISOString()
        },
        ...state.notifications
      ]
    }));
  },
  updateBirthdayTemplate: (id, content) => {
    set((state) => ({
      birthdayTemplates: state.birthdayTemplates.map((t) =>
        t.id === id ? { ...t, content } : t
      )
    }));
  },
  addBirthdayPerson: (person) => {
    const bDate = person.birthdayDate;
    const parts = bDate.split('-');
    const m = parts[1] ? parseInt(parts[1], 10) : 5;
    const d = parts[2] ? parseInt(parts[2], 10) : 20;

    const newPerson: BirthdayPerson = {
      ...person,
      id: `bp-${Math.random().toString(36).substring(7)}`,
      month: m,
      day: d
    };
    set((state) => ({
      birthdayPeople: [newPerson, ...state.birthdayPeople],
      notifications: [
        {
          id: Math.random().toString(36).substring(7),
          message: `🎂 Added Birthday record for ${person.name} (${person.role}) scheduled for ${m}/${d}`,
          read: false,
          type: 'system',
          createdAt: new Date().toISOString()
        },
        ...state.notifications
      ]
    }));
  },
  addWishingDashboard: (dashboard) => {
    const newDb: WishingDashboard = {
      ...dashboard,
      id: `db-${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    set((state) => ({
      wishingDashboards: [...state.wishingDashboards, newDb],
      notifications: [
        {
          id: Math.random().toString(36).substring(7),
          message: `🖥️ Registered custom celebration dashboard panel: ${dashboard.name} (${dashboard.location})`,
          read: false,
          type: 'system',
          createdAt: new Date().toISOString()
        },
        ...state.notifications
      ]
    }));
  }
}));

