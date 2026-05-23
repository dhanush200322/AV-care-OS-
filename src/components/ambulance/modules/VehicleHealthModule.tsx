import React, { useState } from 'react';
import { useAmbulanceStore, type VehicleHealthRecord } from '../../../store/ambulanceStore';
import { AmbulanceSmartTable } from '../shared/AmbulanceSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass } from '../theme';
import { cn } from '../../../lib/utils';

export const VehicleHealthModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { vehicleHealth, addVehicleHealth, updateVehicleHealth, deleteVehicleHealth } = useAmbulanceStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<VehicleHealthRecord | null>(null);
  const [toDelete, setToDelete] = useState<VehicleHealthRecord | null>(null);
  const [form, setForm] = useState({ unitId: 'u-1', callSign: '', fuelPercent: 80, odometerKm: 45000, defibrillatorOk: true, oxygenPercent: 90, lastService: '', nextService: '', maintenanceNotes: '', aiPrediction: '', status: 'Healthy' as VehicleHealthRecord['status'] });

  return (
    <>
      <AmbulanceSmartTable title="Vehicle" entityName="Health" subtitle="Fuel · O2 · defibrillator · AI predictive" data={vehicleHealth}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'callSign', label: 'Unit' },
          { key: 'fuelPercent', label: 'Fuel', render: (r) => `${r.fuelPercent}%` },
          { key: 'oxygenPercent', label: 'O2', render: (r) => `${r.oxygenPercent}%` },
          { key: 'status', label: 'Status', render: (r) => <span className={cn(r.status === 'Critical' && 'text-[#FF4444]', r.status === 'Attention' && 'text-[#FFB800]', r.status === 'Healthy' && 'text-[#00D68F]')}>{r.status}</span> },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Health Record" footer={<button type="button" onClick={() => { if (editing) updateVehicleHealth({ ...editing, ...form }); else addVehicleHealth(form); onToast('success', 'Saved'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4"><input className={inputClass} value={form.callSign} onChange={(e) => setForm({ ...form, callSign: e.target.value })} placeholder="Call sign" /><input type="number" className={inputClass} value={form.fuelPercent} onChange={(e) => setForm({ ...form, fuelPercent: +e.target.value })} placeholder="Fuel %" /></div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete record?" message="Remove health log?" onConfirm={() => { if (toDelete) deleteVehicleHealth(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
