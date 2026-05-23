import React, { useState } from 'react';
import { useAmbulanceStore, type CoordinationEvent } from '../../../store/ambulanceStore';
import { AmbulanceSmartTable } from '../shared/AmbulanceSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, btnDanger, inputClass } from '../theme';
import { cn } from '../../../lib/utils';

export const CoordinationCenterModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { coordination, addCoordination, updateCoordination, closeCoordination, deleteCoordination } = useAmbulanceStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<CoordinationEvent | null>(null);
  const [toDelete, setToDelete] = useState<CoordinationEvent | null>(null);
  const [form, setForm] = useState({ title: '', teams: 'Ambulance,ER,Security', commander: 'Priya N.', status: 'Active' as CoordinationEvent['status'], notes: '' });

  return (
    <>
      <AmbulanceSmartTable title="Emergency" entityName="Coordination" subtitle="Multi-team · hospital · security" data={coordination}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm({ ...r, teams: r.teams.join(',') }); setSlideOpen(true); }}
        onArchive={(r) => { closeCoordination(r.id); onToast('success', 'Closed'); }} onDelete={(r) => setToDelete(r)}
        columns={[{ key: 'title', label: 'Event' }, { key: 'teams', label: 'Teams', render: (r) => r.teams.join(', ') }, { key: 'commander', label: 'CMD' }, { key: 'status', label: 'Status' }]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Coordination Event" footer={<button type="button" onClick={() => { const teams = form.teams.split(',').map((s) => s.trim()); if (editing) updateCoordination({ ...editing, ...form, teams }); else addCoordination({ ...form, teams }); onToast('success', 'Opened'); setSlideOpen(false); }} className={cn(btnDanger, 'w-full justify-center')}>Activate</button>}>
        <div className="space-y-4"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" /><textarea className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" /></div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete event?" message="Remove coordination?" onConfirm={() => { if (toDelete) deleteCoordination(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
