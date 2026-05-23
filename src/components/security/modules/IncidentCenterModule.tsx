import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Siren } from 'lucide-react';
import { useSecurityStore, type SecurityIncident, type IncidentType, type AlertSeverity } from '../../../store/securityStore';
import { SecuritySmartTable } from '../shared/SecuritySmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnDanger, btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const IncidentCenterModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { incidents, addIncident, updateIncident, archiveIncident, deleteIncident } = useSecurityStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<SecurityIncident | null>(null);
  const [toDelete, setToDelete] = useState<SecurityIncident | null>(null);
  const [form, setForm] = useState({ title: '', type: 'Intrusion' as IncidentType, severity: 'Critical' as AlertSeverity, location: '', description: '', assignedTeam: 'Alpha Squad', status: 'Active' as SecurityIncident['status'] });

  const active = incidents.filter((i) => i.status === 'Active' || i.status === 'Investigating');

  return (
    <>
      {active.map((inc) => (
        <motion.div key={inc.id} animate={{ boxShadow: ['0 0 0 0 rgba(255,59,48,0.5)', '0 0 0 8px rgba(255,59,48,0)', '0 0 0 0 rgba(255,59,48,0)'] }} transition={{ repeat: Infinity, duration: 2 }} className={cn(glassCard, 'p-6 mb-4 border-[#FF4444]/50')}>
          <div className="flex justify-between items-start">
            <div className="flex gap-4"><Siren className="text-[#FF4444] animate-pulse" size={28} /><div><p className="font-bold text-white font-mono">{inc.title}</p><p className="text-xs text-[#FF4444] uppercase mt-1">{inc.type} · {inc.location}</p><p className="text-sm text-[#7F95B2] mt-2">{inc.description}</p></div></div>
            <div className="text-right"><p className="text-[10px] text-[#7F95B2] font-mono">AI Score</p><p className="text-3xl font-bold text-[#FF4444]">{inc.aiSeverityScore}</p><p className="text-xs text-[#7F95B2] mt-2">{inc.assignedTeam}</p></div>
          </div>
        </motion.div>
      ))}
      <SecuritySmartTable title="Incident" entityName="Command" subtitle="Fire · intrusion · medical · panic" data={incidents}
        onAdd={() => { setEditing(null); setSlideOpen(true); }} onEdit={(r) => { setEditing(r); setForm({ title: r.title, type: r.type, severity: r.severity, location: r.location, description: r.description, assignedTeam: r.assignedTeam, status: r.status }); setSlideOpen(true); }}
        onArchive={(r) => { archiveIncident(r.id); onToast('success', 'Archived'); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'title', label: 'Incident' },
          { key: 'type', label: 'Type' },
          { key: 'severity', label: 'Severity' },
          { key: 'aiSeverityScore', label: 'AI', render: (r) => <span className="text-[#FF4444]">{r.aiSeverityScore}%</span> },
          { key: 'status', label: 'Status' },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Incident Report" footer={<button type="button" onClick={() => { if (editing) updateIncident({ ...editing, ...form, timeline: editing.timeline }); else addIncident(form); onToast('success', 'Incident logged'); setSlideOpen(false); }} className={cn(btnDanger, 'w-full justify-center')}>Dispatch</button>}>
        <div className="space-y-4">
          <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
          <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as IncidentType })}><option>Fire</option><option>Intrusion</option><option>Medical</option><option>Panic</option><option>Other</option></select>
          <textarea className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
        </div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete incident?" message="Remove incident record?" onConfirm={() => { if (toDelete) deleteIncident(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
