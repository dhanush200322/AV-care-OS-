import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useReceptionStore, type NotificationTemplate, type NotifyChannel } from '../../../store/receptionStore';
import { ReceptionSmartTable } from '../shared/ReceptionSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass } from '../theme';
import { cn } from '../../../lib/utils';

interface Props { onToast: (t: 'success' | 'error', m: string) => void; }

export const NotificationCenterModule: React.FC<Props> = ({ onToast }) => {
  const { notificationTemplates, sentNotifications, addTemplate, updateTemplate, archiveTemplate, deleteTemplate, sendNotification, deleteSentNotification } = useReceptionStore();
  const [tab, setTab] = useState<'templates' | 'sent'>('templates');
  const [slideOpen, setSlideOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [editing, setEditing] = useState<NotificationTemplate | null>(null);
  const [toDelete, setToDelete] = useState<{ type: 'tpl' | 'sent'; id: string } | null>(null);
  const [form, setForm] = useState({ name: '', channel: 'WhatsApp' as NotifyChannel, content: '', status: 'Active' as NotificationTemplate['status'] });
  const [sendForm, setSendForm] = useState({ recipient: '', message: '', channel: 'WhatsApp' as NotifyChannel, templateName: '' });

  const handleSaveTpl = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateTemplate({ ...editing, ...form }); onToast('success', 'Template updated'); }
    else { addTemplate(form); onToast('success', 'Template created'); }
    setSlideOpen(false);
  };

  const aiGenerate = () => {
    setSendForm((f) => ({ ...f, message: `Hi ${f.recipient || 'Patient'}, your appointment at AV Care is confirmed. Reply HELP for assistance.` }));
    onToast('success', 'AI message generated');
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setTab('templates')} className={cn('px-4 py-2 rounded-xl text-xs font-bold uppercase border', tab === 'templates' ? 'border-[#00FFD5]/40 bg-[#00C2A8]/15 text-[#00FFD5]' : 'border-white/10 text-[#89A9B0]')}>Templates</button>
        <button type="button" onClick={() => setTab('sent')} className={cn('px-4 py-2 rounded-xl text-xs font-bold uppercase border', tab === 'sent' ? 'border-[#00FFD5]/40 bg-[#00C2A8]/15 text-[#00FFD5]' : 'border-white/10 text-[#89A9B0]')}>Sent</button>
        <button type="button" onClick={() => setSendOpen(true)} className={cn(btnPrimary, 'ml-auto')}>Send Notification</button>
      </div>

      {tab === 'templates' ? (
        <ReceptionSmartTable title="Notification" entityName="Templates" subtitle="SMS · WhatsApp · Email · broadcasts" data={notificationTemplates}
          onAdd={() => { setEditing(null); setForm({ name: '', channel: 'WhatsApp', content: '', status: 'Active' }); setSlideOpen(true); }}
          onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }}
          onArchive={(r) => { archiveTemplate(r.id); onToast('success', 'Archived'); }}
          onDelete={(r) => setToDelete({ type: 'tpl', id: r.id })}
          columns={[{ key: 'name', label: 'Name' }, { key: 'channel', label: 'Channel' }, { key: 'status', label: 'Status' }]}
        />
      ) : (
        <ReceptionSmartTable title="Sent" entityName="Notifications" subtitle="Delivery history" data={sentNotifications}
          onDelete={(r) => setToDelete({ type: 'sent', id: r.id })}
          columns={[{ key: 'recipient', label: 'To' }, { key: 'channel', label: 'Channel' }, { key: 'message', label: 'Message' }, { key: 'status', label: 'Status' }]}
        />
      )}

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Template" footer={<button type="submit" form="tpl-form" className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <form id="tpl-form" onSubmit={handleSaveTpl} className="space-y-4">
          <input className={inputClass} placeholder="Template name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className={inputClass} value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as NotifyChannel })}><option>SMS</option><option>WhatsApp</option><option>Email</option></select>
          <textarea className={cn(inputClass, 'min-h-[120px]')} placeholder="Content with {{name}} placeholders" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </form>
      </SlideOver>

      <SlideOver open={sendOpen} onClose={() => setSendOpen(false)} title="Send Notification" footer={
        <div className="flex gap-2">
          <button type="button" onClick={aiGenerate} className="flex-1 py-3 rounded-xl border border-[#00C2E0]/30 text-[#00C2E0] text-xs font-bold uppercase flex items-center justify-center gap-2"><Sparkles size={14} />AI Generate</button>
          <button type="button" onClick={() => { sendNotification(sendForm); onToast('success', 'Sent'); setSendOpen(false); }} className={cn(btnPrimary, 'flex-1 justify-center')}>Send</button>
        </div>
      }>
        <div className="space-y-4">
          <input className={inputClass} placeholder="Recipient" value={sendForm.recipient} onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })} />
          <select className={inputClass} value={sendForm.channel} onChange={(e) => setSendForm({ ...sendForm, channel: e.target.value as NotifyChannel })}><option>WhatsApp</option><option>SMS</option><option>Email</option></select>
          <textarea className={inputClass} placeholder="Message" value={sendForm.message} onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })} />
        </div>
      </SlideOver>

      <ConfirmDialog open={!!toDelete} title="Delete?" message="Remove this item?" onConfirm={() => {
        if (toDelete?.type === 'tpl') deleteTemplate(toDelete.id);
        if (toDelete?.type === 'sent') deleteSentNotification(toDelete.id);
        onToast('success', 'Deleted'); setToDelete(null);
      }} onCancel={() => setToDelete(null)} />
    </>
  );
};
