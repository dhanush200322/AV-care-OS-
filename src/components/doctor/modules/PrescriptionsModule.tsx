import React, { useState } from 'react';
import { useDoctorStore, type Prescription } from '../../../store/doctorStore';
import { DoctorSmartTable } from '../shared/DoctorSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';
import { AlertTriangle } from 'lucide-react';

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export const PrescriptionsModule: React.FC<Props> = ({ onToast }) => {
  const { prescriptions, addPrescription, updatePrescription, deletePrescription } = useDoctorStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [toDelete, setToDelete] = useState<Prescription | null>(null);
  const [form, setForm] = useState({
    patientName: '',
    medName: '',
    dosage: '',
    frequency: 'TID',
    duration: '7 days',
    allergies: '',
    status: 'Active' as Prescription['status'],
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ patientName: '', medName: '', dosage: '500mg', frequency: 'TID', duration: '7 days', allergies: 'Penicillin', status: 'Active' });
    setSlideOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const medicines = editing?.medicines ?? [];
    const med = { name: form.medName, dosage: form.dosage, frequency: form.frequency, duration: form.duration };
    const payload = {
      patientName: form.patientName,
      medicines: editing ? medicines.map((m, i) => (i === 0 ? med : m)) : [med],
      allergies: form.allergies.split(',').map((s) => s.trim()),
      warnings: form.medName.toLowerCase().includes('penicillin') && form.allergies.includes('Penicillin') ? ['Allergy conflict detected'] : [],
      status: form.status,
    };
    if (editing) {
      updatePrescription({ ...editing, ...payload });
      onToast('success', 'Prescription updated');
    } else {
      addPrescription(payload);
      onToast('success', 'E-prescription issued');
    }
    setSlideOpen(false);
  };

  return (
    <>
      {form.allergies.includes('Penicillin') && form.medName && (
        <div className={cn(glassCard, 'p-4 mb-4 border-[#FFB800]/40 flex items-center gap-3')}>
          <AlertTriangle className="text-[#FFB800]" size={20} />
          <p className="text-sm text-[#FFB800]">AI: Check drug-allergy interactions before signing.</p>
        </div>
      )}

      <DoctorSmartTable
        title="E-Prescription"
        entityName="Prescriptions"
        subtitle="Digital signatures, pharmacy sync & interaction checks"
        data={prescriptions}
        onAdd={openCreate}
        onEdit={(row) => {
          setEditing(row);
          const m = row.medicines[0];
          setForm({ patientName: row.patientName, medName: m?.name ?? '', dosage: m?.dosage ?? '', frequency: m?.frequency ?? '', duration: m?.duration ?? '', allergies: row.allergies.join(', '), status: row.status });
          setSlideOpen(true);
        }}
        onDelete={(row) => setToDelete(row)}
        columns={[
          { key: 'patientName', label: 'Patient' },
          { key: 'medicines', label: 'Medicines', render: (r) => r.medicines.map((m) => m.name).join(', ') },
          { key: 'status', label: 'Status' },
          { key: 'signedAt', label: 'Signed', render: (r) => new Date(r.signedAt).toLocaleDateString() },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Prescription Builder" footer={<button type="submit" form="rx-form" className={cn(btnPrimary, 'w-full justify-center')}>Sign & Issue</button>}>
        <form id="rx-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <input className={inputClass} placeholder="Medicine" value={form.medName} onChange={(e) => setForm({ ...form, medName: e.target.value })} required />
          <div className="grid grid-cols-3 gap-2">
            <input className={inputClass} placeholder="Dosage" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
            <input className={inputClass} placeholder="Frequency" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
            <input className={inputClass} placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <input className={inputClass} placeholder="Known allergies" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toDelete} title="Delete Prescription?" message="Remove this prescription from records?" onConfirm={() => { if (toDelete) deletePrescription(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
