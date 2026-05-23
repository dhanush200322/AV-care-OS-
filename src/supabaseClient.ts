// ==========================================
// MOCK CLIENT-SIDE SUPABASE ENGINE (TypeScript)
// ==========================================
// This replaces the Live Supabase connection with fully client-side storage
// to satisfy offline execution constraints and remove remote system reliance.

const MOCK_USER_ID = "mock-admin-user-uuid-12345";

// Default prefilled data matching the store schema
const initialPatients = [
  { id: "P-10024", name: "Alice Thompson", age: 34, gender: "Female", condition: "Stable", ward: "Ward 4B", admission: "2026-05-14", status: "Active" },
  { id: "P-10025", name: "Robert Miller", age: 52, gender: "Male", condition: "Critical", ward: "ICU-2", admission: "2026-05-15", status: "Active" },
  { id: "P-10026", name: "Elena Rodriguez", age: 28, gender: "Female", condition: "Recovering", ward: "General", admission: "2026-05-10", status: "Discharged" },
  { id: "P-10027", name: "David Kim", age: 45, gender: "Male", condition: "Under Obs", ward: "Ward 1A", admission: "2026-05-16", status: "Active" },
  { id: "P-10028", name: "Sophia Lewis", age: 61, gender: "Female", condition: "Stable", ward: "Ward 3C", admission: "2026-05-15", status: "Active" },
];

const initialDoctors = [
  { id: "DOC001", name: "Dr. Sarah Jenkins", role: "Chief Cardiologist", department: "Cardiology", status: "On Duty", contact: "+91 98765 43210" },
  { id: "DOC002", name: "Dr. Satish Nair", role: "Neurologist", department: "Neurology", status: "On Duty", contact: "+91 94444 12345" },
  { id: "DOC003", name: "Dr. Ananya Goel", role: "Pediatrician", department: "Pediatrics", status: "On Duty", contact: "+91 91234 56789" },
  { id: "DOC004", name: "Dr. Vinay Prasad", role: "Radiologist", department: "Radiology", status: "Off Duty", contact: "+91 90000 90000" },
  { id: "DOC005", name: "Dr. Rajesh Koothrapali", role: "Orthopedic Surgeon", department: "Orthopedics", status: "Emergency", contact: "+91 93333 44444" },
];

const initialAppointments = [
  { id: "APT001", patient_name: "Alice Thompson", doctor_name: "Dr. Sarah Jenkins", specialty: "Cardiology", date: "2026-05-20", time: "10:00 AM", status: "Confirmed" },
  { id: "APT002", patient_name: "Robert Miller", doctor_name: "Dr. Satish Nair", specialty: "Neurology", date: "2026-05-20", time: "11:30 AM", status: "Pending" },
  { id: "APT003", patient_name: "Elena Rodriguez", doctor_name: "Dr. Ananya Goel", specialty: "Pediatrics", date: "2026-05-20", time: "02:15 PM", status: "Confirmed" },
  { id: "APT004", patient_name: "Sophia Lewis", doctor_name: "Dr. Vinay Prasad", specialty: "Radiology", date: "2026-05-21", time: "04:30 PM", status: "Confirmed" },
];

const initialPharmacy = [
  { id: "PHM001", name: "Paracetamol", qty: 120, status: "Available", category: "Analgesic", price: 50, expiry_date: "2026-12-31" },
  { id: "PHM002", name: "Amoxicillin", qty: 45, status: "Available", category: "Antibiotic", price: 210, expiry_date: "2026-10-15" },
  { id: "PHM003", name: "Insulin Vial", qty: 5, status: "Low", category: "Diabetes", price: 850, expiry_date: "2026-05-24" },
  { id: "PHM004", name: "Standard Cough Syrup", qty: 0, status: "Out of Stock", category: "Respiratory", price: 120, expiry_date: "2026-04-12" },
  { id: "PHM005", name: "Vitamin C Tablets", qty: 250, status: "Available", category: "Supplement", price: 45, expiry_date: "2027-03-20" },
];

const initialInvoices = [
  { id: "INV1024", patient: "Alice Thompson", amount: 2500, status: "Paid", date: new Date().toISOString().split('T')[0], services: [{ name: 'Consultation', price: 2500 }] },
  { id: "INV5432", patient: "Robert Miller", amount: 5400, status: "Pending", date: new Date().toISOString().split('T')[0], services: [{ name: 'Lab Test', price: 5400 }] },
  { id: "INV9012", patient: "Elena Rodriguez", amount: 1200, status: "Paid", date: new Date().toISOString().split('T')[0], services: [{ name: 'Pharmacy', price: 1200 }] }
];

const initialLabReports = [
  { id: "LAB-701", patient: "Alice Thompson", test: "CBC + Blood Profile", status: "Completed", date: new Date().toISOString().split('T')[0], technician: "Dr. Vinay", billed: true, invoice_id: "INV1024" },
  { id: "LAB-702", patient: "Robert Miller", test: "HbA1c & Diabetes screening", status: "Pending", date: new Date().toISOString().split('T')[0], technician: "Dr. Vinay", billed: false },
  { id: "LAB-703", patient: "Elena Rodriguez", test: "Liver Function Test", status: "Completed", date: new Date().toISOString().split('T')[0], technician: "Dr. Vinay", billed: false }
];

const initialBroadcasts = [
  { id: "1", title: "Hospital Core OS Active", message: "Hospital core systems are now unified under AV CARE OS v12.4.", audience: "all", created_at: new Date().toISOString() }
];

const initialMessages = [
  { id: "MSG001", sender: "Dr. Satish Nair", role: "Neurologist", content: "Left the detailed spinal scan report on your desk for active Ward 4B audits.", timestamp: new Date().toISOString(), read: false },
  { id: "MSG002", sender: "Nurse Emily", role: "Ward 4B Team", content: "Active ICU Patient Robert Miller stable status but requires special supervision.", timestamp: new Date().toISOString(), read: false },
  { id: "MSG003", sender: "Michael Chang", role: "Security Lead", content: "Unified gate security scan complete. No core network anomalies detected.", timestamp: new Date().toISOString(), read: true }
];

// Helper to seed localStorage databases
function ensureSeeded() {
  const seedTable = (key: string, defaultData: any[]) => {
    if (!localStorage.getItem(`mock_db_${key}`)) {
      const mapped = defaultData.map(item => ({
        ...item,
        user_id: item.user_id || MOCK_USER_ID,
        created_at: item.created_at || new Date().toISOString()
      }));
      localStorage.setItem(`mock_db_${key}`, JSON.stringify(mapped));
    }
  };

  seedTable("patients", initialPatients);
  seedTable("doctors", initialDoctors);
  seedTable("appointments", initialAppointments);
  seedTable("pharmacy_items", initialPharmacy);
  seedTable("invoices", initialInvoices);
  seedTable("lab_reports", initialLabReports);
  seedTable("broadcasts", initialBroadcasts);
  seedTable("messages", initialMessages);

  // Setup basic profiles & users
  if (!localStorage.getItem("mock_db_users")) {
    const defaultUsers = [
      { id: MOCK_USER_ID, email: "ro224313@gmail.com", plan: "pro" }
    ];
    localStorage.setItem("mock_db_users", JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem("mock_db_profiles")) {
    const defaultProfiles = [
      { id: MOCK_USER_ID, role: "admin", full_name: "AV CARE Admin Executive", created_at: new Date().toISOString() }
    ];
    localStorage.setItem("mock_db_profiles", JSON.stringify(defaultProfiles));
  }
}

// Get dynamically logged in user
function getMockCurrentUser() {
  const stored = localStorage.getItem("mock_authed_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  // Check if they signed out explicitly. If they did, don't auto-log back in as admin.
  if (localStorage.getItem("mock_signed_out") === "true") {
    return null;
  }
  // Default to pre-seeded admin so the app starts fully logged in if required
  return {
    id: MOCK_USER_ID,
    email: "ro224313@gmail.com",
    user_metadata: { full_name: "AV CARE Admin Executive" },
    aud: "authenticated",
    role: "authenticated"
  };
}

let authCallbacks: any[] = [];

// Query Builder for mocking database querying chain
class MockQueryBuilder {
  table: string;
  filters: any[];
  orderCol: string | null;
  orderAscending: boolean;
  limitCount: number | null;
  isHead: boolean;
  maybeSingleMode: boolean;
  singleMode: boolean;

  constructor(table: string) {
    ensureSeeded();
    this.table = table;
    this.filters = [];
    this.orderCol = null;
    this.orderAscending = true;
    this.limitCount = null;
    this.isHead = false;
    this.maybeSingleMode = false;
    this.singleMode = false;
  }

  select(columns?: string, options?: any) {
    if (options && options.head) {
      this.isHead = true;
    }
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, value, type: "eq" });
    return this;
  }

  order(column: string, options?: any) {
    this.orderCol = column;
    this.orderAscending = options ? options.ascending !== false : true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  maybeSingle() {
    this.maybeSingleMode = true;
    return this.then((res: any) => {
      if (res.error) return { data: null, error: res.error };
      return { data: res.data && res.data.length > 0 ? res.data[0] : null, error: null };
    });
  }

  single() {
    this.singleMode = true;
    return this.then((res: any) => {
      if (res.error) return { data: null, error: res.error };
      if (!res.data || res.data.length === 0) {
        return { data: null, error: new Error("Row not found") };
      }
      return { data: res.data[0], error: null };
    });
  }

  async insert(rows: any[]) {
    const tableKey = `mock_db_${this.table}`;
    const data = JSON.parse(localStorage.getItem(tableKey) || "[]");
    const user = getMockCurrentUser();
    const formatted = rows.map((r, index) => ({
      ...r,
      user_id: r.user_id || (user ? user.id : MOCK_USER_ID),
      created_at: r.created_at || new Date().toISOString(),
      id: r.id || `MOCK-${Date.now()}-${index}`
    }));
    data.push(...formatted);
    localStorage.setItem(tableKey, JSON.stringify(data));
    return { data: formatted, error: null };
  }

  async update(updates: any) {
    const tableKey = `mock_db_${this.table}`;
    let data = JSON.parse(localStorage.getItem(tableKey) || "[]");
    const updatedRows: any[] = [];
    data = data.map((item: any) => {
      let isMatch = true;
      for (const filter of this.filters) {
        if (filter.type === "eq" && item[filter.column] !== filter.value) {
          isMatch = false;
        }
      }
      if (isMatch) {
        const updated = { ...item, ...updates };
        updatedRows.push(updated);
        return updated;
      }
      return item;
    });
    localStorage.setItem(tableKey, JSON.stringify(data));
    return { data: updatedRows, error: null };
  }

  async delete() {
    const tableKey = `mock_db_${this.table}`;
    const data = JSON.parse(localStorage.getItem(tableKey) || "[]");
    const deletedRows: any[] = [];
    const keptRows = data.filter((item: any) => {
      let isMatch = true;
      for (const filter of this.filters) {
        if (filter.type === "eq" && item[filter.column] !== filter.value) {
          isMatch = false;
        }
      }
      if (isMatch) {
        deletedRows.push(item);
        return false;
      }
      return true;
    });
    localStorage.setItem(tableKey, JSON.stringify(keptRows));
    return { data: deletedRows, error: null };
  }

  // To support awaiting the chainable builders directly
  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    const tableKey = `mock_db_${this.table}`;
    let data = JSON.parse(localStorage.getItem(tableKey) || "[]");

    // Apply filters
    for (const filter of this.filters) {
      if (filter.type === "eq") {
        data = data.filter((item: any) => item[filter.column] === filter.value);
      }
    }

    // Apply sorting
    if (this.orderCol) {
      const col = this.orderCol;
      data.sort((a: any, b: any) => {
        const valA = a[col];
        const valB = b[col];
        if (valA < valB) return this.orderAscending ? -1 : 1;
        if (valA > valB) return this.orderAscending ? 1 : -1;
        return 0;
      });
    }

    // Apply limit
    if (this.limitCount !== null) {
      data = data.slice(0, this.limitCount);
    }

    const count = data.length;
    let payload;
    if (this.isHead) {
      payload = { data: null, error: null, count };
    } else {
      payload = { data, error: null, count };
    }

    return Promise.resolve(payload).then(onfulfilled, onrejected);
  }
}

// Global Auth State Change dispatcher
function triggerAuthStateChange(event: string, session: any) {
  authCallbacks.forEach(cb => {
    try {
      cb(event, session);
    } catch (e) {
      console.warn("Auth state change callback error:", e);
    }
  });
}

// Seed upon load
ensureSeeded();

// Main Export Object mimicking supabase typed as any
export const supabase: any = {
  auth: {
    async getUser() {
      const user = getMockCurrentUser();
      return { data: { user }, error: null };
    },

    async getSession() {
      const user = getMockCurrentUser();
      const session = user ? {
        access_token: "dummy-mock-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "dummy-mock-refresh-token",
        user
      } : null;
      return { data: { session }, error: null };
    },

    async signInWithPassword({ email }: any) {
      ensureSeeded();
      const cleanedEmail = email.trim().toLowerCase();
      let role = "receptionist";
      if (cleanedEmail === 'ro224313@gmail.com') {
        role = "admin";
      } else if (cleanedEmail === 'dhanushavece@gmail.com' || cleanedEmail.includes('doctor')) {
        role = "doctor";
      } else if (cleanedEmail.includes('admin')) {
        role = "admin";
      } else if (cleanedEmail.includes('reception')) {
        role = "receptionist";
      } else if (cleanedEmail.includes('security')) {
        role = "security";
      } else if (cleanedEmail.includes('ambulance') || cleanedEmail.includes('ems')) {
        role = "ambulance";
      }

      // Check if user exists in local DB or add them
      const users = JSON.parse(localStorage.getItem("mock_db_users") || "[]");
      let activeUser = users.find(u => u.email.trim().toLowerCase() === cleanedEmail);
      if (!activeUser) {
        activeUser = { id: `user-id-${Math.floor(Math.random() * 99999)}`, email: cleanedEmail, plan: "free" };
        users.push(activeUser);
        localStorage.setItem("mock_db_users", JSON.stringify(users));
      }

      // Sync Profile
      const profiles = JSON.parse(localStorage.getItem("mock_db_profiles") || "[]");
      let profile = profiles.find(p => p.id === activeUser.id);
      if (!profile) {
        profile = {
          id: activeUser.id,
          role,
          full_name: cleanedEmail.split('@')[0].toUpperCase(),
          created_at: new Date().toISOString()
        };
        profiles.push(profile);
        localStorage.setItem("mock_db_profiles", JSON.stringify(profiles));
      }

      const userPayload = {
        id: activeUser.id,
        email: cleanedEmail,
        user_metadata: { full_name: profile.full_name },
        aud: "authenticated",
        role: "authenticated"
      };

      localStorage.setItem("mock_authed_user", JSON.stringify(userPayload));
      localStorage.removeItem("mock_signed_out");
      const sessionPayload = {
        access_token: "dummy-mock-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "dummy-mock-refresh-token",
        user: userPayload
      };

      triggerAuthStateChange("SIGNED_IN", sessionPayload);
      return { data: { user: userPayload, session: sessionPayload }, error: null };
    },

    async signInWithOAuth({ provider }: any) {
      const email = `${provider}-oauth@example.com`;
      return this.signInWithPassword({ email, password: "oauth" });
    },

    async signUp({ email, options }: any) {
      ensureSeeded();
      const cleanedEmail = email.trim().toLowerCase();
      const users = JSON.parse(localStorage.getItem("mock_db_users") || "[]");
      
      if (users.find(u => u.email.trim().toLowerCase() === cleanedEmail)) {
        return { data: { user: null, session: null }, error: new Error("User already registered") };
      }

      const activeUser = { id: `user-id-${Math.floor(Math.random() * 99999)}`, email: cleanedEmail, plan: "free" };
      users.push(activeUser);
      localStorage.setItem("mock_db_users", JSON.stringify(users));

      // Resolve starting role
      let role = "receptionist";
      if (cleanedEmail === 'ro224313@gmail.com') {
        role = "admin";
      } else if (cleanedEmail === 'dhanushavece@gmail.com' || cleanedEmail.includes('doctor')) {
        role = "doctor";
      }

      const pName = options?.data?.full_name || cleanedEmail.split('@')[0].toUpperCase();
      const profiles = JSON.parse(localStorage.getItem("mock_db_profiles") || "[]");
      const profile = { id: activeUser.id, role, full_name: pName, created_at: new Date().toISOString() };
      profiles.push(profile);
      localStorage.setItem("mock_db_profiles", JSON.stringify(profiles));

      const userPayload = {
        id: activeUser.id,
        email: cleanedEmail,
        user_metadata: { full_name: pName },
        aud: "authenticated",
        role: "authenticated"
      };

      localStorage.setItem("mock_authed_user", JSON.stringify(userPayload));
      localStorage.removeItem("mock_signed_out");
      const sessionPayload = {
        access_token: "dummy-mock-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "dummy-mock-refresh-token",
        user: userPayload
      };

      triggerAuthStateChange("SIGNED_IN", sessionPayload);
      return { data: { user: userPayload, session: sessionPayload }, error: null };
    },

    async signOut() {
      localStorage.removeItem("mock_authed_user");
      triggerAuthStateChange("SIGNED_OUT", null);
      return { error: null };
    },

    onAuthStateChange(callback: any) {
      authCallbacks.push(callback);
      // Trigger initial state callback
      const user = getMockCurrentUser();
      const session = user ? {
        access_token: "dummy-mock-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "dummy-mock-refresh-token",
        user
      } : null;
      
      setTimeout(() => {
        callback("INITIAL_SESSION", session);
      }, 0);

      return {
        data: {
          subscription: {
            unsubscribe() {
              authCallbacks = authCallbacks.filter(cb => cb !== callback);
            }
          }
        }
      };
    }
  },

  from(table: string) {
    return new MockQueryBuilder(table);
  },

  channel(channelName: string) {
    return {
      on(event: string, filter: any, callback: any) {
        return this;
      },
      subscribe(cb?: any) {
        if (cb) cb("SUBSCRIBED");
        return {
          unsubscribe() {}
        };
      }
    };
  }
};
