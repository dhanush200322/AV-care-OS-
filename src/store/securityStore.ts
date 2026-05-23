import { create } from 'zustand';

export type ClearanceLevel = 'Standard' | 'Escorted' | 'VIP' | 'Denied';
export type IncidentType = 'Fire' | 'Intrusion' | 'Medical' | 'Panic' | 'Other';
export type IncidentStatus = 'Active' | 'Investigating' | 'Contained' | 'Resolved' | 'Archived';
export type AlertSeverity = 'Info' | 'Warning' | 'Critical';
export type CameraStatus = 'Online' | 'Offline' | 'Recording' | 'Maintenance';

export interface VisitorPass {
  id: string;
  name: string;
  idProof: string;
  hostName: string;
  hostDepartment: string;
  purpose: string;
  entryTime: string;
  exitTime?: string;
  photoUrl?: string;
  clearance: ClearanceLevel;
  vehiclePlate?: string;
  qrCode: string;
  blacklisted: boolean;
  aiFlag: boolean;
  status: 'Active' | 'Checked-out' | 'Overstay' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface AccessLog {
  id: string;
  personName: string;
  personType: 'Staff' | 'Visitor' | 'Vendor';
  zone: string;
  direction: 'Entry' | 'Exit';
  method: 'Badge' | 'QR' | 'Manual';
  timestamp: string;
  suspicious: boolean;
  notes: string;
  createdAt: string;
}

export interface CameraFeed {
  id: string;
  label: string;
  location: string;
  zone: string;
  status: CameraStatus;
  aiMotion: boolean;
  aiIntrusion: boolean;
  recordingDays: number;
  streamUrl?: string;
  lastHealthCheck: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  type: IncidentType;
  severity: AlertSeverity;
  location: string;
  description: string;
  assignedTeam: string;
  status: IncidentStatus;
  aiSeverityScore: number;
  timeline: { time: string; event: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface RestrictedZone {
  id: string;
  name: string;
  floor: string;
  maxOccupancy: number;
  currentOccupancy: number;
  authorizedRoles: string[];
  unauthorizedAttempts: number;
  status: 'Secure' | 'Breach' | 'Lockdown';
  lastAccess: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingRecord {
  id: string;
  plateNumber: string;
  ownerName: string;
  vehicleType: string;
  slot: string;
  bay: 'General' | 'VIP' | 'Emergency' | 'Staff';
  entryTime: string;
  exitTime?: string;
  fee: number;
  status: 'Parked' | 'Exited' | 'Reserved';
  createdAt: string;
  updatedAt: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  source: string;
  severity: AlertSeverity;
  message: string;
  acknowledged: boolean;
  escalated: boolean;
  status: 'Active' | 'Acknowledged' | 'Resolved' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyResponse {
  id: string;
  code: string;
  title: string;
  teams: string[];
  status: 'Active' | 'Deploying' | 'Standby' | 'Closed';
  commander: string;
  notes: string;
  timeline: { time: string; action: string }[];
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

interface SecurityState {
  visitors: VisitorPass[];
  accessLogs: AccessLog[];
  cameras: CameraFeed[];
  incidents: SecurityIncident[];
  restrictedZones: RestrictedZone[];
  parkingRecords: ParkingRecord[];
  alerts: SecurityAlert[];
  emergencyResponses: EmergencyResponse[];
  activityLogs: ActivityLog[];
  wsConnected: boolean;
  activeIncidentsCount: number;

  addVisitor: (v: Omit<VisitorPass, 'id' | 'qrCode' | 'createdAt' | 'updatedAt' | 'aiFlag' | 'status'>) => void;
  updateVisitor: (v: VisitorPass) => void;
  checkoutVisitor: (id: string) => void;
  archiveVisitor: (id: string) => void;
  deleteVisitor: (id: string) => void;

  addAccessLog: (l: Omit<AccessLog, 'id' | 'createdAt'>) => void;
  updateAccessLog: (l: AccessLog) => void;
  deleteAccessLog: (id: string) => void;

  addCamera: (c: Omit<CameraFeed, 'id' | 'createdAt' | 'updatedAt' | 'lastHealthCheck'>) => void;
  updateCamera: (c: CameraFeed) => void;
  archiveCamera: (id: string) => void;
  deleteCamera: (id: string) => void;

  addIncident: (i: Omit<SecurityIncident, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'aiSeverityScore'>) => void;
  updateIncident: (i: SecurityIncident) => void;
  archiveIncident: (id: string) => void;
  deleteIncident: (id: string) => void;

  addRestrictedZone: (z: Omit<RestrictedZone, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRestrictedZone: (z: RestrictedZone) => void;
  deleteRestrictedZone: (id: string) => void;

  addParkingRecord: (p: Omit<ParkingRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateParkingRecord: (p: ParkingRecord) => void;
  deleteParkingRecord: (id: string) => void;

  addAlert: (a: Omit<SecurityAlert, 'id' | 'createdAt' | 'updatedAt' | 'acknowledged' | 'escalated'>) => void;
  updateAlert: (a: SecurityAlert) => void;
  acknowledgeAlert: (id: string) => void;
  archiveAlert: (id: string) => void;
  deleteAlert: (id: string) => void;

  addEmergencyResponse: (e: Omit<EmergencyResponse, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
  updateEmergencyResponse: (e: EmergencyResponse) => void;
  closeEmergencyResponse: (id: string) => void;
  deleteEmergencyResponse: (id: string) => void;

  logActivity: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  setWsConnected: (v: boolean) => void;
  simulateRealtimeTick: () => void;
}

const now = () => new Date().toISOString();
const genId = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

const log = (set: (fn: (s: SecurityState) => Partial<SecurityState>) => void, entry: Omit<ActivityLog, 'id' | 'timestamp'>) => {
  set((s) => ({ activityLogs: [{ ...entry, id: genId('log'), timestamp: now() }, ...s.activityLogs].slice(0, 120) }));
};

export const useSecurityStore = create<SecurityState>((set, get) => ({
  wsConnected: true,
  activeIncidentsCount: 1,
  activityLogs: [],

  visitors: [
    { id: 'vis-1', name: 'Rahul Mehta', idProof: 'DL-8821', hostName: 'Dr. Satish K.', hostDepartment: 'Cardiology', purpose: 'Consultation', entryTime: now(), clearance: 'Standard', vehiclePlate: 'TN09 AB 4421', qrCode: 'AVC-VIS-vis-1', blacklisted: false, aiFlag: false, status: 'Active', createdAt: now(), updatedAt: now() },
    { id: 'vis-2', name: 'Unknown Vendor', idProof: 'Pending', hostName: 'Facilities', hostDepartment: 'Admin', purpose: 'Maintenance', entryTime: now(), clearance: 'Escorted', qrCode: 'AVC-VIS-vis-2', blacklisted: false, aiFlag: true, status: 'Active', createdAt: now(), updatedAt: now() },
  ],

  accessLogs: [
    { id: 'al-1', personName: 'Rahul Mehta', personType: 'Visitor', zone: 'Main Gate', direction: 'Entry', method: 'QR', timestamp: now(), suspicious: false, notes: '', createdAt: now() },
    { id: 'al-2', personName: 'Staff #442', personType: 'Staff', zone: 'ICU Wing B', direction: 'Entry', method: 'Badge', timestamp: now(), suspicious: true, notes: 'After hours access', createdAt: now() },
  ],

  cameras: [
    { id: 'cam-1', label: 'CAM-01 Main Lobby', location: 'Lobby', zone: 'Public', status: 'Recording', aiMotion: true, aiIntrusion: false, recordingDays: 30, lastHealthCheck: now(), createdAt: now(), updatedAt: now() },
    { id: 'cam-2', label: 'CAM-12 ICU Corridor', location: 'ICU B', zone: 'Restricted', status: 'Online', aiMotion: true, aiIntrusion: true, recordingDays: 30, lastHealthCheck: now(), createdAt: now(), updatedAt: now() },
    { id: 'cam-3', label: 'CAM-08 Parking P1', location: 'Parking', zone: 'Perimeter', status: 'Online', aiMotion: false, aiIntrusion: false, recordingDays: 30, lastHealthCheck: now(), createdAt: now(), updatedAt: now() },
    { id: 'cam-4', label: 'CAM-22 OT Complex', location: 'OT', zone: 'Critical', status: 'Recording', aiMotion: true, aiIntrusion: false, recordingDays: 30, lastHealthCheck: now(), createdAt: now(), updatedAt: now() },
  ],

  incidents: [
    { id: 'inc-1', title: 'Unauthorized ICU access attempt', type: 'Intrusion', severity: 'Critical', location: 'ICU Wing B', description: 'Badge mismatch at restricted door', assignedTeam: 'Alpha Squad', status: 'Investigating', aiSeverityScore: 92, timeline: [{ time: now(), event: 'Alert triggered' }], createdAt: now(), updatedAt: now() },
  ],

  restrictedZones: [
    { id: 'rz-1', name: 'ICU Wing B', floor: '3F', maxOccupancy: 12, currentOccupancy: 8, authorizedRoles: ['Doctor', 'Nurse'], unauthorizedAttempts: 2, status: 'Secure', lastAccess: now(), createdAt: now(), updatedAt: now() },
    { id: 'rz-2', name: 'Pharmacy Vault', floor: '1F', maxOccupancy: 4, currentOccupancy: 2, authorizedRoles: ['Pharmacist', 'Admin'], unauthorizedAttempts: 0, status: 'Secure', lastAccess: now(), createdAt: now(), updatedAt: now() },
  ],

  parkingRecords: [
    { id: 'pk-1', plateNumber: 'TN09 AB 4421', ownerName: 'Rahul Mehta', vehicleType: 'Sedan', slot: 'P1-042', bay: 'General', entryTime: now(), fee: 0, status: 'Parked', createdAt: now(), updatedAt: now() },
    { id: 'pk-2', plateNumber: 'TN01 EM 0001', ownerName: 'Ambulance Unit', vehicleType: 'Emergency', slot: 'EB-01', bay: 'Emergency', entryTime: now(), fee: 0, status: 'Reserved', createdAt: now(), updatedAt: now() },
  ],

  alerts: [
    { id: 'alt-1', title: 'Motion detected — OT corridor', source: 'CAM-22', severity: 'Warning', message: 'AI motion cluster after hours', acknowledged: false, escalated: false, status: 'Active', createdAt: now(), updatedAt: now() },
    { id: 'alt-2', title: 'Restricted zone breach attempt', source: 'ICU B Door', severity: 'Critical', message: 'Invalid badge scan x3', acknowledged: false, escalated: true, status: 'Active', createdAt: now(), updatedAt: now() },
  ],

  emergencyResponses: [
    { id: 'emr-1', code: 'CODE-RED-12', title: 'ICU Security Lockdown', teams: ['Alpha Squad', 'Medical'], status: 'Deploying', commander: 'Officer Vikram S.', notes: 'Coordinate with nursing station', timeline: [{ time: now(), action: 'Teams dispatched' }], createdAt: now(), updatedAt: now() },
  ],

  addVisitor: (v) => {
    const entry: VisitorPass = { ...v, id: genId('vis'), qrCode: `AVC-VIS-${genId('q')}`, aiFlag: false, status: 'Active', createdAt: now(), updatedAt: now() };
    set((s) => ({ visitors: [entry, ...s.visitors] }));
    log(set, { module: 'visitors', action: 'create', entityId: entry.id, summary: `Visitor pass: ${entry.name}` });
  },
  updateVisitor: (v) => {
    set((s) => ({ visitors: s.visitors.map((x) => (x.id === v.id ? { ...v, updatedAt: now() } : x)) }));
    log(set, { module: 'visitors', action: 'update', entityId: v.id, summary: `Updated visitor ${v.name}` });
  },
  checkoutVisitor: (id) => {
    set((s) => ({ visitors: s.visitors.map((x) => (x.id === id ? { ...x, status: 'Checked-out' as const, exitTime: now(), updatedAt: now() } : x)) }));
    log(set, { module: 'visitors', action: 'update', entityId: id, summary: 'Visitor checked out' });
  },
  archiveVisitor: (id) => {
    set((s) => ({ visitors: s.visitors.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'visitors', action: 'archive', entityId: id, summary: 'Visitor archived' });
  },
  deleteVisitor: (id) => {
    set((s) => ({ visitors: s.visitors.filter((x) => x.id !== id) }));
    log(set, { module: 'visitors', action: 'delete', entityId: id, summary: 'Visitor deleted' });
  },

  addAccessLog: (l) => {
    const entry: AccessLog = { ...l, id: genId('al'), createdAt: now() };
    set((s) => ({ accessLogs: [entry, ...s.accessLogs] }));
    log(set, { module: 'access', action: 'create', entityId: entry.id, summary: `${entry.direction} — ${entry.personName}` });
  },
  updateAccessLog: (l) => {
    set((s) => ({ accessLogs: s.accessLogs.map((x) => (x.id === l.id ? l : x)) }));
    log(set, { module: 'access', action: 'update', entityId: l.id, summary: 'Access log updated' });
  },
  deleteAccessLog: (id) => {
    set((s) => ({ accessLogs: s.accessLogs.filter((x) => x.id !== id) }));
    log(set, { module: 'access', action: 'delete', entityId: id, summary: 'Access log deleted' });
  },

  addCamera: (c) => {
    const entry: CameraFeed = { ...c, id: genId('cam'), lastHealthCheck: now(), createdAt: now(), updatedAt: now() };
    set((s) => ({ cameras: [...s.cameras, entry] }));
    log(set, { module: 'cctv', action: 'create', entityId: entry.id, summary: `Camera added: ${entry.label}` });
  },
  updateCamera: (c) => {
    set((s) => ({ cameras: s.cameras.map((x) => (x.id === c.id ? { ...c, updatedAt: now() } : x)) }));
    log(set, { module: 'cctv', action: 'update', entityId: c.id, summary: 'Camera updated' });
  },
  archiveCamera: (id) => {
    set((s) => ({ cameras: s.cameras.map((x) => (x.id === id ? { ...x, status: 'Maintenance' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'cctv', action: 'archive', entityId: id, summary: 'Camera archived' });
  },
  deleteCamera: (id) => {
    set((s) => ({ cameras: s.cameras.filter((x) => x.id !== id) }));
    log(set, { module: 'cctv', action: 'delete', entityId: id, summary: 'Camera removed' });
  },

  addIncident: (i) => {
    const score = i.severity === 'Critical' ? 90 : i.severity === 'Warning' ? 60 : 30;
    const entry: SecurityIncident = { ...i, id: genId('inc'), aiSeverityScore: score, timeline: [{ time: now(), event: 'Incident opened' }], createdAt: now(), updatedAt: now() };
    set((s) => ({ incidents: [entry, ...s.incidents], activeIncidentsCount: s.incidents.filter((x) => x.status === 'Active' || x.status === 'Investigating').length + 1 }));
    log(set, { module: 'incidents', action: 'create', entityId: entry.id, summary: `Incident: ${entry.title}` });
  },
  updateIncident: (i) => {
    set((s) => ({ incidents: s.incidents.map((x) => (x.id === i.id ? { ...i, updatedAt: now() } : x)) }));
    log(set, { module: 'incidents', action: 'update', entityId: i.id, summary: 'Incident updated' });
  },
  archiveIncident: (id) => {
    set((s) => ({ incidents: s.incidents.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'incidents', action: 'archive', entityId: id, summary: 'Incident archived' });
  },
  deleteIncident: (id) => {
    set((s) => ({ incidents: s.incidents.filter((x) => x.id !== id) }));
    log(set, { module: 'incidents', action: 'delete', entityId: id, summary: 'Incident deleted' });
  },

  addRestrictedZone: (z) => {
    const entry: RestrictedZone = { ...z, id: genId('rz'), createdAt: now(), updatedAt: now() };
    set((s) => ({ restrictedZones: [...s.restrictedZones, entry] }));
    log(set, { module: 'restricted', action: 'create', entityId: entry.id, summary: `Zone: ${entry.name}` });
  },
  updateRestrictedZone: (z) => {
    set((s) => ({ restrictedZones: s.restrictedZones.map((x) => (x.id === z.id ? { ...z, updatedAt: now() } : x)) }));
    log(set, { module: 'restricted', action: 'update', entityId: z.id, summary: 'Zone updated' });
  },
  deleteRestrictedZone: (id) => {
    set((s) => ({ restrictedZones: s.restrictedZones.filter((x) => x.id !== id) }));
    log(set, { module: 'restricted', action: 'delete', entityId: id, summary: 'Zone deleted' });
  },

  addParkingRecord: (p) => {
    const entry: ParkingRecord = { ...p, id: genId('pk'), createdAt: now(), updatedAt: now() };
    set((s) => ({ parkingRecords: [entry, ...s.parkingRecords] }));
    log(set, { module: 'parking', action: 'create', entityId: entry.id, summary: `Vehicle ${entry.plateNumber}` });
  },
  updateParkingRecord: (p) => {
    set((s) => ({ parkingRecords: s.parkingRecords.map((x) => (x.id === p.id ? { ...p, updatedAt: now() } : p)) }));
    log(set, { module: 'parking', action: 'update', entityId: p.id, summary: 'Parking updated' });
  },
  deleteParkingRecord: (id) => {
    set((s) => ({ parkingRecords: s.parkingRecords.filter((x) => x.id !== id) }));
    log(set, { module: 'parking', action: 'delete', entityId: id, summary: 'Parking deleted' });
  },

  addAlert: (a) => {
    const entry: SecurityAlert = { ...a, id: genId('alt'), acknowledged: false, escalated: a.severity === 'Critical', createdAt: now(), updatedAt: now() };
    set((s) => ({ alerts: [entry, ...s.alerts] }));
    log(set, { module: 'alerts', action: 'create', entityId: entry.id, summary: `Alert: ${entry.title}` });
  },
  updateAlert: (a) => {
    set((s) => ({ alerts: s.alerts.map((x) => (x.id === a.id ? { ...a, updatedAt: now() } : a)) }));
    log(set, { module: 'alerts', action: 'update', entityId: a.id, summary: 'Alert updated' });
  },
  acknowledgeAlert: (id) => {
    set((s) => ({ alerts: s.alerts.map((x) => (x.id === id ? { ...x, acknowledged: true, status: 'Acknowledged' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'alerts', action: 'update', entityId: id, summary: 'Alert acknowledged' });
  },
  archiveAlert: (id) => {
    set((s) => ({ alerts: s.alerts.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'alerts', action: 'archive', entityId: id, summary: 'Alert archived' });
  },
  deleteAlert: (id) => {
    set((s) => ({ alerts: s.alerts.filter((x) => x.id !== id) }));
    log(set, { module: 'alerts', action: 'delete', entityId: id, summary: 'Alert deleted' });
  },

  addEmergencyResponse: (e) => {
    const entry: EmergencyResponse = { ...e, id: genId('emr'), timeline: [{ time: now(), action: 'Response initiated' }], createdAt: now(), updatedAt: now() };
    set((s) => ({ emergencyResponses: [entry, ...s.emergencyResponses] }));
    log(set, { module: 'emergency', action: 'create', entityId: entry.id, summary: `Emergency: ${entry.code}` });
  },
  updateEmergencyResponse: (e) => {
    set((s) => ({ emergencyResponses: s.emergencyResponses.map((x) => (x.id === e.id ? { ...e, updatedAt: now() } : e)) }));
    log(set, { module: 'emergency', action: 'update', entityId: e.id, summary: 'Response updated' });
  },
  closeEmergencyResponse: (id) => {
    set((s) => ({ emergencyResponses: s.emergencyResponses.map((x) => (x.id === id ? { ...x, status: 'Closed' as const, updatedAt: now() } : x)) }));
    log(set, { module: 'emergency', action: 'archive', entityId: id, summary: 'Response closed' });
  },
  deleteEmergencyResponse: (id) => {
    set((s) => ({ emergencyResponses: s.emergencyResponses.filter((x) => x.id !== id) }));
    log(set, { module: 'emergency', action: 'delete', entityId: id, summary: 'Response deleted' });
  },

  logActivity: (entry) => log(set, entry),
  setWsConnected: (v) => set({ wsConnected: v }),
  simulateRealtimeTick: () => {
    set((s) => ({
      visitors: s.visitors.map((v) => {
        if (v.status !== 'Active') return v;
        const hours = (Date.now() - new Date(v.entryTime).getTime()) / 3600000;
        return hours > 8 ? { ...v, status: 'Overstay' as const, updatedAt: now() } : v;
      }),
      cameras: s.cameras.map((c) => ({ ...c, lastHealthCheck: now() })),
      alerts: s.alerts.map((a) => (a.severity === 'Critical' && !a.acknowledged ? { ...a, updatedAt: now() } : a)),
    }));
  },
}));
