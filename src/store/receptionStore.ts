import { create } from 'zustand';

export type QueueType = 'General' | 'Priority' | 'Emergency';
export type TokenStatus = 'Waiting' | 'Called' | 'Serving' | 'Completed' | 'Cancelled';
export type TrackerStatus = 'Checked-in' | 'In Consultation' | 'Completed' | 'Delayed';
export type TicketStatus = 'Open' | 'In Progress' | 'Escalated' | 'Resolved' | 'Closed';
export type NotifyChannel = 'SMS' | 'WhatsApp' | 'Email';

export interface QueueToken {
  id: string;
  tokenNumber: number;
  patientName: string;
  phone: string;
  queueType: QueueType;
  department: string;
  waitMinutes: number;
  estimatedWait: number;
  status: TokenStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LiveTrackerEntry {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  status: TrackerStatus;
  checkInTime: string;
  consultationTimer: number;
  delayMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface WaitingHallEntry {
  id: string;
  patientName: string;
  department: string;
  seatZone: string;
  priority: QueueType;
  occupancy: number;
  maxCapacity: number;
  status: 'Seated' | 'Standing' | 'Escalated' | 'Released';
  waitMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface HelpDeskTicket {
  id: string;
  subject: string;
  description: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: TicketStatus;
  assignee: string;
  slaMinutes: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotifyChannel;
  content: string;
  status: 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface SentNotification {
  id: string;
  recipient: string;
  message: string;
  channel: NotifyChannel;
  templateName?: string;
  status: 'Sent' | 'Pending' | 'Failed';
  createdAt: string;
}

export interface PatientRegistration {
  id: string;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  allergies: string;
  insuranceProvider: string;
  insuranceId: string;
  aadhaar: string;
  pan: string;
  abha: string;
  referringDoctor: string;
  qrCode: string;
  status: 'Active' | 'Archived';
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

interface ReceptionState {
  tokens: QueueToken[];
  liveTracker: LiveTrackerEntry[];
  waitingHall: WaitingHallEntry[];
  helpDeskTickets: HelpDeskTicket[];
  notificationTemplates: NotificationTemplate[];
  sentNotifications: SentNotification[];
  registrations: PatientRegistration[];
  activityLogs: ActivityLog[];
  wsConnected: boolean;
  registrationsToday: number;

  addToken: (t: Omit<QueueToken, 'id' | 'tokenNumber' | 'createdAt' | 'updatedAt' | 'waitMinutes' | 'estimatedWait'>) => void;
  updateToken: (t: QueueToken) => void;
  cancelToken: (id: string) => void;
  callNextToken: (department?: string) => QueueToken | null;

  addTrackerEntry: (e: Omit<LiveTrackerEntry, 'id' | 'createdAt' | 'updatedAt' | 'consultationTimer' | 'delayMinutes'>) => void;
  updateTrackerEntry: (e: LiveTrackerEntry) => void;
  removeTrackerEntry: (id: string) => void;

  addWaitingEntry: (e: Omit<WaitingHallEntry, 'id' | 'createdAt' | 'updatedAt' | 'waitMinutes'>) => void;
  updateWaitingEntry: (e: WaitingHallEntry) => void;
  removeWaitingEntry: (id: string) => void;

  addTicket: (t: Omit<HelpDeskTicket, 'id' | 'createdAt' | 'updatedAt' | 'slaMinutes'>) => void;
  updateTicket: (t: HelpDeskTicket) => void;
  archiveTicket: (id: string) => void;
  deleteTicket: (id: string) => void;

  addTemplate: (t: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (t: NotificationTemplate) => void;
  archiveTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
  sendNotification: (n: Omit<SentNotification, 'id' | 'createdAt' | 'status'>) => void;
  deleteSentNotification: (id: string) => void;

  addRegistration: (r: Omit<PatientRegistration, 'id' | 'qrCode' | 'createdAt' | 'updatedAt' | 'status'>) => string;
  updateRegistration: (r: PatientRegistration) => void;
  archiveRegistration: (id: string) => void;
  deleteRegistration: (id: string) => void;

  logActivity: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  setWsConnected: (v: boolean) => void;
  simulateRealtimeTick: () => void;
}

const now = () => new Date().toISOString();
const genId = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

const log = (set: (fn: (s: ReceptionState) => Partial<ReceptionState>) => void, entry: Omit<ActivityLog, 'id' | 'timestamp'>) => {
  set((s) => ({
    activityLogs: [{ ...entry, id: genId('log'), timestamp: now() }, ...s.activityLogs].slice(0, 100),
  }));
};

export const useReceptionStore = create<ReceptionState>((set, get) => ({
  wsConnected: true,
  registrationsToday: 12,
  activityLogs: [],

  tokens: [
    { id: 'tk-1', tokenNumber: 201, patientName: 'Meera Iyer', phone: '+91 98765 43210', queueType: 'General', department: 'OPD', waitMinutes: 18, estimatedWait: 22, status: 'Waiting', createdAt: now(), updatedAt: now() },
    { id: 'tk-2', tokenNumber: 202, patientName: 'Vikram Singh', phone: '+91 91234 56789', queueType: 'Priority', department: 'Cardiology', waitMinutes: 8, estimatedWait: 12, status: 'Waiting', createdAt: now(), updatedAt: now() },
    { id: 'tk-3', tokenNumber: 203, patientName: 'Lakshmi Rao', phone: '+91 99887 76655', queueType: 'Emergency', department: 'Emergency', waitMinutes: 2, estimatedWait: 5, status: 'Called', createdAt: now(), updatedAt: now() },
  ],

  liveTracker: [
    { id: 'lt-1', patientName: 'Meera Iyer', doctorName: 'Dr. Satish K.', specialty: 'Cardiology', status: 'Checked-in', checkInTime: now(), consultationTimer: 0, delayMinutes: 0, createdAt: now(), updatedAt: now() },
    { id: 'lt-2', patientName: 'Vikram Singh', doctorName: 'Dr. Priya N.', specialty: 'General', status: 'In Consultation', checkInTime: now(), consultationTimer: 14, delayMinutes: 0, createdAt: now(), updatedAt: now() },
  ],

  waitingHall: [
    { id: 'wh-1', patientName: 'Anita Desai', department: 'OPD', seatZone: 'A-West', priority: 'General', occupancy: 42, maxCapacity: 60, status: 'Seated', waitMinutes: 25, createdAt: now(), updatedAt: now() },
    { id: 'wh-2', patientName: 'Rohan Pillai', department: 'Lab', seatZone: 'B-North', priority: 'Priority', occupancy: 28, maxCapacity: 40, status: 'Standing', waitMinutes: 12, createdAt: now(), updatedAt: now() },
  ],

  helpDeskTickets: [
    { id: 'hd-1', subject: 'Wheelchair assistance', description: 'Patient needs wheelchair at main entrance', department: 'Facilities', priority: 'High', status: 'Open', assignee: 'Unassigned', slaMinutes: 45, category: 'Facility', createdAt: now(), updatedAt: now() },
  ],

  notificationTemplates: [
    { id: 'nt-1', name: 'Appointment Reminder', channel: 'WhatsApp', content: 'Hi {{name}}, your appointment is on {{date}} at {{time}}.', status: 'Active', createdAt: now(), updatedAt: now() },
    { id: 'nt-2', name: 'Lab Report Ready', channel: 'SMS', content: 'Your lab report is ready. Visit AV Care reception.', status: 'Active', createdAt: now(), updatedAt: now() },
  ],

  sentNotifications: [
    { id: 'sn-1', recipient: 'Meera Iyer', message: 'Appointment reminder sent', channel: 'WhatsApp', templateName: 'Appointment Reminder', status: 'Sent', createdAt: now() },
  ],

  registrations: [
    {
      id: 'reg-1',
      name: 'Meera Iyer',
      dob: '1990-05-12',
      gender: 'Female',
      phone: '+91 98765 43210',
      address: '12 MG Road, Chennai',
      emergencyContact: 'Ravi Iyer +91 90000 11111',
      bloodGroup: 'B+',
      allergies: 'Penicillin',
      insuranceProvider: 'Star Health',
      insuranceId: 'SH-88291',
      aadhaar: 'XXXX-XXXX-4521',
      pan: 'ABCDE1234F',
      abha: 'ABHA-99281',
      referringDoctor: 'Dr. Satish K.',
      qrCode: 'AVC-REG-reg-1',
      status: 'Active',
      createdAt: now(),
      updatedAt: now(),
    },
  ],

  addToken: (t) => {
    const nums = get().tokens.map((x) => x.tokenNumber);
    const tokenNumber = Math.max(200, ...nums) + 1;
    const entry: QueueToken = { ...t, id: genId('tk'), tokenNumber, waitMinutes: 0, estimatedWait: t.queueType === 'Emergency' ? 5 : t.queueType === 'Priority' ? 12 : 20, createdAt: now(), updatedAt: now() };
    set((s) => ({ tokens: [...s.tokens, entry] }));
    log(set, { module: 'queue', action: 'create', entityId: entry.id, summary: `Token #${entry.tokenNumber} for ${entry.patientName}` });
  },
  updateToken: (t) => {
    set((s) => ({ tokens: s.tokens.map((x) => (x.id === t.id ? { ...t, updatedAt: now() } : x)) }));
    log(set, { module: 'queue', action: 'update', entityId: t.id, summary: `Updated token #${t.tokenNumber}` });
  },
  cancelToken: (id) => {
    set((s) => ({ tokens: s.tokens.filter((x) => x.id !== id) }));
    log(set, { module: 'queue', action: 'delete', entityId: id, summary: 'Token cancelled' });
  },
  callNextToken: (department) => {
    const waiting = get().tokens.filter(
      (t) => t.status === 'Waiting' && (!department || t.department === department)
    );
    if (!waiting.length) return null;
    const next = waiting.sort((a, b) => {
      const p = { Emergency: 0, Priority: 1, General: 2 };
      return p[a.queueType] - p[b.queueType] || a.tokenNumber - b.tokenNumber;
    })[0];
    const updated = { ...next, status: 'Called' as const, updatedAt: now() };
    set((s) => ({ tokens: s.tokens.map((t) => (t.id === next.id ? updated : t)) }));
    return updated;
  },

  addTrackerEntry: (e) => {
    const entry: LiveTrackerEntry = { ...e, id: genId('lt'), consultationTimer: 0, delayMinutes: 0, createdAt: now(), updatedAt: now() };
    set((s) => ({ liveTracker: [entry, ...s.liveTracker] }));
    log(set, { module: 'tracker', action: 'create', entityId: entry.id, summary: `Tracking ${entry.patientName}` });
  },
  updateTrackerEntry: (e) => {
    set((s) => ({ liveTracker: s.liveTracker.map((x) => (x.id === e.id ? { ...e, updatedAt: now() } : x)) }));
    log(set, { module: 'tracker', action: 'update', entityId: e.id, summary: `Status → ${e.status}` });
  },
  removeTrackerEntry: (id) => {
    set((s) => ({ liveTracker: s.liveTracker.filter((x) => x.id !== id) }));
    log(set, { module: 'tracker', action: 'delete', entityId: id, summary: 'Removed tracker entry' });
  },

  addWaitingEntry: (e) => {
    const entry: WaitingHallEntry = { ...e, id: genId('wh'), waitMinutes: 0, createdAt: now(), updatedAt: now() };
    set((s) => ({ waitingHall: [...s.waitingHall, entry] }));
    log(set, { module: 'waiting-hall', action: 'create', entityId: entry.id, summary: `Added ${entry.patientName} to hall` });
  },
  updateWaitingEntry: (e) => {
    set((s) => ({ waitingHall: s.waitingHall.map((x) => (x.id === e.id ? { ...e, updatedAt: now() } : x)) }));
    log(set, { module: 'waiting-hall', action: 'update', entityId: e.id, summary: 'Updated waiting hall entry' });
  },
  removeWaitingEntry: (id) => {
    set((s) => ({ waitingHall: s.waitingHall.filter((x) => x.id !== id) }));
    log(set, { module: 'waiting-hall', action: 'delete', entityId: id, summary: 'Removed from waiting hall' });
  },

  addTicket: (t) => {
    const entry: HelpDeskTicket = { ...t, id: genId('hd'), slaMinutes: t.priority === 'Critical' ? 15 : t.priority === 'High' ? 30 : 60, createdAt: now(), updatedAt: now() };
    set((s) => ({ helpDeskTickets: [entry, ...s.helpDeskTickets] }));
    log(set, { module: 'helpdesk', action: 'create', entityId: entry.id, summary: `Ticket: ${entry.subject}` });
  },
  updateTicket: (t) => {
    set((s) => ({ helpDeskTickets: s.helpDeskTickets.map((x) => (x.id === t.id ? { ...t, updatedAt: now() } : t)) }));
    log(set, { module: 'helpdesk', action: 'update', entityId: t.id, summary: 'Ticket updated' });
  },
  archiveTicket: (id) => {
    set((s) => ({ helpDeskTickets: s.helpDeskTickets.map((x) => (x.id === id ? { ...x, status: 'Closed' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'helpdesk', action: 'archive', entityId: id, summary: 'Ticket closed' });
  },
  deleteTicket: (id) => {
    set((s) => ({ helpDeskTickets: s.helpDeskTickets.filter((x) => x.id !== id) }));
    log(set, { module: 'helpdesk', action: 'delete', entityId: id, summary: 'Ticket deleted' });
  },

  addTemplate: (t) => {
    const entry: NotificationTemplate = { ...t, id: genId('nt'), createdAt: now(), updatedAt: now() };
    set((s) => ({ notificationTemplates: [...s.notificationTemplates, entry] }));
    log(set, { module: 'notifications', action: 'create', entityId: entry.id, summary: `Template ${entry.name}` });
  },
  updateTemplate: (t) => {
    set((s) => ({ notificationTemplates: s.notificationTemplates.map((x) => (x.id === t.id ? { ...t, updatedAt: now() } : x)) }));
    log(set, { module: 'notifications', action: 'update', entityId: t.id, summary: 'Template updated' });
  },
  archiveTemplate: (id) => {
    set((s) => ({ notificationTemplates: s.notificationTemplates.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'notifications', action: 'archive', entityId: id, summary: 'Template archived' });
  },
  deleteTemplate: (id) => {
    set((s) => ({ notificationTemplates: s.notificationTemplates.filter((x) => x.id !== id) }));
    log(set, { module: 'notifications', action: 'delete', entityId: id, summary: 'Template deleted' });
  },
  sendNotification: (n) => {
    const entry: SentNotification = { ...n, id: genId('sn'), status: 'Sent', createdAt: now() };
    set((s) => ({ sentNotifications: [entry, ...s.sentNotifications] }));
    log(set, { module: 'notifications', action: 'create', entityId: entry.id, summary: `Sent ${n.channel} to ${n.recipient}` });
  },
  deleteSentNotification: (id) => {
    set((s) => ({ sentNotifications: s.sentNotifications.filter((x) => x.id !== id) }));
    log(set, { module: 'notifications', action: 'delete', entityId: id, summary: 'Notification removed' });
  },

  addRegistration: (r) => {
    const id = genId('reg');
    const entry: PatientRegistration = {
      ...r,
      id,
      qrCode: `AVC-REG-${id}`,
      status: 'Active',
      createdAt: now(),
      updatedAt: now(),
    };
    set((s) => ({ registrations: [entry, ...s.registrations], registrationsToday: s.registrationsToday + 1 }));
    log(set, { module: 'registration', action: 'create', entityId: id, summary: `Registered ${entry.name}` });
    return id;
  },
  updateRegistration: (r) => {
    set((s) => ({ registrations: s.registrations.map((x) => (x.id === r.id ? { ...r, updatedAt: now() } : r)) }));
    log(set, { module: 'registration', action: 'update', entityId: r.id, summary: `Updated ${r.name}` });
  },
  archiveRegistration: (id) => {
    set((s) => ({ registrations: s.registrations.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'registration', action: 'archive', entityId: id, summary: 'Registration archived' });
  },
  deleteRegistration: (id) => {
    set((s) => ({ registrations: s.registrations.filter((x) => x.id !== id) }));
    log(set, { module: 'registration', action: 'delete', entityId: id, summary: 'Registration deleted' });
  },

  logActivity: (entry) => log(set, entry),
  setWsConnected: (v) => set({ wsConnected: v }),
  simulateRealtimeTick: () => {
    set((s) => ({
      tokens: s.tokens.map((t) =>
        t.status === 'Waiting' ? { ...t, waitMinutes: t.waitMinutes + 1, updatedAt: now() } : t
      ),
      liveTracker: s.liveTracker.map((t) =>
        t.status === 'In Consultation' ? { ...t, consultationTimer: t.consultationTimer + 1, updatedAt: now() } : t
      ),
      waitingHall: s.waitingHall.map((w) =>
        w.status !== 'Released' ? { ...w, waitMinutes: w.waitMinutes + 1, updatedAt: now() } : w
      ),
      helpDeskTickets: s.helpDeskTickets.map((t) =>
        t.status === 'Open' || t.status === 'In Progress'
          ? { ...t, slaMinutes: Math.max(0, t.slaMinutes - 1), updatedAt: now() }
          : t
      ),
    }));
  },
}));
