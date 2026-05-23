import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useReceptionStore, type WaitingHallEntry, type QueueType } from '../../../store/receptionStore';
import { ReceptionSmartTable } from '../shared/ReceptionSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

interface Props { onToast: (t: 'success' | 'error', m: string) => void; }

export const WaitingHallModule: React.FC<Props> = ({ onToast }) => {
  const { waitingHall, addWaitingEntry, updateWaitingEntry, removeWaitingEntry } = useReceptionStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<WaitingHallEntry | null>(null);
  const [toRemove, setToRemove] = useState<WaitingHallEntry | null>(null);
  const [form, setForm] = useState({ patientName: '', department: 'OPD', seatZone: 'A-West', priority: 'General' as QueueType, occupancy: 0, maxCapacity: 60, status: 'Seated' as WaitingHallEntry['status'] });

  const heatmap = waitingHall.map((w) => ({ name: w.department, occ: Math.round((w.occupancy / w.maxCapacity) * 100) }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateWaitingEntry({ ...editing, ...form }); onToast('success', 'Updated'); }
    else { addWaitingEntry(form); onToast('success', 'Added to hall'); }
    setSlideOpen(false);
  };

  return (
    <>
      <div className={cn(glassCard, 'p-6 mb-6')}>
        <h3 className="text-xs font-bold uppercase text-[#89A9B0] mb-4">Occupancy Heatmap</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={heatmap}>
              <XAxis dataKey="name" stroke="#89A9B0" fontSize={10} /><YAxis stroke="#89A9B0" fontSize={10} unit="%" />
              <Tooltip contentStyle={{ background: '#0D262B', border: '1px solid #00C2A840' }} />
              <Bar dataKey="occ" fill="#00FFD5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ReceptionSmartTable title="Waiting" entityName="Hall Monitor" subtitle="Department occupancy · priority tiers" data={waitingHall}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }} onDelete={(r) => setToRemove(r)}
        columns={[
          { key: 'patientName', label: 'Patient' },
          { key: 'department', label: 'Dept' },
          { key: 'seatZone', label: 'Zone' },
          { key: 'occupancy', label: 'Occupancy', render: (r) => <div className="w-24 h-1.5 rounded-full bg-white/10"><div className="h-full bg-[#00FFD5] rounded-full" style={{ width: `${(r.occupancy / r.maxCapacity) * 100}%` }} /></div> },
          { key: 'status', label: 'Status' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Waiting Hall Entry" footer={<button type="submit" form="wh-form" className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <form id="wh-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
          <input className={inputClass} placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <input className={inputClass} placeholder="Seat zone" value={form.seatZone} onChange={(e) => setForm({ ...form, seatZone: e.target.value })} />
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toRemove} title="Remove Entry?" message="Remove from waiting hall?" onConfirm={() => { if (toRemove) removeWaitingEntry(toRemove.id); onToast('success', 'Removed'); setToRemove(null); }} onCancel={() => setToRemove(null)} />
    </>
  );
};
