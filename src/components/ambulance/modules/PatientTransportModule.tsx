import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAmbulanceStore, type PatientTransport, type TransportStatus } from '../../../store/ambulanceStore';
import { AmbulanceSmartTable } from '../shared/AmbulanceSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const PatientTransportModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { transports, addTransport, updateTransport, archiveTransport, deleteTransport } = useAmbulanceStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<PatientTransport | null>(null);
  const [toDelete, setToDelete] = useState<PatientTransport | null>(null);
  const [form, setForm] = useState({ patientName: '', condition: '', unitId: 'u-1', pickupLocation: '', hospital: '', status: 'En Route' as TransportStatus, etaMinutes: 6, familyNotified: false });

  return (
    <>
      {transports.map((t) => (
        <div key={t.id} className={cn(glassCard, 'p-4 mb-4')}>
          <div className="flex justify-between mb-3"><p className="font-bold text-white">{t.patientName}</p><span className="text-[#FFA63D] text-xs font-mono">{t.status}</span></div>
          <div className="flex gap-2">{t.timeline.map((ev, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex-1 h-1 rounded-full bg-[#FF7A00]/60" />
          ))}</div>
        </div>
      ))}
      <AmbulanceSmartTable title="Patient" entityName="Transport" subtitle="Pickup · ER handoff · family SMS" data={transports}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }}
        onArchive={(r) => { archiveTransport(r.id); onToast('success', 'Archived'); }} onDelete={(r) => setToDelete(r)}
        columns={[{ key: 'patientName', label: 'Patient' }, { key: 'hospital', label: 'Hospital' }, { key: 'etaMinutes', label: 'ETA', render: (r) => `${r.etaMinutes}m` }, { key: 'familyNotified', label: 'Family', render: (r) => r.familyNotified ? '✓' : '—' }]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Transport" footer={<button type="button" onClick={() => { if (editing) updateTransport({ ...editing, ...form, timeline: editing.timeline }); else addTransport(form); onToast('success', 'Saved'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4"><input className={inputClass} value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} placeholder="Patient" /><input className={inputClass} value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} placeholder="Hospital" /><label className="flex items-center gap-2 text-sm text-[#B8A28F]"><input type="checkbox" checked={form.familyNotified} onChange={(e) => setForm({ ...form, familyNotified: e.target.checked })} /> Family notified</label></div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete transport?" message="Remove record?" onConfirm={() => { if (toDelete) deleteTransport(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
