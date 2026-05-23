import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { useAmbulanceStore, type AmbulanceUnit, type AmbulanceStatus } from '../../../store/ambulanceStore';
import { TacticalMap } from '../shared/TacticalMap';
import { AmbulanceSmartTable } from '../shared/AmbulanceSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const GPSTrackingModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { units, addUnit, updateUnit, deleteUnit } = useAmbulanceStore();
  const [fullscreen, setFullscreen] = useState(false);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<AmbulanceUnit | null>(null);
  const [toDelete, setToDelete] = useState<AmbulanceUnit | null>(null);
  const [selected, setSelected] = useState<AmbulanceUnit | null>(null);
  const [form, setForm] = useState({ callSign: '', plateNumber: '', status: 'Available' as AmbulanceStatus, lat: 13.05, lng: 80.25, etaMinutes: 0, speedKmh: 0, fuelPercent: 100, healthScore: 100, driverName: '' });

  return (
    <>
      <div className={cn('mb-6 relative', fullscreen && 'fixed inset-4 z-[100]')}>
        <TacticalMap units={units} fullscreen={fullscreen} onUnitClick={(u) => setSelected(u)} />
        <button type="button" onClick={() => setFullscreen(!fullscreen)} className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white border border-[#FF7A00]/30"><Maximize2 size={18} /></button>
      </div>
      {selected && (
        <div className={cn(glassCard, 'p-4 mb-6 flex flex-wrap gap-4 font-mono text-sm')}>
          <div><p className="text-[#B8A28F] text-[10px] uppercase">Unit</p><p className="text-[#FFA63D] font-bold">{selected.callSign}</p></div>
          <div><p className="text-[#B8A28F] text-[10px] uppercase">Status</p><p>{selected.status}</p></div>
          <div><p className="text-[#B8A28F] text-[10px] uppercase">ETA</p><p>{selected.etaMinutes} min</p></div>
          <div><p className="text-[#B8A28F] text-[10px] uppercase">Speed</p><p>{Math.round(selected.speedKmh)} km/h</p></div>
        </div>
      )}
      <AmbulanceSmartTable title="Fleet" entityName="Units" subtitle="Live GPS · ETA · status" data={units} aiFilterHint="active"
        onAdd={() => { setEditing(null); setSlideOpen(true); }} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'callSign', label: 'Call Sign' },
          { key: 'status', label: 'Status', render: (r) => <span className="text-[#FFA63D]">{r.status}</span> },
          { key: 'driverName', label: 'Driver' },
          { key: 'etaMinutes', label: 'ETA', render: (r) => `${r.etaMinutes}m` },
          { key: 'healthScore', label: 'Health', render: (r) => `${r.healthScore}%` },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Ambulance Unit" footer={<button type="button" onClick={() => { if (editing) updateUnit({ ...editing, ...form }); else addUnit(form); onToast('success', 'Saved'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4">
          <input className={inputClass} value={form.callSign} onChange={(e) => setForm({ ...form, callSign: e.target.value })} placeholder="Call sign" />
          <input className={inputClass} value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} placeholder="Plate" />
          <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AmbulanceStatus })}>{(['Available','Dispatched','En Route','On Scene','Returning','Maintenance'] as AmbulanceStatus[]).map((s) => <option key={s}>{s}</option>)}</select>
        </div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Remove unit?" message={`Delete ${toDelete?.callSign}?`} onConfirm={() => { if (toDelete) deleteUnit(toDelete.id); onToast('success', 'Removed'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
