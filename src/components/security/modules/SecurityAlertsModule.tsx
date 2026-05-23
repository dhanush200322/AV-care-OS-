import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSecurityStore, type SecurityAlert, type AlertSeverity } from '../../../store/securityStore';
import { SecuritySmartTable } from '../shared/SecuritySmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, btnDanger, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const SecurityAlertsModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { alerts, addAlert, updateAlert, acknowledgeAlert, archiveAlert, deleteAlert } = useSecurityStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<SecurityAlert | null>(null);
  const [toDelete, setToDelete] = useState<SecurityAlert | null>(null);
  const [form, setForm] = useState({ title: '', source: '', severity: 'Warning' as AlertSeverity, message: '', status: 'Active' as SecurityAlert['status'] });

  const critical = alerts.filter((a) => a.severity === 'Critical' && !a.acknowledged);

  return (
    <>
      <div className="space-y-3 mb-6">
        {critical.map((a) => (
          <motion.div key={a.id} animate={{ opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className={cn(glassCard, 'p-4 border-[#FF4444]/60 flex justify-between items-center')}>
            <div><p className="font-bold text-[#FF4444] font-mono text-sm">{a.title}</p><p className="text-xs text-[#7F95B2] mt-1">{a.message}</p></div>
            <button type="button" onClick={() => { acknowledgeAlert(a.id); onToast('success', 'Acknowledged'); }} className={btnDanger}>ACK</button>
          </motion.div>
        ))}
      </div>
      <SecuritySmartTable title="Security" entityName="Alerts" subtitle="AI anomalies · escalation · acknowledgement" data={alerts}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }}
        onArchive={(r) => { archiveAlert(r.id); onToast('success', 'Archived'); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'title', label: 'Alert' },
          { key: 'source', label: 'Source' },
          { key: 'severity', label: 'Severity', render: (r) => <span className={cn(r.severity === 'Critical' && 'text-[#FF4444] animate-pulse', r.severity === 'Warning' && 'text-[#FFB800]')}>{r.severity}</span> },
          { key: 'acknowledged', label: 'ACK', render: (r) => r.acknowledged ? '✓' : '—' },
          { key: 'status', label: 'Status' },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Security Alert" footer={<button type="button" onClick={() => { if (editing) updateAlert({ ...editing, ...form, acknowledged: editing.acknowledged, escalated: editing.escalated }); else addAlert(form); onToast('success', 'Alert created'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4">
          <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
          <select className={inputClass} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as AlertSeverity })}><option>Info</option><option>Warning</option><option>Critical</option></select>
          <textarea className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" />
        </div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete alert?" message="Remove alert?" onConfirm={() => { if (toDelete) deleteAlert(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
