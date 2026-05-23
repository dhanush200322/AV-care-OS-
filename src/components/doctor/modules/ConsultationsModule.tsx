import React, { useState } from 'react';
import { useDoctorStore, type Consultation } from '../../../store/doctorStore';
import { DoctorSmartTable } from '../shared/DoctorSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass } from '../theme';
import { cn } from '../../../lib/utils';
import { Sparkles } from 'lucide-react';

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

const SOAP_FIELDS = ['subjective', 'objective', 'assessment', 'plan'] as const;

export const ConsultationsModule: React.FC<Props> = ({ onToast }) => {
  const { consultations, addConsultation, updateConsultation, archiveConsultation, deleteConsultation } = useDoctorStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Consultation | null>(null);
  const [toDelete, setToDelete] = useState<Consultation | null>(null);
  const [form, setForm] = useState({
    patientName: '',
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    icdCodes: '',
    status: 'Active' as Consultation['status'],
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ patientName: '', patientId: 'P-NEW', date: new Date().toISOString().split('T')[0], subjective: '', objective: '', assessment: '', plan: '', icdCodes: '', status: 'Active' });
    setSlideOpen(true);
  };

  const generateAINotes = () => {
    setForm((f) => ({
      ...f,
      subjective: f.subjective || 'Patient reports symptoms per intake.',
      assessment: f.assessment || 'Clinical impression pending full workup.',
      plan: f.plan || 'Continue monitoring; follow-up in 1 week.',
    }));
    onToast('success', 'AI SOAP draft generated');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, icdCodes: form.icdCodes.split(',').map((s) => s.trim()).filter(Boolean) };
    if (editing) {
      updateConsultation({ ...editing, ...payload });
      onToast('success', 'Consultation saved');
    } else {
      addConsultation(payload);
      onToast('success', 'Consultation created');
    }
    setSlideOpen(false);
  };

  return (
    <>
      <DoctorSmartTable
        title="Clinical"
        entityName="Consultations"
        subtitle="SOAP notes with AI generation & ICD-10 suggestions"
        data={consultations}
        onAdd={openCreate}
        onEdit={(row) => {
          setEditing(row);
          setForm({ ...row, icdCodes: row.icdCodes.join(', ') });
          setSlideOpen(true);
        }}
        onArchive={(row) => {
          archiveConsultation(row.id);
          onToast('success', 'Archived');
        }}
        onDelete={(row) => setToDelete(row)}
        columns={[
          { key: 'patientName', label: 'Patient' },
          { key: 'date', label: 'Date' },
          { key: 'assessment', label: 'Assessment' },
          { key: 'status', label: 'Status' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="SOAP Consultation" width="xl" footer={
        <div className="flex gap-2">
          <button type="button" onClick={generateAINotes} className="flex-1 py-3 rounded-xl border border-[#00FFA3]/30 text-[#00FFA3] text-xs font-bold uppercase flex items-center justify-center gap-2">
            <Sparkles size={14} /> AI Notes
          </button>
          <button type="submit" form="soap-form" className={cn(btnPrimary, 'flex-1 justify-center')}>Save SOAP</button>
        </div>
      }>
        <form id="soap-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient name" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          {SOAP_FIELDS.map((field) => (
            <div key={field}>
              <label className="text-[10px] font-bold uppercase text-[#00FFA3] tracking-widest">{field}</label>
              <textarea className={cn(inputClass, 'min-h-[72px] mt-1')} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            </div>
          ))}
          <input className={inputClass} placeholder="ICD-10 codes (comma-separated)" value={form.icdCodes} onChange={(e) => setForm({ ...form, icdCodes: e.target.value })} />
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toDelete} title="Delete Consultation?" message="Remove this consultation record permanently?" onConfirm={() => { if (toDelete) deleteConsultation(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
