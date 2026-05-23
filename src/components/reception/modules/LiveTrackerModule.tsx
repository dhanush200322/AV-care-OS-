import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useReceptionStore, type LiveTrackerEntry, type TrackerStatus } from '../../../store/receptionStore';
import { ReceptionSmartTable } from '../shared/ReceptionSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

const STATUS_COLORS: Record<TrackerStatus, string> = {
  'Checked-in': 'bg-[#00C2E0]/20 text-[#00C2E0]',
  'In Consultation': 'bg-[#00FFD5]/20 text-[#00FFD5]',
  Completed: 'bg-[#00D68F]/20 text-[#00D68F]',
  Delayed: 'bg-[#FFB800]/20 text-[#FFB800]',
};

interface Props { onToast: (t: 'success' | 'error', m: string) => void; }

export const LiveTrackerModule: React.FC<Props> = ({ onToast }) => {
  const { liveTracker, addTrackerEntry, updateTrackerEntry, removeTrackerEntry } = useReceptionStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<LiveTrackerEntry | null>(null);
  const [toRemove, setToRemove] = useState<LiveTrackerEntry | null>(null);
  const [form, setForm] = useState({ patientName: '', doctorName: '', specialty: '', status: 'Checked-in' as TrackerStatus, checkInTime: new Date().toISOString() });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateTrackerEntry({ ...editing, ...form }); onToast('success', 'Updated'); }
    else { addTrackerEntry(form); onToast('success', 'Checked in'); }
    setSlideOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(['Checked-in', 'In Consultation', 'Completed', 'Delayed'] as TrackerStatus[]).map((s) => (
          <motion.div key={s} layout className={cn(glassCard, 'p-4 text-center')}>
            <p className={cn('text-[10px] font-bold uppercase px-2 py-1 rounded inline-block mb-2', STATUS_COLORS[s])}>{s}</p>
            <p className="text-3xl font-light text-white">{liveTracker.filter((t) => t.status === s).length}</p>
          </motion.div>
        ))}
      </div>

      <ReceptionSmartTable title="Live" entityName="Appointment Tracker" subtitle="Realtime consultation board" data={liveTracker}
        onAdd={() => { setEditing(null); setSlideOpen(true); }} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }} onDelete={(r) => setToRemove(r)}
        columns={[
          { key: 'patientName', label: 'Patient' },
          { key: 'doctorName', label: 'Doctor' },
          { key: 'status', label: 'Status', render: (r) => <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', STATUS_COLORS[r.status])}>{r.status}</span> },
          { key: 'consultationTimer', label: 'Timer', render: (r) => r.status === 'In Consultation' ? `${r.consultationTimer} min` : '—' },
          { key: 'delayMinutes', label: 'Delay', render: (r) => r.delayMinutes > 0 ? `${r.delayMinutes}m` : '—' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Tracker Entry" footer={<button type="submit" form="lt-form" className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <form id="lt-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <input className={inputClass} placeholder="Doctor" value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} />
          <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TrackerStatus })}>
            <option>Checked-in</option><option>In Consultation</option><option>Completed</option><option>Delayed</option>
          </select>
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toRemove} title="Remove Entry?" message="Remove from live tracker?" onConfirm={() => { if (toRemove) removeTrackerEntry(toRemove.id); onToast('success', 'Removed'); setToRemove(null); }} onCancel={() => setToRemove(null)} />
    </>
  );
};
