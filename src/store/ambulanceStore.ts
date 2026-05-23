import { create } from 'zustand';

export type AmbulanceStatus = 'Available' | 'Dispatched' | 'En Route' | 'On Scene' | 'Returning' | 'Maintenance';
export type Severity = 'P1 Critical' | 'P2 High' | 'P3 Moderate';
export type RequestStatus = 'Pending' | 'Assigned' | 'En Route' | 'On Scene' | 'Completed' | 'Cancelled';
export type DispatchStatus = 'Active' | 'Completed' | 'Cancelled' | 'Archived';
export type TransportStatus = 'Pickup Pending' | 'En Route' | 'At Hospital' | 'Handoff Complete' | 'Archived';
export type AlertSeverity = 'Info' | 'Warning' | 'Critical';

export interface AmbulanceUnit {
  id: string;
  callSign: string;
  plateNumber: string;
  status: AmbulanceStatus;
  lat: number;
  lng: number;
  etaMinutes: number;
  driverId?: string;
  driverName?: string;
  hospitalTarget?: string;
  speedKmh: number;
  fuelPercent: number;
  healthScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyRequest {
  id: string;
  callerName: string;
  phone: string;
  incidentType: string;
  severity: Severity;
  address: string;
  lat: number;
  lng: number;
  status: RequestStatus;
  dispatchTimerSec: number;
  aiTriage: string;
  suggestedUnit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DispatchAssignment {
  id: string;
  requestId: string;
  unitId: string;
  driverId: string;
  patientSummary: string;
  status: DispatchStatus;
  routeKm: number;
  etaMinutes: number;
  timeline: { time: string; event: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AmbulanceDriver {
  id: string;
  name: string;
  license: string;
  phone: string;
  shift: string;
  status: 'On Duty' | 'Off Duty' | 'On Break';
  fatigueScore: number;
  certifications: string[];
  currentUnitId?: string;
  performanceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoutePlan {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  durationMin: number;
  trafficLevel: 'Low' | 'Medium' | 'High';
  aiRecommended: boolean;
  alternateRoute?: string;
  weatherImpact: string;
  status: 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface VehicleHealthRecord {
  id: string;
  unitId: string;
  callSign: string;
  fuelPercent: number;
  odometerKm: number;
  defibrillatorOk: boolean;
  oxygenPercent: number;
  lastService: string;
  nextService: string;
  maintenanceNotes: string;
  aiPrediction: string;
  status: 'Healthy' | 'Attention' | 'Critical';
  createdAt: string;
  updatedAt: string;
}

export interface PatientTransport {
  id: string;
  patientName: string;
  condition: string;
  unitId: string;
  pickupLocation: string;
  hospital: string;
  status: TransportStatus;
  etaMinutes: number;
  familyNotified: boolean;
  timeline: { time: string; event: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CoordinationEvent {
  id: string;
  title: string;
  teams: string[];
  commander: string;
  status: 'Active' | 'Standby' | 'Closed';
  notes: string;
  timeline: { time: string; action: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AmbulanceAlert {
  id: string;
  title: string;
  source: string;
  severity: AlertSeverity;
  message: string;
  acknowledged: boolean;
  status: 'Active' | 'Acknowledged' | 'Resolved' | 'Archived';
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

interface AmbulanceState {
  units: AmbulanceUnit[];
  requests: EmergencyRequest[];
  dispatches: DispatchAssignment[];
  drivers: AmbulanceDriver[];
  routes: RoutePlan[];
  vehicleHealth: VehicleHealthRecord[];
  transports: PatientTransport[];
  coordination: CoordinationEvent[];
  alerts: AmbulanceAlert[];
  activityLogs: ActivityLog[];
  wsConnected: boolean;
  avgResponseMin: number;

  addUnit: (u: Omit<AmbulanceUnit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUnit: (u: AmbulanceUnit) => void;
  archiveUnit: (id: string) => void;
  deleteUnit: (id: string) => void;

  addRequest: (r: Omit<EmergencyRequest, 'id' | 'createdAt' | 'updatedAt' | 'dispatchTimerSec' | 'aiTriage'>) => void;
  updateRequest: (r: EmergencyRequest) => void;
  archiveRequest: (id: string) => void;
  deleteRequest: (id: string) => void;

  addDispatch: (d: Omit<DispatchAssignment, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
  updateDispatch: (d: DispatchAssignment) => void;
  archiveDispatch: (id: string) => void;
  deleteDispatch: (id: string) => void;

  addDriver: (d: Omit<AmbulanceDriver, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDriver: (d: AmbulanceDriver) => void;
  archiveDriver: (id: string) => void;
  deleteDriver: (id: string) => void;

  addRoute: (r: Omit<RoutePlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoute: (r: RoutePlan) => void;
  archiveRoute: (id: string) => void;
  deleteRoute: (id: string) => void;

  addVehicleHealth: (v: Omit<VehicleHealthRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVehicleHealth: (v: VehicleHealthRecord) => void;
  deleteVehicleHealth: (id: string) => void;

  addTransport: (t: Omit<PatientTransport, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
  updateTransport: (t: PatientTransport) => void;
  archiveTransport: (id: string) => void;
  deleteTransport: (id: string) => void;

  addCoordination: (c: Omit<CoordinationEvent, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
  updateCoordination: (c: CoordinationEvent) => void;
  closeCoordination: (id: string) => void;
  deleteCoordination: (id: string) => void;

  addAlert: (a: Omit<AmbulanceAlert, 'id' | 'createdAt' | 'updatedAt' | 'acknowledged'>) => void;
  updateAlert: (a: AmbulanceAlert) => void;
  acknowledgeAlert: (id: string) => void;
  archiveAlert: (id: string) => void;
  deleteAlert: (id: string) => void;

  logActivity: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  setWsConnected: (v: boolean) => void;
  simulateRealtimeTick: () => void;
}

const now = () => new Date().toISOString();
const genId = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;
const log = (set: (fn: (s: AmbulanceState) => Partial<AmbulanceState>) => void, e: Omit<ActivityLog, 'id' | 'timestamp'>) =>
  set((s) => ({ activityLogs: [{ ...e, id: genId('log'), timestamp: now() }, ...s.activityLogs].slice(0, 120) }));

export const useAmbulanceStore = create<AmbulanceState>((set, get) => ({
  wsConnected: true,
  avgResponseMin: 8.4,
  activityLogs: [],

  units: [
    { id: 'u-1', callSign: 'ALPHA-1', plateNumber: 'TN EM 1001', status: 'En Route', lat: 13.0827, lng: 80.2707, etaMinutes: 6, driverName: 'Karthik R.', speedKmh: 62, fuelPercent: 78, healthScore: 94, hospitalTarget: 'AV Care Chennai HQ', createdAt: now(), updatedAt: now() },
    { id: 'u-2', callSign: 'BRAVO-2', plateNumber: 'TN EM 1002', status: 'Available', lat: 13.0569, lng: 80.2421, etaMinutes: 0, driverName: 'Suresh M.', speedKmh: 0, fuelPercent: 91, healthScore: 98, createdAt: now(), updatedAt: now() },
    { id: 'u-3', callSign: 'CHARLIE-3', plateNumber: 'TN EM 1003', status: 'On Scene', lat: 13.0108, lng: 80.2120, etaMinutes: 0, driverName: 'Arjun V.', speedKmh: 0, fuelPercent: 65, healthScore: 88, createdAt: now(), updatedAt: now() },
    { id: 'u-4', callSign: 'DELTA-4', plateNumber: 'TN EM 1004', status: 'Maintenance', lat: 13.0400, lng: 80.2300, etaMinutes: 0, speedKmh: 0, fuelPercent: 45, healthScore: 72, createdAt: now(), updatedAt: now() },
  ],

  requests: [
    { id: 'req-1', callerName: 'Emergency Caller', phone: '+91 98765 00001', incidentType: 'Cardiac Arrest', severity: 'P1 Critical', address: '12 Anna Salai, Chennai', lat: 13.0604, lng: 80.2496, status: 'Assigned', dispatchTimerSec: 45, aiTriage: 'Immediate ALS — assign nearest unit', suggestedUnit: 'ALPHA-1', createdAt: now(), updatedAt: now() },
    { id: 'req-2', callerName: 'Bystander', phone: '+91 91234 00002', incidentType: 'Road Accident', severity: 'P2 High', address: 'OMR Junction', lat: 12.9815, lng: 80.2180, status: 'Pending', dispatchTimerSec: 120, aiTriage: 'Trauma team alert recommended', suggestedUnit: 'BRAVO-2', createdAt: now(), updatedAt: now() },
  ],

  dispatches: [
    { id: 'dsp-1', requestId: 'req-1', unitId: 'u-1', driverId: 'drv-1', patientSummary: 'Male 54 — chest pain', status: 'Active', routeKm: 4.2, etaMinutes: 6, timeline: [{ time: now(), event: 'Dispatched ALPHA-1' }], createdAt: now(), updatedAt: now() },
  ],

  drivers: [
    { id: 'drv-1', name: 'Karthik R.', license: 'TN-DL-8821', phone: '+91 90001 11111', shift: 'Alpha Day', status: 'On Duty', fatigueScore: 22, certifications: ['ALS', 'BLS'], currentUnitId: 'u-1', performanceScore: 96, createdAt: now(), updatedAt: now() },
    { id: 'drv-2', name: 'Suresh M.', license: 'TN-DL-7732', phone: '+91 90002 22222', shift: 'Alpha Day', status: 'On Duty', fatigueScore: 15, certifications: ['BLS'], currentUnitId: 'u-2', performanceScore: 92, createdAt: now(), updatedAt: now() },
    { id: 'drv-3', name: 'Arjun V.', license: 'TN-DL-6643', phone: '+91 90003 33333', shift: 'Alpha Day', status: 'On Duty', fatigueScore: 48, certifications: ['ALS', 'BLS', 'PHTLS'], currentUnitId: 'u-3', performanceScore: 89, createdAt: now(), updatedAt: now() },
  ],

  routes: [
    { id: 'rt-1', name: 'Anna Salai → AV Care HQ', origin: 'Anna Salai', destination: 'AV Care Chennai HQ', distanceKm: 4.2, durationMin: 11, trafficLevel: 'Medium', aiRecommended: true, weatherImpact: 'Clear', status: 'Active', createdAt: now(), updatedAt: now() },
  ],

  vehicleHealth: [
    { id: 'vh-1', unitId: 'u-1', callSign: 'ALPHA-1', fuelPercent: 78, odometerKm: 45200, defibrillatorOk: true, oxygenPercent: 88, lastService: '2026-04-01', nextService: '2026-06-01', maintenanceNotes: '', aiPrediction: 'Oxygen refill in 2 shifts', status: 'Healthy', createdAt: now(), updatedAt: now() },
    { id: 'vh-4', unitId: 'u-4', callSign: 'DELTA-4', fuelPercent: 45, odometerKm: 89100, defibrillatorOk: true, oxygenPercent: 60, lastService: '2026-01-15', nextService: '2026-05-01', maintenanceNotes: 'Brake inspection due', aiPrediction: 'Schedule service within 72h', status: 'Attention', createdAt: now(), updatedAt: now() },
  ],

  transports: [
    { id: 'tr-1', patientName: 'Patient #4421', condition: 'Critical — cardiac', unitId: 'u-1', pickupLocation: 'Anna Salai', hospital: 'AV Care Chennai HQ', status: 'En Route', etaMinutes: 6, familyNotified: true, timeline: [{ time: now(), event: 'Pickup confirmed' }], createdAt: now(), updatedAt: now() },
  ],

  coordination: [
    { id: 'coord-1', title: 'P1 Cardiac — Multi-team', teams: ['Ambulance', 'ER', 'Security'], commander: 'Dispatcher Priya N.', status: 'Active', notes: 'Clear route to ER bay 2', timeline: [{ time: now(), action: 'ER notified' }], createdAt: now(), updatedAt: now() },
  ],

  alerts: [
    { id: 'alt-1', title: 'DELTA-4 maintenance overdue', source: 'Fleet AI', severity: 'Warning', message: 'Vehicle health score below threshold', acknowledged: false, status: 'Active', createdAt: now(), updatedAt: now() },
    { id: 'alt-2', title: 'P1 dispatch SLA', source: 'Dispatch', severity: 'Critical', message: 'Response timer active — 45s elapsed', acknowledged: false, status: 'Active', createdAt: now(), updatedAt: now() },
  ],

  addUnit: (u) => { const e: AmbulanceUnit = { ...u, id: genId('u'), createdAt: now(), updatedAt: now() }; set((s) => ({ units: [...s.units, e] })); log(set, { module: 'gps', action: 'create', entityId: e.id, summary: `Unit ${e.callSign} added` }); },
  updateUnit: (u) => { set((s) => ({ units: s.units.map((x) => (x.id === u.id ? { ...u, updatedAt: now() } : x)) })); log(set, { module: 'gps', action: 'update', entityId: u.id, summary: `Unit ${u.callSign} updated` }); },
  archiveUnit: (id) => { set((s) => ({ units: s.units.map((x) => (x.id === id ? { ...x, status: 'Maintenance' as const, updatedAt: now() } : x)) })); },
  deleteUnit: (id) => { set((s) => ({ units: s.units.filter((x) => x.id !== id) })); log(set, { module: 'gps', action: 'delete', entityId: id, summary: 'Unit removed' }); },

  addRequest: (r) => {
    const e: EmergencyRequest = { ...r, id: genId('req'), dispatchTimerSec: 0, aiTriage: 'AI: Assign nearest available ALS unit', createdAt: now(), updatedAt: now() };
    set((s) => ({ requests: [e, ...s.requests] }));
    log(set, { module: 'requests', action: 'create', entityId: e.id, summary: `Emergency: ${e.incidentType}` });
  },
  updateRequest: (r) => { set((s) => ({ requests: s.requests.map((x) => (x.id === r.id ? { ...r, updatedAt: now() } : x)) })); log(set, { module: 'requests', action: 'update', entityId: r.id, summary: 'Request updated' }); },
  archiveRequest: (id) => { set((s) => ({ requests: s.requests.map((x) => (x.id === id ? { ...x, status: 'Completed' as const, updatedAt: now() } : x)) })); },
  deleteRequest: (id) => { set((s) => ({ requests: s.requests.filter((x) => x.id !== id) })); },

  addDispatch: (d) => {
    const e: DispatchAssignment = { ...d, id: genId('dsp'), timeline: [{ time: now(), event: 'Dispatch created' }], createdAt: now(), updatedAt: now() };
    set((s) => ({ dispatches: [e, ...s.dispatches] }));
    log(set, { module: 'dispatch', action: 'create', entityId: e.id, summary: 'Dispatch assigned' });
  },
  updateDispatch: (d) => { set((s) => ({ dispatches: s.dispatches.map((x) => (x.id === d.id ? { ...d, updatedAt: now() } : d)) })); },
  archiveDispatch: (id) => { set((s) => ({ dispatches: s.dispatches.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) })); },
  deleteDispatch: (id) => { set((s) => ({ dispatches: s.dispatches.filter((x) => x.id !== id) })); },

  addDriver: (d) => { const e: AmbulanceDriver = { ...d, id: genId('drv'), createdAt: now(), updatedAt: now() }; set((s) => ({ drivers: [...s.drivers, e] })); log(set, { module: 'drivers', action: 'create', entityId: e.id, summary: `Driver ${e.name}` }); },
  updateDriver: (d) => { set((s) => ({ drivers: s.drivers.map((x) => (x.id === d.id ? { ...d, updatedAt: now() } : d)) })); },
  archiveDriver: (id) => { set((s) => ({ drivers: s.drivers.map((x) => (x.id === id ? { ...x, status: 'Off Duty' as const, updatedAt: now() } : x)) })); },
  deleteDriver: (id) => { set((s) => ({ drivers: s.drivers.filter((x) => x.id !== id) })); },

  addRoute: (r) => { const e: RoutePlan = { ...r, id: genId('rt'), createdAt: now(), updatedAt: now() }; set((s) => ({ routes: [...s.routes, e] })); },
  updateRoute: (r) => { set((s) => ({ routes: s.routes.map((x) => (x.id === r.id ? { ...r, updatedAt: now() } : r)) })); },
  archiveRoute: (id) => { set((s) => ({ routes: s.routes.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) })); },
  deleteRoute: (id) => { set((s) => ({ routes: s.routes.filter((x) => x.id !== id) })); },

  addVehicleHealth: (v) => { const e: VehicleHealthRecord = { ...v, id: genId('vh'), createdAt: now(), updatedAt: now() }; set((s) => ({ vehicleHealth: [...s.vehicleHealth, e] })); },
  updateVehicleHealth: (v) => { set((s) => ({ vehicleHealth: s.vehicleHealth.map((x) => (x.id === v.id ? { ...v, updatedAt: now() } : v)) })); },
  deleteVehicleHealth: (id) => { set((s) => ({ vehicleHealth: s.vehicleHealth.filter((x) => x.id !== id) })); },

  addTransport: (t) => {
    const e: PatientTransport = { ...t, id: genId('tr'), timeline: [{ time: now(), event: 'Transport initiated' }], createdAt: now(), updatedAt: now() };
    set((s) => ({ transports: [e, ...s.transports] }));
    log(set, { module: 'transport', action: 'create', entityId: e.id, summary: `Transport ${t.patientName}` });
  },
  updateTransport: (t) => { set((s) => ({ transports: s.transports.map((x) => (x.id === t.id ? { ...t, updatedAt: now() } : t)) })); },
  archiveTransport: (id) => { set((s) => ({ transports: s.transports.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) })); },
  deleteTransport: (id) => { set((s) => ({ transports: s.transports.filter((x) => x.id !== id) })); },

  addCoordination: (c) => {
    const e: CoordinationEvent = { ...c, id: genId('coord'), timeline: [{ time: now(), action: 'Event opened' }], createdAt: now(), updatedAt: now() };
    set((s) => ({ coordination: [e, ...s.coordination] }));
  },
  updateCoordination: (c) => { set((s) => ({ coordination: s.coordination.map((x) => (x.id === c.id ? { ...c, updatedAt: now() } : c)) })); },
  closeCoordination: (id) => { set((s) => ({ coordination: s.coordination.map((x) => (x.id === id ? { ...x, status: 'Closed' as const, updatedAt: now() } : x)) })); },
  deleteCoordination: (id) => { set((s) => ({ coordination: s.coordination.filter((x) => x.id !== id) })); },

  addAlert: (a) => {
    const e: AmbulanceAlert = { ...a, id: genId('alt'), acknowledged: false, createdAt: now(), updatedAt: now() };
    set((s) => ({ alerts: [e, ...s.alerts] }));
  },
  updateAlert: (a) => { set((s) => ({ alerts: s.alerts.map((x) => (x.id === a.id ? { ...a, updatedAt: now() } : a)) })); },
  acknowledgeAlert: (id) => { set((s) => ({ alerts: s.alerts.map((x) => (x.id === id ? { ...x, acknowledged: true, status: 'Acknowledged' as const, updatedAt: now() } : x)) })); },
  archiveAlert: (id) => { set((s) => ({ alerts: s.alerts.map((x) => (x.id === id ? { ...x, status: 'Archived' as const, updatedAt: now() } : x)) })); },
  deleteAlert: (id) => { set((s) => ({ alerts: s.alerts.filter((x) => x.id !== id) })); },

  logActivity: (e) => log(set, e),
  setWsConnected: (v) => set({ wsConnected: v }),
  simulateRealtimeTick: () => {
    set((s) => ({
      units: s.units.map((u) => {
        if (u.status === 'En Route' || u.status === 'Returning') {
          return { ...u, lat: u.lat + (Math.random() - 0.5) * 0.002, lng: u.lng + (Math.random() - 0.5) * 0.002, speedKmh: 40 + Math.random() * 30, updatedAt: now() };
        }
        return u;
      }),
      requests: s.requests.map((r) => (r.status === 'Pending' ? { ...r, dispatchTimerSec: r.dispatchTimerSec + 1, updatedAt: now() } : r)),
    }));
  },
}));
