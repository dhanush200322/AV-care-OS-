import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useAmbulanceStore, type EmergencyRequest, type Severity } from '../../../store/ambulanceStore';
import { AmbulanceSmartTable } from '../shared/AmbulanceSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, btnDanger, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const EmergencyRequestsModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { requests, addRequest, updateRequest, archiveRequest, deleteRequest, addDispatch, units } = useAmbulanceStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<EmergencyRequest | null>(null);
  const [toDelete, setToDelete] = useState<EmergencyRequest | null>(null);
  const [form, setForm] = useState({ callerName: '', phone: '', incidentType: '', severity: 'P2 High' as Severity, address: '', lat: 13.05, lng: 80.25, status: 'Pending' as EmergencyRequest['status'] });

  const pending = requests.filter((r) => r.status === 'Pending');

  const dispatchOne = (req: EmergencyRequest) => {
    const unit = units.find((u) => u.status === 'Available') || units[0];
    if (!unit) return;
    addDispatch({ requestId: req.id, unitId: unit.id, driverId: 'drv-1', patientSummary: req.incidentType, status: 'Active', routeKm: 5, etaMinutes: 9 });
    updateRequest({ ...req, status: 'Assigned', suggestedUnit: unit.callSign });
    onToast('success', `Dispatched ${unit.callSign}`);
  };

  return (
    <>
      <div className="space-y-3 mb-6">{pending.slice(0, 3).map((r) => (
        <motion.div key={r.id} animate={{ boxShadow: ['0 0 0 0 rgba(255,68,48,0.4)', '0 0 0 6px rgba(255,68,48,0)', '0 0 0 0 rgba(255,68,48,0)'] }} transition={{ repeat: Infinity, duration: 2 }} className={cn(glassCard, 'p-4 border-[#FF4444]/40 flex justify-between items-center')}>
          <div><p className="font-mono font-bold text-[#FF4444]">{r.severity}</p><p className="text-white font-bold">{r.incidentType}</p><p className="text-xs text-[#B8A28F]">{r.address} · {r.dispatchTimerSec}s</p></div>
          <button type="button" onClick={() => dispatchOne(r)} className={btnDanger}><Zap size={14} />Dispatch</button>
        </motion.div>
      ))}</div>
      <AmbulanceSmartTable title="Emergency" entityName="Requests" subtitle="P1/P2/P3 · AI triage · dispatch timer" data={requests} aiFilterHint="critical"
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm({ ...r, status: r.status }); setSlideOpen(true); }}
        onArchive={(r) => { archiveRequest(r.id); onToast('success', 'Archived'); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'severity', label: 'Severity', render: (r) => <span className={cn(r.severity.includes('P1') && 'text-[#FF4444] animate-pulse', r.severity.includes('P2') && 'text-[#FFA63D]')}>{r.severity}</span> },
          { key: 'incidentType', label: 'Incident' },
          { key: 'address', label: 'Location' },
          { key: 'status', label: 'Status' },
          { key: 'dispatchTimerSec', label: 'Timer', render: (r) => `${r.dispatchTimerSec}s` },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Emergency Request" footer={<button type="button" onClick={() => { if (editing) updateRequest({ ...editing, ...form }); else addRequest(form); onToast('success', 'Saved'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4">
          <input className={inputClass} value={form.incidentType} onChange={(e) => setForm({ ...form, incidentType: e.target.value })} placeholder="Incident type" />
          <select className={inputClass} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as Severity })}><option>P1 Critical</option><option>P2 High</option><option>P3 Moderate</option></select>
          <input className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" />
        </div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete request?" message="Remove emergency request?" onConfirm={() => { if (toDelete) deleteRequest(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
