import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Radio } from 'lucide-react';
import { useSecurityStore, type EmergencyResponse } from '../../../store/securityStore';
import { SecuritySmartTable } from '../shared/SecuritySmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnDanger, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const EmergencyResponseModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { emergencyResponses, addEmergencyResponse, updateEmergencyResponse, closeEmergencyResponse, deleteEmergencyResponse } = useSecurityStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<EmergencyResponse | null>(null);
  const [toDelete, setToDelete] = useState<EmergencyResponse | null>(null);
  const [form, setForm] = useState({ code: '', title: '', teams: 'Alpha Squad,Medical', status: 'Active' as EmergencyResponse['status'], commander: 'Officer Vikram S.', notes: '' });

  const active = emergencyResponses.filter((e) => e.status === 'Active' || e.status === 'Deploying');

  return (
    <>
      {active.map((e) => (
        <motion.div key={e.id} className={cn(glassCard, 'p-6 mb-4 border-[#FF4444]/40')}>
          <div className="flex items-center gap-4"><Radio className="text-[#FF4444] animate-pulse" /><div><p className="font-mono font-bold text-[#FF4444]">{e.code}</p><p className="text-white font-bold">{e.title}</p><p className="text-xs text-[#7F95B2] mt-2">Teams: {e.teams.join(', ')} · CMD: {e.commander}</p></div></div>
        </motion.div>
      ))}
      <SecuritySmartTable title="Emergency" entityName="Response" subtitle="Multi-team coordination · mission control" data={emergencyResponses}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm({ ...r, teams: r.teams.join(',') }); setSlideOpen(true); }}
        onArchive={(r) => { closeEmergencyResponse(r.id); onToast('success', 'Closed'); }} onDelete={(r) => setToDelete(r)}
        columns={[{ key: 'code', label: 'Code' }, { key: 'title', label: 'Title' }, { key: 'status', label: 'Status' }, { key: 'commander', label: 'Commander' }]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Emergency Event" footer={<button type="button" onClick={() => { const payload = { ...form, teams: form.teams.split(',').map((s) => s.trim()) }; if (editing) updateEmergencyResponse({ ...editing, ...payload, timeline: editing.timeline }); else addEmergencyResponse(payload); onToast('success', 'Response initiated'); setSlideOpen(false); }} className={cn(btnDanger, 'w-full justify-center')}>Activate</button>}>
        <div className="space-y-4">
          <input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Code e.g. CODE-RED-12" />
          <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
          <textarea className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" />
        </div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete event?" message="Remove emergency record?" onConfirm={() => { if (toDelete) deleteEmergencyResponse(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
