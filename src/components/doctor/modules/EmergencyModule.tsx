import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Siren } from 'lucide-react';
import { useDoctorStore, type EmergencyCase } from '../../../store/doctorStore';
import { DoctorSmartTable } from '../shared/DoctorSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export const EmergencyModule: React.FC<Props> = ({ onToast }) => {
  const { emergencies, addEmergency, updateEmergency, closeEmergency, deleteEmergency } = useDoctorStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<EmergencyCase | null>(null);
  const [toDelete, setToDelete] = useState<EmergencyCase | null>(null);
  const [form, setForm] = useState({
    patientName: '',
    severity: 'High' as EmergencyCase['severity'],
    location: '',
    assignedDoctor: 'Dr. Satish K.',
    countdownMinutes: 15,
    status: 'Active' as EmergencyCase['status'],
    description: '',
  });

  const active = emergencies.filter((e) => e.status === 'Active' || e.status === 'Responding');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateEmergency({ ...editing, ...form });
      onToast('success', 'Emergency updated');
    } else {
      addEmergency(form);
      onToast('success', 'Emergency case opened');
    }
    setSlideOpen(false);
  };

  return (
    <>
      {active.length > 0 && (
        <div className="grid gap-4 mb-6">
          {active.map((em) => (
            <motion.div
              key={em.id}
              animate={{ boxShadow: ['0 0 0 0 rgba(255,68,68,0.4)', '0 0 0 12px rgba(255,68,68,0)', '0 0 0 0 rgba(255,68,68,0)'] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={cn(glassCard, 'p-6 border-[#FF4444]/50 flex flex-col md:flex-row md:items-center justify-between gap-4')}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#FF4444]/20 text-[#FF4444]">
                  <Siren size={24} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{em.patientName}</p>
                  <p className="text-sm text-[#FF4444] font-bold uppercase">{em.severity} · {em.location}</p>
                  <p className="text-xs text-[#8AA39B] mt-1">{em.description}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-[#8AA39B]">Response countdown</p>
                <p className="text-4xl font-mono font-bold text-[#FF4444]">{em.countdownMinutes}:00</p>
                <button type="button" onClick={() => { updateEmergency({ ...em, status: 'Responding' }); onToast('success', 'Responding'); }} className={cn(btnPrimary, 'mt-3')}>
                  Respond
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <DoctorSmartTable
        title="Emergency"
        entityName="Alerts"
        subtitle="Critical alerts, escalation & response tracking"
        data={emergencies}
        onAdd={() => { setEditing(null); setSlideOpen(true); }}
        onEdit={(row) => { setEditing(row); setForm(row); setSlideOpen(true); }}
        onArchive={(row) => { closeEmergency(row.id); onToast('success', 'Case closed'); }}
        onDelete={(row) => setToDelete(row)}
        columns={[
          { key: 'patientName', label: 'Patient' },
          { key: 'severity', label: 'Severity' },
          { key: 'location', label: 'Location' },
          { key: 'countdownMinutes', label: 'Timer', render: (r) => `${r.countdownMinutes}m` },
          { key: 'status', label: 'Status' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Update Emergency' : 'New Emergency Case'} footer={<button type="submit" form="em-form" className={cn(btnPrimary, 'w-full justify-center from-[#FF4444] to-[#FF6B6B]')}>Save</button>}>
        <form id="em-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <select className={inputClass} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as EmergencyCase['severity'] })}>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
          </select>
          <input className={inputClass} placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <textarea className={inputClass} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toDelete} title="Delete Case?" message="Remove emergency record?" variant="delete" onConfirm={() => { if (toDelete) deleteEmergency(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
