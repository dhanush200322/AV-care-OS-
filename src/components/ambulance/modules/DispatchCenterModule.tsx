import React, { useState } from 'react';
import { useAmbulanceStore, type DispatchAssignment } from '../../../store/ambulanceStore';
import { AmbulanceSmartTable } from '../shared/AmbulanceSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass } from '../theme';
import { cn } from '../../../lib/utils';

export const DispatchCenterModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { dispatches, addDispatch, updateDispatch, archiveDispatch, deleteDispatch } = useAmbulanceStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<DispatchAssignment | null>(null);
  const [toDelete, setToDelete] = useState<DispatchAssignment | null>(null);
  const [form, setForm] = useState({ requestId: '', unitId: 'u-2', driverId: 'drv-2', patientSummary: '', status: 'Active' as DispatchAssignment['status'], routeKm: 5, etaMinutes: 10 });

  return (
    <>
      <AmbulanceSmartTable title="Dispatch" entityName="Center" subtitle="Assignments · timeline · AI routes" data={dispatches}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }}
        onArchive={(r) => { archiveDispatch(r.id); onToast('success', 'Archived'); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'patientSummary', label: 'Patient/Case' },
          { key: 'unitId', label: 'Unit' },
          { key: 'etaMinutes', label: 'ETA', render: (r) => `${r.etaMinutes} min` },
          { key: 'routeKm', label: 'Route', render: (r) => `${r.routeKm} km` },
          { key: 'status', label: 'Status' },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Dispatch Assignment" footer={<button type="button" onClick={() => { if (editing) updateDispatch({ ...editing, ...form, timeline: editing.timeline }); else addDispatch(form); onToast('success', 'Dispatched'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Assign</button>}>
        <div className="space-y-4"><input className={inputClass} value={form.patientSummary} onChange={(e) => setForm({ ...form, patientSummary: e.target.value })} placeholder="Case summary" /><input type="number" className={inputClass} value={form.etaMinutes} onChange={(e) => setForm({ ...form, etaMinutes: +e.target.value })} placeholder="ETA min" /></div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete dispatch?" message="Remove dispatch record?" onConfirm={() => { if (toDelete) deleteDispatch(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
