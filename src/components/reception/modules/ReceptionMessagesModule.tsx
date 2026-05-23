import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { ReceptionSmartTable } from '../shared/ReceptionSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { btnPrimary, inputClass } from '../theme';
import { cn } from '../../../lib/utils';

interface Props { onToast: (t: 'success' | 'error', m: string) => void; }

export const ReceptionMessagesModule: React.FC<Props> = ({ onToast }) => {
  const { messages, addMessage } = useStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [content, setContent] = useState('');

  return (
    <>
      <ReceptionSmartTable title="Communication" entityName="Messages" subtitle="Staff coordination" data={messages}
        onAdd={() => setSlideOpen(true)}
        columns={[{ key: 'sender', label: 'From' }, { key: 'role', label: 'Role' }, { key: 'content', label: 'Message' }, { key: 'timestamp', label: 'Time' }]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="New Message" footer={
        <button type="button" onClick={() => { addMessage({ sender: 'Ananya Reddy', role: 'Reception', content, read: false }); onToast('success', 'Sent'); setSlideOpen(false); setContent(''); }} className={cn(btnPrimary, 'w-full justify-center')}>Send</button>
      }>
        <textarea className={cn(inputClass, 'min-h-[140px]')} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Message…" />
      </SlideOver>
    </>
  );
};
