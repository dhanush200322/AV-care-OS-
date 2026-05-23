import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Megaphone, Plus } from 'lucide-react';
import { useReceptionStore, type QueueToken, type QueueType } from '../../../store/receptionStore';
import { ReceptionSmartTable } from '../shared/ReceptionSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, btnGhost, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

interface Props { onToast: (t: 'success' | 'error', m: string) => void; }

export const QueueTokenModule: React.FC<Props> = ({ onToast }) => {
  const { tokens, addToken, updateToken, cancelToken, callNextToken } = useReceptionStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<QueueToken | null>(null);
  const [toCancel, setToCancel] = useState<QueueToken | null>(null);
  const [form, setForm] = useState({ patientName: '', phone: '', queueType: 'General' as QueueType, department: 'OPD', status: 'Waiting' as QueueToken['status'] });
  const [lastCalled, setLastCalled] = useState<QueueToken | null>(null);

  const handleCallNext = () => {
    const next = callNextToken();
    if (next) { setLastCalled(next); onToast('success', `Calling token #${next.tokenNumber}`); }
    else onToast('error', 'No waiting tokens');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateToken({ ...editing, ...form }); onToast('success', 'Token updated'); }
    else { addToken(form); onToast('success', 'Token generated'); }
    setSlideOpen(false);
  };

  return (
    <>
      <div className={cn(glassCard, 'p-6 mb-6 flex flex-col md:flex-row gap-6 items-center')}>
        <div className="flex-1">
          <p className="text-[10px] uppercase text-[#89A9B0] tracking-widest mb-2">Live Queue Board</p>
          {lastCalled ? (
            <motion.p key={lastCalled.id} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-4xl font-mono font-bold text-[#00FFD5]">Now Serving #{lastCalled.tokenNumber}</motion.p>
          ) : (
            <p className="text-2xl text-white/40 font-light">Press Call Next</p>
          )}
          <p className="text-sm text-[#89A9B0] mt-2">{tokens.filter((t) => t.status === 'Waiting').length} waiting · AI est. avg {Math.round(tokens.reduce((s, t) => s + t.estimatedWait, 0) / (tokens.length || 1))} min</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleCallNext} className={btnPrimary}><Megaphone size={16} />Call Next</button>
          <button type="button" onClick={() => { setEditing(null); setForm({ patientName: '', phone: '', queueType: 'General', department: 'OPD', status: 'Waiting' }); setSlideOpen(true); }} className={btnGhost}><Plus size={16} />Token</button>
        </div>
      </div>

      <ReceptionSmartTable title="Queue" entityName="Tokens" subtitle="General · Priority · Emergency · realtime" data={tokens} aiFilterHint="wait"
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }} onDelete={(r) => setToCancel(r)}
        columns={[
          { key: 'tokenNumber', label: 'Token', render: (r) => <span className="font-mono font-bold text-[#00FFD5]">#{r.tokenNumber}</span> },
          { key: 'patientName', label: 'Patient' },
          { key: 'queueType', label: 'Type', render: (r) => <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', r.queueType === 'Emergency' && 'bg-[#FF4444]/20 text-[#FF4444]', r.queueType === 'Priority' && 'bg-[#FFB800]/20 text-[#FFB800]', r.queueType === 'General' && 'bg-[#00C2A8]/20 text-[#00FFD5]')}>{r.queueType}</span> },
          { key: 'waitMinutes', label: 'Wait', render: (r) => <span className="flex items-center gap-2">{r.waitMinutes}m {r.status === 'Waiting' && <span className="w-2 h-2 rounded-full bg-[#00FFD5] animate-pulse" />}</span> },
          { key: 'status', label: 'Status' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Edit Token' : 'Generate Token'} footer={<button type="submit" form="tk-form" className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <form id="tk-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <input className={inputClass} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <select className={inputClass} value={form.queueType} onChange={(e) => setForm({ ...form, queueType: e.target.value as QueueType })}><option>General</option><option>Priority</option><option>Emergency</option></select>
          <input className={inputClass} placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toCancel} title="Cancel Token?" message={`Cancel #${toCancel?.tokenNumber}?`} onConfirm={() => { if (toCancel) cancelToken(toCancel.id); onToast('success', 'Cancelled'); setToCancel(null); }} onCancel={() => setToCancel(null)} />
    </>
  );
};
