import { create } from 'zustand';

export type Urgency = 'Routine' | 'Urgent' | 'Emergency';
export type QueueStatus = 'Waiting' | 'In Consultation' | 'Completed' | 'Removed';

export interface QueuePatient {
  id: string;
  token: number;
  patientName: string;
  age: number;
  chiefComplaint: string;
  waitMinutes: number;
  priority: Urgency;
  status: QueueStatus;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icdCodes: string[];
  status: 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosisSession {
  id: string;
  patientName: string;
  symptoms: string;
  aiConfidence: number;
  differential: string[];
  recommendations: string;
  drugInteractions: string;
  status: 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  patientName: string;
  medicines: { name: string; dosage: string; frequency: string; duration: string }[];
  allergies: string[];
  warnings: string[];
  status: 'Active' | 'Dispensed' | 'Cancelled';
  signedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorLabReport {
  id: string;
  patientName: string;
  test: string;
  biomarkers: { name: string; value: number; unit: string; ref: string }[];
  aiInterpretation: string;
  annotations: string;
  status: 'Pending' | 'Reviewed' | 'Archived';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  diagnoses: string[];
  procedures: string[];
  allergies: string[];
  immunizations: string[];
  imaging: string[];
  timeline: { date: string; event: string; type: string }[];
  status: 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface TelemedicineSession {
  id: string;
  patientName: string;
  scheduledAt: string;
  duration: number;
  notes: string;
  transcript: string;
  recordingUrl?: string;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyCase {
  id: string;
  patientName: string;
  severity: 'Critical' | 'High' | 'Moderate';
  location: string;
  assignedDoctor: string;
  countdownMinutes: number;
  status: 'Active' | 'Responding' | 'Resolved' | 'Closed';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  module: string;
  action: 'create' | 'update' | 'delete' | 'archive';
  entityId: string;
  summary: string;
  timestamp: string;
}

interface DoctorState {
  queue: QueuePatient[];
  consultations: Consultation[];
  diagnosisSessions: DiagnosisSession[];
  prescriptions: Prescription[];
  doctorLabReports: DoctorLabReport[];
  medicalRecords: MedicalRecord[];
  telemedicineSessions: TelemedicineSession[];
  emergencies: EmergencyCase[];
  activityLogs: ActivityLog[];
  lastUndo: { type: string; payload: unknown } | null;
  wsConnected: boolean;

  // Queue CRUD
  addToQueue: (item: Omit<QueuePatient, 'id' | 'token' | 'createdAt' | 'updatedAt' | 'waitMinutes'>) => void;
  updateQueue: (item: QueuePatient) => void;
  removeFromQueue: (id: string) => void;

  // Consultation CRUD
  addConsultation: (c: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateConsultation: (c: Consultation) => void;
  archiveConsultation: (id: string) => void;
  deleteConsultation: (id: string) => void;

  // Diagnosis CRUD
  addDiagnosisSession: (d: Omit<DiagnosisSession, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDiagnosisSession: (d: DiagnosisSession) => void;
  archiveDiagnosisSession: (id: string) => void;
  deleteDiagnosisSession: (id: string) => void;

  // Prescription CRUD
  addPrescription: (p: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'signedAt'>) => void;
  updatePrescription: (p: Prescription) => void;
  deletePrescription: (id: string) => void;

  // Lab CRUD
  addDoctorLabReport: (r: Omit<DoctorLabReport, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDoctorLabReport: (r: DoctorLabReport) => void;
  archiveDoctorLabReport: (id: string) => void;
  deleteDoctorLabReport: (id: string) => void;

  // Medical records CRUD
  addMedicalRecord: (r: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMedicalRecord: (r: MedicalRecord) => void;
  archiveMedicalRecord: (id: string) => void;
  deleteMedicalRecord: (id: string) => void;

  // Telemedicine CRUD
  addTelemedicineSession: (s: Omit<TelemedicineSession, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTelemedicineSession: (s: TelemedicineSession) => void;
  deleteTelemedicineSession: (id: string) => void;

  // Emergency CRUD
  addEmergency: (e: Omit<EmergencyCase, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmergency: (e: EmergencyCase) => void;
  closeEmergency: (id: string) => void;
  deleteEmergency: (id: string) => void;

  logActivity: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  setWsConnected: (v: boolean) => void;
  simulateRealtimeTick: () => void;
}

const now = () => new Date().toISOString();
const genId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const log = (set: (fn: (s: DoctorState) => Partial<DoctorState>) => void, entry: Omit<ActivityLog, 'id' | 'timestamp'>) => {
  set((s) => ({
    activityLogs: [{ ...entry, id: genId('log'), timestamp: now() }, ...s.activityLogs].slice(0, 100),
  }));
};

export const useDoctorStore = create<DoctorState>((set, get) => ({
  wsConnected: true,
  lastUndo: null,
  activityLogs: [],

  queue: [
    { id: 'q-1', token: 101, patientName: 'Rajesh Kumar', age: 54, chiefComplaint: 'Chest discomfort', waitMinutes: 12, priority: 'Urgent', status: 'Waiting', department: 'Cardiology', createdAt: now(), updatedAt: now() },
    { id: 'q-2', token: 102, patientName: 'Priya Menon', age: 32, chiefComplaint: 'Fever & cough', waitMinutes: 8, priority: 'Routine', status: 'In Consultation', department: 'General', createdAt: now(), updatedAt: now() },
    { id: 'q-3', token: 103, patientName: 'Arun Patel', age: 67, chiefComplaint: 'Syncope episode', waitMinutes: 3, priority: 'Emergency', status: 'Waiting', department: 'Emergency', createdAt: now(), updatedAt: now() },
  ],

  consultations: [
    { id: 'con-1', patientName: 'Rajesh Kumar', patientId: 'P-101', date: new Date().toISOString().split('T')[0], subjective: 'Intermittent chest pain x 2 days', objective: 'BP 138/88, HR 92', assessment: 'Suspected angina', plan: 'ECG, troponin, cardiology referral', icdCodes: ['I20.9'], status: 'Active', createdAt: now(), updatedAt: now() },
  ],

  diagnosisSessions: [
    { id: 'dx-1', patientName: 'Arun Patel', symptoms: 'Syncope, dizziness, palpitations', aiConfidence: 87, differential: ['Arrhythmia', 'Vasovagal syncope', 'Orthostatic hypotension'], recommendations: 'Holter monitor, orthostatic vitals', drugInteractions: 'No active contraindications', status: 'Active', createdAt: now(), updatedAt: now() },
  ],

  prescriptions: [
    { id: 'rx-1', patientName: 'Priya Menon', medicines: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'TID', duration: '5 days' }], allergies: ['Penicillin'], warnings: [], status: 'Active', signedAt: now(), createdAt: now(), updatedAt: now() },
  ],

  doctorLabReports: [
    { id: 'lab-d-1', patientName: 'Rajesh Kumar', test: 'Lipid Panel', biomarkers: [{ name: 'LDL', value: 142, unit: 'mg/dL', ref: '<100' }, { name: 'HDL', value: 38, unit: 'mg/dL', ref: '>40' }], aiInterpretation: 'Elevated LDL — statin therapy recommended', annotations: '', status: 'Pending', date: new Date().toISOString().split('T')[0], createdAt: now(), updatedAt: now() },
  ],

  medicalRecords: [
    { id: 'mr-1', patientName: 'Rajesh Kumar', patientId: 'P-101', diagnoses: ['Hypertension', 'Type 2 DM'], procedures: ['Angiography 2023'], allergies: ['Sulfa'], immunizations: ['COVID-19 Booster'], imaging: ['Chest X-Ray 2025'], timeline: [{ date: '2025-01-10', event: 'Annual checkup', type: 'visit' }], status: 'Active', createdAt: now(), updatedAt: now() },
  ],

  telemedicineSessions: [
    { id: 'tel-1', patientName: 'Anita Sharma', scheduledAt: new Date(Date.now() + 3600000).toISOString(), duration: 30, notes: '', transcript: '', status: 'Scheduled', createdAt: now(), updatedAt: now() },
  ],

  emergencies: [
    { id: 'em-1', patientName: 'Arun Patel', severity: 'Critical', location: 'ER Bay 3', assignedDoctor: 'Dr. Satish K.', countdownMinutes: 8, status: 'Active', description: 'Unstable vitals post-syncope', createdAt: now(), updatedAt: now() },
  ],

  addToQueue: (item) => {
    const tokens = get().queue.map((q) => q.token);
    const token = Math.max(100, ...tokens) + 1;
    const entry: QueuePatient = { ...item, id: genId('q'), token, waitMinutes: 0, createdAt: now(), updatedAt: now() };
    set((s) => ({ queue: [...s.queue, entry] }));
    log(set, { module: 'queue', action: 'create', entityId: entry.id, summary: `Added ${entry.patientName} to queue` });
  },
  updateQueue: (item) => {
    set((s) => ({ queue: s.queue.map((q) => (q.id === item.id ? { ...item, updatedAt: now() } : q)) }));
    log(set, { module: 'queue', action: 'update', entityId: item.id, summary: `Updated queue entry ${item.patientName}` });
  },
  removeFromQueue: (id) => {
    const item = get().queue.find((q) => q.id === id);
    set((s) => ({ queue: s.queue.filter((q) => q.id !== id), lastUndo: { type: 'queue', payload: item } }));
    log(set, { module: 'queue', action: 'delete', entityId: id, summary: `Removed patient from queue` });
  },

  addConsultation: (c) => {
    const entry: Consultation = { ...c, id: genId('con'), createdAt: now(), updatedAt: now() };
    set((s) => ({ consultations: [entry, ...s.consultations] }));
    log(set, { module: 'consultations', action: 'create', entityId: entry.id, summary: `Created consultation for ${entry.patientName}` });
  },
  updateConsultation: (c) => {
    set((s) => ({ consultations: s.consultations.map((x) => (x.id === c.id ? { ...c, updatedAt: now() } : x)) }));
    log(set, { module: 'consultations', action: 'update', entityId: c.id, summary: `Updated SOAP notes` });
  },
  archiveConsultation: (id) => {
    set((s) => ({ consultations: s.consultations.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'consultations', action: 'archive', entityId: id, summary: `Archived consultation` });
  },
  deleteConsultation: (id) => {
    set((s) => ({ consultations: s.consultations.filter((x) => x.id !== id) }));
    log(set, { module: 'consultations', action: 'delete', entityId: id, summary: `Deleted consultation` });
  },

  addDiagnosisSession: (d) => {
    const entry: DiagnosisSession = { ...d, id: genId('dx'), createdAt: now(), updatedAt: now() };
    set((s) => ({ diagnosisSessions: [entry, ...s.diagnosisSessions] }));
    log(set, { module: 'diagnosis', action: 'create', entityId: entry.id, summary: `New AI diagnosis session` });
  },
  updateDiagnosisSession: (d) => {
    set((s) => ({ diagnosisSessions: s.diagnosisSessions.map((x) => (x.id === d.id ? { ...d, updatedAt: now() } : x)) }));
    log(set, { module: 'diagnosis', action: 'update', entityId: d.id, summary: `Updated diagnosis session` });
  },
  archiveDiagnosisSession: (id) => {
    set((s) => ({ diagnosisSessions: s.diagnosisSessions.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'diagnosis', action: 'archive', entityId: id, summary: `Archived diagnosis session` });
  },
  deleteDiagnosisSession: (id) => {
    set((s) => ({ diagnosisSessions: s.diagnosisSessions.filter((x) => x.id !== id) }));
    log(set, { module: 'diagnosis', action: 'delete', entityId: id, summary: `Deleted diagnosis session` });
  },

  addPrescription: (p) => {
    const entry: Prescription = { ...p, id: genId('rx'), signedAt: now(), createdAt: now(), updatedAt: now() };
    set((s) => ({ prescriptions: [entry, ...s.prescriptions] }));
    log(set, { module: 'prescriptions', action: 'create', entityId: entry.id, summary: `Issued prescription for ${entry.patientName}` });
  },
  updatePrescription: (p) => {
    set((s) => ({ prescriptions: s.prescriptions.map((x) => (x.id === p.id ? { ...p, updatedAt: now() } : p)) }));
    log(set, { module: 'prescriptions', action: 'update', entityId: p.id, summary: `Updated prescription` });
  },
  deletePrescription: (id) => {
    set((s) => ({ prescriptions: s.prescriptions.filter((x) => x.id !== id) }));
    log(set, { module: 'prescriptions', action: 'delete', entityId: id, summary: `Deleted prescription` });
  },

  addDoctorLabReport: (r) => {
    const entry: DoctorLabReport = { ...r, id: genId('lab-d'), createdAt: now(), updatedAt: now() };
    set((s) => ({ doctorLabReports: [entry, ...s.doctorLabReports] }));
    log(set, { module: 'lab', action: 'create', entityId: entry.id, summary: `Uploaded lab report` });
  },
  updateDoctorLabReport: (r) => {
    set((s) => ({ doctorLabReports: s.doctorLabReports.map((x) => (x.id === r.id ? { ...r, updatedAt: now() } : r)) }));
    log(set, { module: 'lab', action: 'update', entityId: r.id, summary: `Updated lab report` });
  },
  archiveDoctorLabReport: (id) => {
    set((s) => ({ doctorLabReports: s.doctorLabReports.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'lab', action: 'archive', entityId: id, summary: `Archived lab report` });
  },
  deleteDoctorLabReport: (id) => {
    set((s) => ({ doctorLabReports: s.doctorLabReports.filter((x) => x.id !== id) }));
    log(set, { module: 'lab', action: 'delete', entityId: id, summary: `Deleted lab report` });
  },

  addMedicalRecord: (r) => {
    const entry: MedicalRecord = { ...r, id: genId('mr'), createdAt: now(), updatedAt: now() };
    set((s) => ({ medicalRecords: [entry, ...s.medicalRecords] }));
    log(set, { module: 'records', action: 'create', entityId: entry.id, summary: `Created medical record` });
  },
  updateMedicalRecord: (r) => {
    set((s) => ({ medicalRecords: s.medicalRecords.map((x) => (x.id === r.id ? { ...r, updatedAt: now() } : r)) }));
    log(set, { module: 'records', action: 'update', entityId: r.id, summary: `Updated medical record` });
  },
  archiveMedicalRecord: (id) => {
    set((s) => ({ medicalRecords: s.medicalRecords.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'records', action: 'archive', entityId: id, summary: `Archived medical record` });
  },
  deleteMedicalRecord: (id) => {
    set((s) => ({ medicalRecords: s.medicalRecords.filter((x) => x.id !== id) }));
    log(set, { module: 'records', action: 'delete', entityId: id, summary: `Deleted medical record` });
  },

  addTelemedicineSession: (s) => {
    const entry: TelemedicineSession = { ...s, id: genId('tel'), createdAt: now(), updatedAt: now() };
    set((state) => ({ telemedicineSessions: [entry, ...state.telemedicineSessions] }));
    log(set, { module: 'telemedicine', action: 'create', entityId: entry.id, summary: `Scheduled telemedicine session` });
  },
  updateTelemedicineSession: (s) => {
    set((state) => ({ telemedicineSessions: state.telemedicineSessions.map((x) => (x.id === s.id ? { ...s, updatedAt: now() } : x)) }));
    log(set, { module: 'telemedicine', action: 'update', entityId: s.id, summary: `Updated telemedicine session` });
  },
  deleteTelemedicineSession: (id) => {
    set((state) => ({ telemedicineSessions: state.telemedicineSessions.filter((x) => x.id !== id) }));
    log(set, { module: 'telemedicine', action: 'delete', entityId: id, summary: `Deleted telemedicine session` });
  },

  addEmergency: (e) => {
    const entry: EmergencyCase = { ...e, id: genId('em'), createdAt: now(), updatedAt: now() };
    set((s) => ({ emergencies: [entry, ...s.emergencies] }));
    log(set, { module: 'emergency', action: 'create', entityId: entry.id, summary: `Emergency case opened` });
  },
  updateEmergency: (e) => {
    set((s) => ({ emergencies: s.emergencies.map((x) => (x.id === e.id ? { ...e, updatedAt: now() } : e)) }));
    log(set, { module: 'emergency', action: 'update', entityId: e.id, summary: `Updated emergency case` });
  },
  closeEmergency: (id) => {
    set((s) => ({ emergencies: s.emergencies.map((x) => (x.id === id ? { ...x, status: 'Closed' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'emergency', action: 'archive', entityId: id, summary: `Closed emergency case` });
  },
  deleteEmergency: (id) => {
    set((s) => ({ emergencies: s.emergencies.filter((x) => x.id !== id) }));
    log(set, { module: 'emergency', action: 'delete', entityId: id, summary: `Deleted emergency case` });
  },

  logActivity: (entry) => log(set, entry),
  setWsConnected: (v) => set({ wsConnected: v }),
  simulateRealtimeTick: () => {
    set((s) => ({
      queue: s.queue.map((q) =>
        q.status === 'Waiting' ? { ...q, waitMinutes: q.waitMinutes + 1, updatedAt: now() } : q
      ),
      emergencies: s.emergencies.map((e) =>
        e.status === 'Active' && e.countdownMinutes > 0
          ? { ...e, countdownMinutes: e.countdownMinutes - 1, updatedAt: now() }
          : e
      ),
    }));
  },
}));
