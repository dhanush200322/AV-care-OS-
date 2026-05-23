import React, { useState } from 'react';
import { QrCode, Sparkles } from 'lucide-react';
import { useSecurityStore, type VisitorPass, type ClearanceLevel } from '../../../store/securityStore';
import { SecuritySmartTable } from '../shared/SecuritySmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, btnGhost, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const VisitorTrackingModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { visitors, addVisitor, updateVisitor, checkoutVisitor, archiveVisitor, deleteVisitor } = useSecurityStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<VisitorPass | null>(null);
  const [toDelete, setToDelete] = useState<VisitorPass | null>(null);
  const [form, setForm] = useState({ name: '', idProof: '', hostName: '', hostDepartment: '', purpose: '', clearance: 'Standard' as ClearanceLevel, vehiclePlate: '', entryTime: new Date().toISOString() });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateVisitor({ ...editing, ...form }); onToast('success', 'Visitor updated'); }
    else { addVisitor(form); onToast('success', 'Visitor pass issued'); }
    setSlideOpen(false);
  };

  return (
    <>
      <div className={cn(glassCard, 'p-4 mb-6 flex flex-wrap gap-3')}>
        <button type="button" onClick={() => { setEditing(null); setForm({ name: '', idProof: '', hostName: '', hostDepartment: '', purpose: '', clearance: 'Standard', vehiclePlate: '', entryTime: new Date().toISOString() }); setSlideOpen(true); }} className={btnPrimary}><QrCode size={14} />Issue Pass</button>
        <button type="button" className={btnGhost} onClick={() => onToast('info', 'AI scan: no blacklist matches in queue')}><Sparkles size={14} />AI Scan Queue</button>
      </div>
      <SecuritySmartTable title="Visitor" entityName="Tracking" subtitle="QR passes · overstay · blacklist · AI flags" data={visitors} aiFilterHint="suspicious"
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }}
        onArchive={(r) => { archiveVisitor(r.id); onToast('success', 'Archived'); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'name', label: 'Visitor' },
          { key: 'hostName', label: 'Host' },
          { key: 'purpose', label: 'Purpose' },
          { key: 'status', label: 'Status', render: (r) => <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', r.status === 'Overstay' && 'bg-[#FF4444]/20 text-[#FF4444]', r.status === 'Active' && 'bg-[#00C2E0]/20 text-[#00E5FF]')}>{r.status}</span> },
          { key: 'aiFlag', label: 'AI', render: (r) => r.aiFlag ? <span className="text-[#FF4444] animate-pulse">FLAG</span> : '—' },
          { key: 'qrCode', label: 'QR', render: (r) => <span className="text-[10px] text-[#00E5FF]">{r.qrCode.slice(-8)}</span> },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Visitor Pass" width="lg" footer={<button type="submit" form="vis-form" className={cn(btnPrimary, 'w-full justify-center')}>Save Pass</button>}>
        <form id="vis-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Visitor name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className={inputClass} placeholder="ID proof" value={form.idProof} onChange={(e) => setForm({ ...form, idProof: e.target.value })} />
          <input className={inputClass} placeholder="Host name" value={form.hostName} onChange={(e) => setForm({ ...form, hostName: e.target.value })} />
          <input className={inputClass} placeholder="Department" value={form.hostDepartment} onChange={(e) => setForm({ ...form, hostDepartment: e.target.value })} />
          <input className={inputClass} placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
          <select className={inputClass} value={form.clearance} onChange={(e) => setForm({ ...form, clearance: e.target.value as ClearanceLevel })}><option>Standard</option><option>Escorted</option><option>VIP</option></select>
          <input className={inputClass} placeholder="Vehicle plate" value={form.vehiclePlate} onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value })} />
        </form>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete visitor?" message="Remove visitor record?" onConfirm={() => { if (toDelete) deleteVisitor(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
