import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAmbulanceStore, type AmbulanceAlert, type AlertSeverity } from '../../../store/ambulanceStore';
import { AmbulanceSmartTable } from '../shared/AmbulanceSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, btnDanger, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const AmbulanceAlertsModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { alerts, addAlert, updateAlert, acknowledgeAlert, archiveAlert, deleteAlert } = useAmbulanceStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<AmbulanceAlert | null>(null);
  const [toDelete, setToDelete] = useState<AmbulanceAlert | null>(null);
  const [form, setForm] = useState({ title: '', source: '', severity: 'Warning' as AlertSeverity, message: '', status: 'Active' as AmbulanceAlert['status'] });

  const critical = alerts.filter((a) => a.severity === 'Critical' && !a.acknowledged);

  return (
    <>
      {critical.map((a) => (
        <motion.div key={a.id} animate={{ opacity: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className={cn(glassCard, 'p-4 mb-3 border-[#FF4444]/50 flex justify-between')}>
          <div><p className="font-bold text-[#FF4444] font-mono text-sm">{a.title}</p><p className="text-xs text-[#B8A28F]">{a.message}</p></div>
          <button type="button" onClick={() => { acknowledgeAlert(a.id); onToast('success', 'ACK'); }} className={btnDanger}>ACK</button>
        </motion.div>
      ))}
      <AmbulanceSmartTable title="Emergency" entityName="Alerts" subtitle="Fleet · dispatch · AI anomalies" data={alerts}
        onAdd={() => { setEditing(null); setForm({ title: '', source: '', severity: 'Warning', message: '', status: 'Active' }); setSlideOpen(true); }}
        onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }}
        onArchive={(r) => { archiveAlert(r.id); onToast('success', 'Archived'); }} onDelete={(r) => setToDelete(r)}
        columns={[{ key: 'title', label: 'Alert' }, { key: 'severity', label: 'Severity' }, { key: 'source', label: 'Source' }, { key: 'status', label: 'Status' }]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Alert" footer={<button type="button" onClick={() => { if (editing) updateAlert({ ...editing, ...form }); else addAlert(form); onToast('success', 'Saved'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><select className={inputClass} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as AlertSeverity })}><option>Info</option><option>Warning</option><option>Critical</option></select><textarea className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete alert?" message="Remove alert?" onConfirm={() => { if (toDelete) deleteAlert(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
