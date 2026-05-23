import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, Scan, Sparkles, Printer, ChevronRight, ChevronLeft } from 'lucide-react';
import { useReceptionStore, type PatientRegistration } from '../../../store/receptionStore';
import { useStore } from '../../../store/useStore';
import { ReceptionSmartTable } from '../shared/ReceptionSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, btnGhost, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

const STEPS = ['Personal', 'Contact & Insurance', 'Medical & IDs', 'Review'];

interface Props { onToast: (t: 'success' | 'error', m: string) => void; }

const emptyForm = (): Omit<PatientRegistration, 'id' | 'qrCode' | 'createdAt' | 'updatedAt' | 'status'> => ({
  name: '', dob: '', gender: 'Female', phone: '', address: '', emergencyContact: '', bloodGroup: 'O+',
  allergies: '', insuranceProvider: '', insuranceId: '', aadhaar: '', pan: '', abha: '', referringDoctor: '',
});

export const PatientRegistrationModule: React.FC<Props> = ({ onToast }) => {
  const { registrations, addRegistration, updateRegistration, archiveRegistration, deleteRegistration } = useReceptionStore();
  const { addPatient } = useStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState<PatientRegistration | null>(null);
  const [toDelete, setToDelete] = useState<PatientRegistration | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [dupWarning, setDupWarning] = useState(false);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setStep(0); setSlideOpen(true); };
  const openEdit = (r: PatientRegistration) => { setEditing(r); setForm(r); setStep(0); setSlideOpen(true); };

  const checkDuplicate = (phone: string) => {
    const dup = registrations.some((r) => r.phone === phone && r.id !== editing?.id);
    setDupWarning(dup);
    return dup;
  };

  const aiFill = () => {
    setForm((f) => ({ ...f, insuranceProvider: 'Star Health', abha: 'ABHA-' + Math.floor(10000 + Math.random() * 90000), referringDoctor: 'Dr. Satish K.' }));
    onToast('success', 'AI auto-filled insurance & ABHA');
  };

  const submit = () => {
    if (!form.name || !form.phone) { onToast('error', 'Name and phone required'); return; }
    if (checkDuplicate(form.phone)) { onToast('error', 'Possible duplicate patient'); return; }
    if (editing) {
      updateRegistration({ ...editing, ...form });
      onToast('success', 'Registration updated');
    } else {
      const id = addRegistration(form);
      const age = form.dob ? new Date().getFullYear() - new Date(form.dob).getFullYear() : 0;
      addPatient({ name: form.name, age, gender: form.gender, condition: 'OPD', ward: 'Outpatient', admission: new Date().toISOString().split('T')[0], status: 'Active' });
      onToast('success', `Registered · QR ${id}`);
    }
    setSlideOpen(false);
  };

  return (
    <>
      <div className={cn(glassCard, 'p-4 mb-6 flex flex-wrap gap-3 items-center')}>
        <button type="button" onClick={openCreate} className={btnPrimary}><Sparkles size={14} />New Registration</button>
        <button type="button" className={btnGhost}><Scan size={14} />OCR Scan</button>
        <button type="button" className={btnGhost}><QrCode size={14} />Scan QR</button>
        <button type="button" onClick={aiFill} className={btnGhost}><Sparkles size={14} />AI Complete</button>
      </div>

      <ReceptionSmartTable
        title="Patient"
        entityName="Registrations"
        subtitle="Multi-step registration · ABHA · insurance · wristband"
        data={registrations}
        aiFilterHint="duplicates"
        onAdd={openCreate}
        onEdit={openEdit}
        onView={openEdit}
        onArchive={(r) => { archiveRegistration(r.id); onToast('success', 'Archived'); }}
        onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'abha', label: 'ABHA' },
          { key: 'referringDoctor', label: 'Referring Dr' },
          { key: 'status', label: 'Status' },
          { key: 'qrCode', label: 'QR', render: (r) => <span className="font-mono text-[10px] text-[#00FFD5]">{r.qrCode}</span> },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Edit Registration' : 'New Patient Registration'} width="xl" subtitle={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}
        footer={
          <div className="flex gap-2">
            {step > 0 && <button type="button" onClick={() => setStep((s) => s - 1)} className={btnGhost}><ChevronLeft size={14} />Back</button>}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)} className={cn(btnPrimary, 'flex-1 justify-center')}>Next<ChevronRight size={14} /></button>
            ) : (
              <button type="button" onClick={submit} className={cn(btnPrimary, 'flex-1 justify-center')}><Printer size={14} />Register & Print Wristband</button>
            )}
          </div>
        }
      >
        <div className="flex gap-2 mb-6">{STEPS.map((s, i) => (
          <div key={s} className={cn('flex-1 h-1 rounded-full', i <= step ? 'bg-[#00FFD5]' : 'bg-white/10')} />
        ))}</div>
        {dupWarning && <p className="text-xs text-[#FFB800] mb-4 p-3 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/30">Duplicate phone detected in registry</p>}

        {step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <input className={inputClass} placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" className={inputClass} value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              <select className={inputClass} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option>Female</option><option>Male</option><option>Other</option></select>
            </div>
            <input className={inputClass} placeholder="Blood group" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <input className={inputClass} placeholder="Phone *" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); checkDuplicate(e.target.value); }} />
            <textarea className={inputClass} placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input className={inputClass} placeholder="Emergency contact" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
            <input className={inputClass} placeholder="Insurance provider" value={form.insuranceProvider} onChange={(e) => setForm({ ...form, insuranceProvider: e.target.value })} />
            <input className={inputClass} placeholder="Insurance ID" value={form.insuranceId} onChange={(e) => setForm({ ...form, insuranceId: e.target.value })} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <input className={inputClass} placeholder="Aadhaar" value={form.aadhaar} onChange={(e) => setForm({ ...form, aadhaar: e.target.value })} />
            <input className={inputClass} placeholder="PAN" value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value })} />
            <input className={inputClass} placeholder="ABHA ID" value={form.abha} onChange={(e) => setForm({ ...form, abha: e.target.value })} />
            <input className={inputClass} placeholder="Allergies" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
            <input className={inputClass} placeholder="Referring doctor" value={form.referringDoctor} onChange={(e) => setForm({ ...form, referringDoctor: e.target.value })} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn(glassCard, 'p-6 space-y-2 text-sm')}>
            <p><span className="text-[#89A9B0]">Name:</span> {form.name}</p>
            <p><span className="text-[#89A9B0]">Phone:</span> {form.phone}</p>
            <p><span className="text-[#89A9B0]">ABHA:</span> {form.abha || '—'}</p>
            <p><span className="text-[#89A9B0]">Insurance:</span> {form.insuranceProvider || '—'}</p>
            <div className="mt-4 p-4 rounded-xl border border-dashed border-[#00FFD5]/40 flex items-center justify-center gap-2 text-[#00FFD5]"><QrCode size={32} /><span className="text-xs font-mono">QR will generate on submit</span></div>
          </motion.div>
        )}
      </SlideOver>

      <ConfirmDialog open={!!toDelete} title="Delete Registration?" message={`Remove ${toDelete?.name} from registry?`} onConfirm={() => { if (toDelete) deleteRegistration(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
