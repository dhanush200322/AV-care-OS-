import React, { useState } from 'react';
import { useSecurityStore, type RestrictedZone } from '../../../store/securityStore';
import { SecuritySmartTable } from '../shared/SecuritySmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const RestrictedZonesModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { restrictedZones, addRestrictedZone, updateRestrictedZone, deleteRestrictedZone } = useSecurityStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<RestrictedZone | null>(null);
  const [toDelete, setToDelete] = useState<RestrictedZone | null>(null);
  const [form, setForm] = useState({ name: '', floor: '', maxOccupancy: 10, currentOccupancy: 0, authorizedRoles: 'Doctor,Nurse', unauthorizedAttempts: 0, status: 'Secure' as RestrictedZone['status'], lastAccess: new Date().toISOString() });

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {restrictedZones.map((z) => (
          <div key={z.id} className={cn(glassCard, 'p-4', z.status === 'Breach' && 'border-[#FF4444]/50 animate-pulse')}>
            <p className="text-sm font-bold text-white font-mono">{z.name}</p>
            <p className="text-[10px] text-[#7F95B2]">{z.floor}</p>
            <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-[#00E5FF]" style={{ width: `${(z.currentOccupancy / z.maxOccupancy) * 100}%` }} /></div>
            <p className="text-[10px] text-[#7F95B2] mt-2">{z.currentOccupancy}/{z.maxOccupancy} · {z.unauthorizedAttempts} breaches</p>
          </div>
        ))}
      </div>
      <SecuritySmartTable title="Restricted" entityName="Zones" subtitle="ICU · NICU · OT · pharmacy vault" data={restrictedZones}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm({ ...r, authorizedRoles: r.authorizedRoles.join(',') }); setSlideOpen(true); }}
        onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'name', label: 'Zone' },
          { key: 'status', label: 'Status', render: (r) => <span className={cn(r.status === 'Breach' ? 'text-[#FF4444]' : 'text-[#00D68F]')}>{r.status}</span> },
          { key: 'unauthorizedAttempts', label: 'Attempts' },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Restricted Zone" footer={<button type="button" onClick={() => { const payload = { ...form, authorizedRoles: form.authorizedRoles.split(',').map((s) => s.trim()) }; if (editing) updateRestrictedZone({ ...editing, ...payload }); else addRestrictedZone(payload); onToast('success', 'Saved'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Zone name" />
          <input className={inputClass} value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder="Floor" />
        </div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete zone?" message="Remove zone config?" onConfirm={() => { if (toDelete) deleteRestrictedZone(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
