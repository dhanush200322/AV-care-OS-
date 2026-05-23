import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useDoctorStore, type MedicalRecord } from '../../../store/doctorStore';
import { DoctorSmartTable } from '../shared/DoctorSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export const MedicalRecordsModule: React.FC<Props> = ({ onToast }) => {
  const { medicalRecords, addMedicalRecord, updateMedicalRecord, archiveMedicalRecord, deleteMedicalRecord } = useDoctorStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<MedicalRecord | null>(null);
  const [toDelete, setToDelete] = useState<MedicalRecord | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    patientName: '',
    patientId: '',
    diagnoses: '',
    procedures: '',
    allergies: '',
    immunizations: '',
    imaging: '',
    status: 'Active' as MedicalRecord['status'],
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      patientName: form.patientName,
      patientId: form.patientId,
      diagnoses: form.diagnoses.split(',').map((s) => s.trim()),
      procedures: form.procedures.split(',').map((s) => s.trim()),
      allergies: form.allergies.split(',').map((s) => s.trim()),
      immunizations: form.immunizations.split(',').map((s) => s.trim()),
      imaging: form.imaging.split(',').map((s) => s.trim()),
      timeline: editing?.timeline ?? [{ date: new Date().toISOString().split('T')[0], event: 'Record created', type: 'visit' }],
      status: form.status,
    };
    if (editing) {
      updateMedicalRecord({ ...editing, ...payload });
      onToast('success', 'Record updated');
    } else {
      addMedicalRecord(payload);
      onToast('success', 'Record created');
    }
    setSlideOpen(false);
  };

  return (
    <>
      <div className="space-y-4 mb-6">
        {medicalRecords.slice(0, 2).map((rec) => (
          <motion.div
            key={rec.id}
            layout
            className={cn(glassCard, 'p-5 cursor-pointer border-l-4', expandedId === rec.id ? 'border-l-[#00FFA3]' : 'border-l-[#00D68F]/30')}
            onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-white">{rec.patientName}</p>
                <p className="text-[10px] text-[#8AA39B]">{rec.patientId}</p>
              </div>
              <span className="text-[10px] text-[#00FFA3] font-bold uppercase">{rec.status}</span>
            </div>
            {expandedId === rec.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/10 space-y-2">
                {rec.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className="text-[#00FFA3] font-mono">{t.date}</span>
                    <span className="text-white/80">{t.event}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <DoctorSmartTable
        title="Medical"
        entityName="Records"
        subtitle="Timeline history, diagnoses, procedures & imaging"
        data={medicalRecords}
        onAdd={() => { setEditing(null); setForm({ patientName: '', patientId: 'P-NEW', diagnoses: '', procedures: '', allergies: '', immunizations: '', imaging: '', status: 'Active' }); setSlideOpen(true); }}
        onEdit={(row) => { setEditing(row); setForm({ patientName: row.patientName, patientId: row.patientId, diagnoses: row.diagnoses.join(', '), procedures: row.procedures.join(', '), allergies: row.allergies.join(', '), immunizations: row.immunizations.join(', '), imaging: row.imaging.join(', '), status: row.status }); setSlideOpen(true); }}
        onArchive={(row) => { archiveMedicalRecord(row.id); onToast('success', 'Archived'); }}
        onDelete={(row) => setToDelete(row)}
        columns={[
          { key: 'patientName', label: 'Patient' },
          { key: 'diagnoses', label: 'Diagnoses', render: (r) => r.diagnoses.slice(0, 2).join(', ') },
          { key: 'allergies', label: 'Allergies', render: (r) => r.allergies.join(', ') || '—' },
          { key: 'status', label: 'Status' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Medical Record" width="xl" footer={<button type="submit" form="mr-form" className={cn(btnPrimary, 'w-full justify-center')}>Save Record</button>}>
        <form id="mr-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient name" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <input className={inputClass} placeholder="Patient ID" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} />
          <input className={inputClass} placeholder="Diagnoses (comma-separated)" value={form.diagnoses} onChange={(e) => setForm({ ...form, diagnoses: e.target.value })} />
          <input className={inputClass} placeholder="Procedures" value={form.procedures} onChange={(e) => setForm({ ...form, procedures: e.target.value })} />
          <input className={inputClass} placeholder="Allergies" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
          <input className={inputClass} placeholder="Immunizations" value={form.immunizations} onChange={(e) => setForm({ ...form, immunizations: e.target.value })} />
          <input className={inputClass} placeholder="Imaging" value={form.imaging} onChange={(e) => setForm({ ...form, imaging: e.target.value })} />
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toDelete} title="Delete Record?" message="Permanently remove this medical record?" onConfirm={() => { if (toDelete) deleteMedicalRecord(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
