import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Maximize2, Plus, Radio, AlertTriangle } from 'lucide-react';
import { useSecurityStore, type CameraFeed, type CameraStatus } from '../../../store/securityStore';
import { SecuritySmartTable } from '../shared/SecuritySmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const CCTVMonitoringModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { cameras, addCamera, updateCamera, archiveCamera, deleteCamera } = useSecurityStore();
  const [grid, setGrid] = useState<2 | 3 | 4>(2);
  const [fullscreen, setFullscreen] = useState<string | null>(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<CameraFeed | null>(null);
  const [toDelete, setToDelete] = useState<CameraFeed | null>(null);
  const [form, setForm] = useState({ label: '', location: '', zone: 'Public', status: 'Online' as CameraStatus, aiMotion: true, aiIntrusion: false, recordingDays: 30 });

  const gridClass = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[grid];

  return (
    <>
      <div className="flex gap-2 mb-4">
        {([2, 3, 4] as const).map((g) => (
          <button key={g} type="button" onClick={() => setGrid(g)} className={cn('px-3 py-1.5 rounded-lg text-xs font-bold font-mono border', grid === g ? 'border-[#00E5FF] text-[#00E5FF] bg-[#00C2E0]/10' : 'border-white/10 text-[#7F95B2]')}>{g}x{g}</button>
        ))}
        <button type="button" onClick={() => setSlideOpen(true)} className={cn(btnPrimary, 'ml-auto')}><Plus size={14} />Add Camera</button>
      </div>

      <div className={cn('grid gap-3 mb-8', gridClass)}>
        {cameras.map((cam) => (
          <motion.div key={cam.id} layout className={cn('relative aspect-video rounded-xl overflow-hidden border group cursor-pointer', cam.aiIntrusion ? 'border-[#FF4444] shadow-[0_0_20px_rgba(255,68,48,0.3)]' : 'border-[#00C2E0]/30', fullscreen === cam.id && 'col-span-full row-span-2')}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1824] via-[#050D14] to-[#1E6FFF]/20" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,229,255,0.03)_2px,rgba(0,229,255,0.03)_4px)]" />
            <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
              <span className={cn('w-2 h-2 rounded-full', cam.status === 'Offline' ? 'bg-[#FF4444]' : 'bg-[#00D68F] animate-pulse')} />
              <span className="text-[10px] font-mono text-white bg-black/50 px-2 py-0.5 rounded">{cam.label}</span>
            </div>
            {cam.aiMotion && <div className="absolute top-2 right-2 text-[9px] font-bold text-[#FFB800] bg-black/60 px-2 py-0.5 rounded font-mono">MOTION</div>}
            {cam.aiIntrusion && <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[#FF4444] text-[10px] font-bold animate-pulse"><AlertTriangle size={12} /> INTRUSION</div>}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <button type="button" onClick={() => setFullscreen(fullscreen === cam.id ? null : cam.id)} className="p-3 rounded-full bg-[#00C2E0]/30 text-white"><Maximize2 size={20} /></button>
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] text-[#7F95B2] font-mono">{cam.location}</div>
          </motion.div>
        ))}
      </div>

      <SecuritySmartTable title="Camera" entityName="Registry" subtitle="Health · AI detection · 30-day playback" data={cameras}
        onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }} onArchive={(r) => { archiveCamera(r.id); onToast('success', 'Archived'); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'label', label: 'Camera' },
          { key: 'zone', label: 'Zone' },
          { key: 'status', label: 'Status' },
          { key: 'aiMotion', label: 'AI', render: (r) => [r.aiMotion && 'Motion', r.aiIntrusion && 'Intrusion'].filter(Boolean).join(' · ') || '—' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Camera Config" footer={<button type="button" onClick={() => { if (editing) updateCamera({ ...editing, ...form }); else addCamera(form); onToast('success', 'Saved'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4">
          <input className={inputClass} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label" />
          <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" />
          <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CameraStatus })}><option>Online</option><option>Recording</option><option>Offline</option></select>
        </div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Remove camera?" message="Delete camera from registry?" onConfirm={() => { if (toDelete) deleteCamera(toDelete.id); onToast('success', 'Removed'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
