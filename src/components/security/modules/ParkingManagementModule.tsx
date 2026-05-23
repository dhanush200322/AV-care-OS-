import React, { useState } from 'react';
import { useSecurityStore, type ParkingRecord } from '../../../store/securityStore';
import { SecuritySmartTable } from '../shared/SecuritySmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const ParkingManagementModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { parkingRecords, addParkingRecord, updateParkingRecord, deleteParkingRecord } = useSecurityStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<ParkingRecord | null>(null);
  const [toDelete, setToDelete] = useState<ParkingRecord | null>(null);
  const [form, setForm] = useState({ plateNumber: '', ownerName: '', vehicleType: 'Sedan', slot: '', bay: 'General' as ParkingRecord['bay'], entryTime: new Date().toISOString(), fee: 0, status: 'Parked' as ParkingRecord['status'] });

  const occupied = parkingRecords.filter((p) => p.status === 'Parked').length;

  return (
    <>
      <div className={cn(glassCard, 'p-5 mb-6 flex gap-8')}>
        <div><p className="text-[10px] uppercase text-[#7F95B2] font-mono">Occupied</p><p className="text-3xl text-[#00E5FF] font-mono">{occupied}</p></div>
        <div><p className="text-[10px] uppercase text-[#7F95B2] font-mono">Emergency Bay</p><p className="text-3xl text-[#FF4444] font-mono">{parkingRecords.filter((p) => p.bay === 'Emergency').length}</p></div>
      </div>
      <SecuritySmartTable title="Parking" entityName="Operations" subtitle="LPR · VIP · emergency bays" data={parkingRecords}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'plateNumber', label: 'Plate' },
          { key: 'ownerName', label: 'Owner' },
          { key: 'slot', label: 'Slot' },
          { key: 'bay', label: 'Bay' },
          { key: 'status', label: 'Status' },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Vehicle Entry" footer={<button type="button" onClick={() => { if (editing) updateParkingRecord({ ...editing, ...form }); else addParkingRecord(form); onToast('success', 'Saved'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4">
          <input className={inputClass} value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} placeholder="License plate" />
          <input className={inputClass} value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} placeholder="Owner" />
          <select className={inputClass} value={form.bay} onChange={(e) => setForm({ ...form, bay: e.target.value as ParkingRecord['bay'] })}><option>General</option><option>VIP</option><option>Emergency</option><option>Staff</option></select>
        </div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete record?" message="Remove parking entry?" onConfirm={() => { if (toDelete) deleteParkingRecord(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
