import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Video, Mic, Monitor, PhoneOff } from 'lucide-react';
import { useDoctorStore, type TelemedicineSession } from '../../../store/doctorStore';
import { DoctorSmartTable } from '../shared/DoctorSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export const TelemedicineModule: React.FC<Props> = ({ onToast }) => {
  const { telemedicineSessions, addTelemedicineSession, updateTelemedicineSession, deleteTelemedicineSession } = useDoctorStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<TelemedicineSession | null>(null);
  const [liveSession, setLiveSession] = useState<TelemedicineSession | null>(null);
  const [toDelete, setToDelete] = useState<TelemedicineSession | null>(null);
  const [form, setForm] = useState({ patientName: '', scheduledAt: '', duration: 30, notes: '', status: 'Scheduled' as TelemedicineSession['status'] });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, scheduledAt: form.scheduledAt || new Date().toISOString(), transcript: editing?.transcript ?? '', notes: form.notes };
    if (editing) {
      updateTelemedicineSession({ ...editing, ...payload });
      onToast('success', 'Session updated');
    } else {
      addTelemedicineSession(payload);
      onToast('success', 'Session scheduled');
    }
    setSlideOpen(false);
    setEditing(null);
  };

  return (
    <>
      {liveSession && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn(glassCard, 'mb-6 p-0 overflow-hidden border-[#00FFA3]/30')}>
          <div className="aspect-video bg-[#071B11] relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D68F]/10 to-transparent" />
            <p className="text-white/40 text-sm">HD Video — {liveSession.patientName}</p>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 p-3 rounded-2xl bg-[#0D2818]/90 backdrop-blur-xl border border-white/10">
              <button type="button" className="p-3 rounded-full bg-white/10 text-white"><Mic size={18} /></button>
              <button type="button" className="p-3 rounded-full bg-white/10 text-white"><Video size={18} /></button>
              <button type="button" className="p-3 rounded-full bg-white/10 text-white"><Monitor size={18} /></button>
              <button type="button" onClick={() => setLiveSession(null)} className="p-3 rounded-full bg-[#FF4444] text-white"><PhoneOff size={18} /></button>
            </div>
          </div>
          <div className="p-4 border-t border-white/10 flex gap-4">
            <div className="flex-1">
              <p className="text-xs text-[#8AA39B] mb-2">Live notes</p>
              <textarea className={cn(inputClass, 'min-h-[60px]')} placeholder="Session notes…" />
            </div>
            <div className="w-48 p-3 rounded-xl bg-[#071B11]/80 border border-white/10">
              <p className="text-[10px] font-bold text-[#00FFA3] uppercase mb-2">Patient Panel</p>
              <p className="text-sm text-white">{liveSession.patientName}</p>
            </div>
          </div>
        </motion.div>
      )}

      <DoctorSmartTable
        title="Telemedicine"
        entityName="Sessions"
        subtitle="HD video, AI transcripts & screen share"
        data={telemedicineSessions}
        onAdd={() => {
          setEditing(null);
          setForm({ patientName: '', scheduledAt: '', duration: 30, notes: '', status: 'Scheduled' });
          setSlideOpen(true);
        }}
        onEdit={(row) => {
          setEditing(row);
          setForm({
            patientName: row.patientName,
            scheduledAt: row.scheduledAt.slice(0, 16),
            duration: row.duration,
            notes: row.notes,
            status: row.status,
          });
          setSlideOpen(true);
        }}
        onView={(row) => { setLiveSession(row); updateTelemedicineSession({ ...row, status: 'Live' }); onToast('success', 'Session started'); }}
        onDelete={(row) => setToDelete(row)}
        columns={[
          { key: 'patientName', label: 'Patient' },
          { key: 'scheduledAt', label: 'Scheduled', render: (r) => new Date(r.scheduledAt).toLocaleString() },
          { key: 'duration', label: 'Duration', render: (r) => `${r.duration} min` },
          { key: 'status', label: 'Status' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Schedule Session" footer={<button type="submit" form="tel-form" className={cn(btnPrimary, 'w-full justify-center')}>Schedule</button>}>
        <form id="tel-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <input type="datetime-local" className={inputClass} value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
          <input type="number" className={inputClass} placeholder="Duration (min)" value={form.duration} onChange={(e) => setForm({ ...form, duration: +e.target.value })} />
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toDelete} title="Delete Session?" message="Remove telemedicine session?" onConfirm={() => { if (toDelete) deleteTelemedicineSession(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
