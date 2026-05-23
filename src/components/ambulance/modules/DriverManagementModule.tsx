import React, { useState } from 'react';
import { useAmbulanceStore, type AmbulanceDriver } from '../../../store/ambulanceStore';
import { AmbulanceSmartTable } from '../shared/AmbulanceSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const DriverManagementModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { drivers, addDriver, updateDriver, archiveDriver, deleteDriver } = useAmbulanceStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<AmbulanceDriver | null>(null);
  const [toDelete, setToDelete] = useState<AmbulanceDriver | null>(null);
  const [form, setForm] = useState({ name: '', license: '', phone: '', shift: 'Alpha Day', status: 'On Duty' as AmbulanceDriver['status'], fatigueScore: 20, certifications: 'BLS', performanceScore: 90 });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">{drivers.map((d) => (
        <div key={d.id} className={cn(glassCard, 'p-4', d.fatigueScore > 40 && 'border-[#FFB800]/40')}>
          <p className="font-bold text-white">{d.name}</p>
          <p className="text-[10px] text-[#B8A28F] font-mono">{d.shift} · {d.status}</p>
          <div className="mt-3 h-1.5 rounded-full bg-white/10"><div className={cn('h-full rounded-full', d.fatigueScore > 40 ? 'bg-[#FFB800]' : 'bg-[#00D68F]')} style={{ width: `${100 - d.fatigueScore}%` }} /></div>
          <p className="text-[10px] text-[#B8A28F] mt-2">Fatigue {d.fatigueScore}% · Perf {d.performanceScore}</p>
        </div>
      ))}</div>
      <AmbulanceSmartTable title="Driver" entityName="Management" subtitle="Shifts · fatigue · certifications" data={drivers}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm({ ...r, certifications: r.certifications.join(',') }); setSlideOpen(true); }}
        onArchive={(r) => { archiveDriver(r.id); onToast('success', 'Archived'); }} onDelete={(r) => setToDelete(r)}
        columns={[{ key: 'name', label: 'Driver' }, { key: 'status', label: 'Status' }, { key: 'fatigueScore', label: 'Fatigue', render: (r) => `${r.fatigueScore}%` }, { key: 'performanceScore', label: 'Score' }]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Driver" footer={<button type="button" onClick={() => { const certs = form.certifications.split(',').map((s) => s.trim()); if (editing) updateDriver({ ...editing, ...form, certifications: certs }); else addDriver({ ...form, certifications: certs }); onToast('success', 'Saved'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" /><input className={inputClass} value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} placeholder="License" /></div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete driver?" message="Remove driver?" onConfirm={() => { if (toDelete) deleteDriver(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
