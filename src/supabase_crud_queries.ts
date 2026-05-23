import { supabase } from './supabaseClient';

/* 
========================================================================
                      SUPABASE DATABASE SCHEMAS (SQL)
========================================================================
-- Copy and run this inside your Supabase dashboard SQL Editor:

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
  id TEXT PRIMARY KEY,                       -- e.g., 'P-10024'
  user_id UUID REFERENCES auth.users DEFAULT auth.uid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  condition TEXT NOT NULL,
  ward TEXT NOT NULL,
  admission DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY,                       -- e.g., 'DOC001'
  user_id UUID REFERENCES auth.users DEFAULT auth.uid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT NOT NULL,
  contact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,                       -- e.g., 'APT001'
  user_id UUID REFERENCES auth.users DEFAULT auth.uid(),
  patient_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Pharmacy Items Table
CREATE TABLE IF NOT EXISTS public.pharmacy_items (
  id TEXT PRIMARY KEY,                       -- e.g., 'PHM001'
  name TEXT NOT NULL,
  qty INTEGER NOT NULL,
  status TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,                       -- e.g., 'INV1024'
  user_id UUID REFERENCES auth.users DEFAULT auth.uid(),
  patient TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  services JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Lab Reports Table
CREATE TABLE IF NOT EXISTS public.lab_reports (
  id TEXT PRIMARY KEY,                       -- e.g., 'LAB-701'
  user_id UUID REFERENCES auth.users DEFAULT auth.uid(),
  patient TEXT NOT NULL,
  test TEXT NOT NULL,
  status TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  technician TEXT NOT NULL,
  billed BOOLEAN DEFAULT FALSE,
  invoice_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Broadcasts Table
CREATE TABLE IF NOT EXISTS public.broadcasts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users DEFAULT auth.uid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  audience TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users DEFAULT auth.uid(),
  sender TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  read BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS) on all tables:
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Creating basic policies (allowing read/write for authenticated requests):
CREATE POLICY "Allow all public.patients management" ON public.patients FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all public.doctors management" ON public.doctors FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all public.appointments management" ON public.appointments FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all public.pharmacy_items management" ON public.pharmacy_items FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all public.invoices management" ON public.invoices FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all public.lab_reports management" ON public.lab_reports FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all public.broadcasts management" ON public.broadcasts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all public.messages management" ON public.messages FOR ALL USING (auth.uid() IS NOT NULL);
*/


// ========================================================================
//                             TYPES DEFINITIONS
// ========================================================================

export interface DBPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  ward: string;
  admission: string;
  status: string;
}

export interface DBDoctor {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
  contact: string;
}

export interface DBAppointment {
  id: string;
  patient_name: string;
  doctor_name: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
}

export interface DBPharmacyItem {
  id: string;
  name: string;
  qty: number;
  status: string;
  category: string;
  price: number;
  expiry_date: string;
}

export interface DBInvoice {
  id: string;
  patient: string;
  amount: number;
  status: 'Paid' | 'Pending';
  date: string;
  services: { name: string; price: number }[];
}

export interface DBLabReport {
  id: string;
  patient: string;
  test: string;
  status: string;
  date: string;
  technician: string;
  billed?: boolean;
  invoice_id?: string;
}

export interface DBBroadcast {
  id: string;
  title: string;
  message: string;
  audience: string;
  created_at?: string;
}

export interface DBMessage {
  id: string;
  sender: string;
  role: string;
  content: string;
  timestamp: string;
  read: boolean;
}


// ========================================================================
//                           CRUD QUERY ENGINE
// ========================================================================

export const db = {
  // ----------------------------------------------------------------------
  // 1. PATIENTS CRUD
  // ----------------------------------------------------------------------
  patients: {
    // Read: Fetch all patients
    async getAll() {
      const { data, error } = await supabase
        .from('patients')
        .select('*');
      return { data: data as DBPatient[] | null, error };
    },

    // Read: Fetch single patient by ID
    async getById(id: string) {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      return { data: data as DBPatient | null, error };
    },

    // Create: Add new patient record
    async create(patient: DBPatient) {
      const { data, error } = await supabase
        .from('patients')
        .insert([patient]);
      return { data: data ? data[0] : null, error };
    },

    // Update: Edit patient record attributes
    async update(id: string, updates: Partial<DBPatient>) {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id);
      return { data, error };
    },

    // Delete: Remove patient record from the cloud instance
    async delete(id: string) {
      const { data, error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
      return { data, error };
    }
  },

  // ----------------------------------------------------------------------
  // 2. DOCTORS CRUD
  // ----------------------------------------------------------------------
  doctors: {
    // Read: Get all active/inactive doctors
    async getAll() {
      const { data, error } = await supabase
        .from('doctors')
        .select('*');
      return { data: data as DBDoctor[] | null, error };
    },

    // Create: Register a new practitioner
    async create(doctor: DBDoctor) {
      const { data, error } = await supabase
        .from('doctors')
        .insert([doctor]);
      return { data, error };
    },

    // Update: Modify clinician statuses or credentials
    async update(id: string, updates: Partial<DBDoctor>) {
      const { data, error } = await supabase
        .from('doctors')
        .update(updates)
        .eq('id', id);
      return { data, error };
    },

    // Delete: Retire a healthcare practitioner record
    async delete(id: string) {
      const { data, error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id);
      return { data, error };
    }
  },

  // ----------------------------------------------------------------------
  // 3. APPOINTMENTS CRUD
  // ----------------------------------------------------------------------
  appointments: {
    // Read: Fetch schedules and visit times
    async getAll() {
      const { data, error } = await supabase
        .from('appointments')
        .select('*');
      return { data: data as DBAppointment[] | null, error };
    },

    // Create: Schedule a brand new slot
    async create(appointment: DBAppointment) {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment]);
      return { data, error };
    },

    // Update: Reschedule or alter appointment status (Confirmed/Canceled)
    async update(id: string, updates: Partial<DBAppointment>) {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id);
      return { data, error };
    },

    // Delete: Purge slot from the scheduler list
    async delete(id: string) {
      const { data, error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      return { data, error };
    }
  },

  // ----------------------------------------------------------------------
  // 4. PHARMACY INVENTORY CRUD
  // ----------------------------------------------------------------------
  pharmacy: {
    // Read: List all available pharmaceutical supplies and quantities
    async getAll() {
      const { data, error } = await supabase
        .from('pharmacy_items')
        .select('*');
      return { data: data as DBPharmacyItem[] | null, error };
    },

    // Create: Insert new medication stock details
    async create(item: DBPharmacyItem) {
      const { data, error } = await supabase
        .from('pharmacy_items')
        .insert([item]);
      return { data, error };
    },

    // Update: Replenish levels or change drug status (In Stock / Out of Stock)
    async update(id: string, updates: Partial<DBPharmacyItem>) {
      const { data, error } = await supabase
        .from('pharmacy_items')
        .update(updates)
        .eq('id', id);
      return { data, error };
    },

    // Delete: Remove item from pharmaceutical track registry
    async delete(id: string) {
      const { data, error } = await supabase
        .from('pharmacy_items')
        .delete()
        .eq('id', id);
      return { data, error };
    }
  },

  // ----------------------------------------------------------------------
  // 5. INVOICES & BILLING CRUD
  // ----------------------------------------------------------------------
  invoices: {
    // Read: Fetch patient ledger accounts & bill statuses
    async getAll() {
      const { data, error } = await supabase
        .from('invoices')
        .select('*');
      return { data: data as DBInvoice[] | null, error };
    },

    // Create: Generate dynamic high-performance billing summary
    async create(invoice: DBInvoice) {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoice]);
      return { data, error };
    },

    // Update: Settle invoice payment statuses as 'Paid' or 'Pending'
    async update(id: string, updates: Partial<DBInvoice>) {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id);
      return { data, error };
    },

    // Delete: Evaporate bad-debt entries from billing systems
    async delete(id: string) {
      const { data, error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      return { data, error };
    }
  },

  // ----------------------------------------------------------------------
  // 6. LAB REPORTS CRUD
  // ----------------------------------------------------------------------
  labReports: {
    // Read: Get medical lab analysis statuses
    async getAll() {
      const { data, error } = await supabase
        .from('lab_reports')
        .select('*');
      return { data: data as DBLabReport[] | null, error };
    },

    // Create: Upload diagnostics results
    async create(report: DBLabReport) {
      const { data, error } = await supabase
        .from('lab_reports')
        .insert([report]);
      return { data, error };
    },

    // Update: Log testing outputs, link invoices or alter statuses
    async update(id: string, updates: Partial<DBLabReport>) {
      const { data, error } = await supabase
        .from('lab_reports')
        .update(updates)
        .eq('id', id);
      return { data, error };
    }
  },

  // ----------------------------------------------------------------------
  // 7. BROADCASTS & MESSAGES
  // ----------------------------------------------------------------------
  broadcasts: {
    async getAll() {
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .order('created_at', { ascending: false });
      return { data: data as DBBroadcast[] | null, error };
    },
    async create(bc: DBBroadcast) {
      const { data, error } = await supabase
        .from('broadcasts')
        .insert([bc]);
      return { data, error };
    }
  },

  messages: {
    async getAll() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false });
      return { data: data as DBMessage[] | null, error };
    },
    async create(msg: DBMessage) {
      const { data, error } = await supabase
        .from('messages')
        .insert([msg]);
      return { data, error };
    }
  }
};
