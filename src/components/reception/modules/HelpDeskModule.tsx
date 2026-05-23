import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useReceptionStore, type HelpDeskTicket } from '../../../store/receptionStore';
import { ReceptionSmartTable } from '../shared/ReceptionSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

interface Props { onToast: (t: 'success' | 'error', m: string) => void; }

export const HelpDeskModule: React.FC<Props> = ({ onToast }) => {
  const { helpDeskTickets, addTicket, updateTicket, archiveTicket, deleteTicket } = useReceptionStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<HelpDeskTicket | null>(null);
  const [toDelete, setToDelete] = useState<HelpDeskTicket | null>(null);
  const [form, setForm] = useState({ subject: '', description: '', department: 'Facilities', priority: 'Medium' as HelpDeskTicket['priority'], status: 'Open' as HelpDeskTicket['status'], assignee: 'Unassigned', category: 'General' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateTicket({ ...editing, ...form }); onToast('success', 'Ticket updated'); }
    else { addTicket(form); onToast('success', 'Ticket created'); }
    setSlideOpen(false);
  };

  const openTickets = helpDeskTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');

  return (
    <>
      {openTickets.slice(0, 2).map((t) => (
        <motion.div key={t.id} layout className={cn(glassCard, 'p-4 mb-4 border-l-4', t.priority === 'Critical' ? 'border-l-[#FF4444]' : 'border-l-[#FFB800]')}>
          <div className="flex justify-between"><p className="font-bold text-white">{t.subject}</p><span className="text-xs font-mono text-[#FF4444]">SLA {t.slaMinutes}m</span></div>
          <p className="text-xs text-[#89A9B0] mt-1">{t.description}</p>
        </motion.div>
      ))}

      <ReceptionSmartTable title="Help" entityName="Desk Tickets" subtitle="Complaints · facilities · SLA · escalation" data={helpDeskTickets}
        onAdd={() => { setEditing(null); setSlideOpen(true); }} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }}
        onArchive={(r) => { archiveTicket(r.id); onToast('success', 'Closed'); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'subject', label: 'Subject' },
          { key: 'department', label: 'Dept' },
          { key: 'priority', label: 'Priority' },
          { key: 'slaMinutes', label: 'SLA', render: (r) => `${r.slaMinutes}m` },
          { key: 'status', label: 'Status' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Support Ticket" footer={<button type="submit" form="hd-form" className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <form id="hd-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <textarea className={inputClass} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className={inputClass} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as HelpDeskTicket['priority'] })}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
          <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as HelpDeskTicket['status'] })}><option>Open</option><option>In Progress</option><option>Escalated</option><option>Resolved</option></select>
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toDelete} title="Delete Ticket?" message="Permanently delete?" onConfirm={() => { if (toDelete) deleteTicket(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
