import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { DoctorSmartTable } from '../shared/DoctorSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { btnPrimary, inputClass } from '../theme';
import { cn } from '../../../lib/utils';

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export const DoctorMessagesModule: React.FC<Props> = ({ onToast }) => {
  const { messages, addMessage } = useStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [form, setForm] = useState({ sender: 'Dr. Satish K.', role: 'Doctor', content: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage({ sender: form.sender, role: form.role, content: form.content, read: false });
    onToast('success', 'Message sent');
    setSlideOpen(false);
    setForm({ ...form, content: '' });
  };

  return (
    <>
      <DoctorSmartTable
        title="Clinical"
        entityName="Messages"
        subtitle="Secure staff & patient communications"
        data={messages.map((m) => ({ ...m, id: m.id }))}
        onAdd={() => setSlideOpen(true)}
        columns={[
          { key: 'sender', label: 'From' },
          { key: 'role', label: 'Role' },
          { key: 'content', label: 'Message' },
          { key: 'timestamp', label: 'Time' },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="New Message" footer={<button type="submit" form="msg-form" className={cn(btnPrimary, 'w-full justify-center')}>Send</button>}>
        <form id="msg-form" onSubmit={handleSave} className="space-y-4">
          <textarea className={cn(inputClass, 'min-h-[120px]')} placeholder="Message" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        </form>
      </SlideOver>
    </>
  );
};
