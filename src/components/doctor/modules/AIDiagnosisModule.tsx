import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Mic, Sparkles } from 'lucide-react';
import { useDoctorStore, type DiagnosisSession } from '../../../store/doctorStore';
import { DoctorSmartTable } from '../shared/DoctorSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, glassCard, inputClass } from '../theme';
import { cn } from '../../../lib/utils';

const TABS = ['Diagnosis', 'Drug Interactions', 'Lab Analysis', 'Treatment Plans', 'Clinical References'] as const;

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export const AIDiagnosisModule: React.FC<Props> = ({ onToast }) => {
  const { diagnosisSessions, addDiagnosisSession, updateDiagnosisSession, archiveDiagnosisSession, deleteDiagnosisSession } = useDoctorStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Diagnosis');
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<DiagnosisSession | null>(null);
  const [toDelete, setToDelete] = useState<DiagnosisSession | null>(null);
  const [aiTyping, setAiTyping] = useState(false);
  const [form, setForm] = useState({
    patientName: '',
    symptoms: '',
    aiConfidence: 75,
    differential: '',
    recommendations: '',
    drugInteractions: 'None detected',
    status: 'Active' as DiagnosisSession['status'],
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ patientName: '', symptoms: '', aiConfidence: 75, differential: '', recommendations: '', drugInteractions: 'None detected', status: 'Active' });
    setSlideOpen(true);
  };

  const runAIAnalysis = () => {
    setAiTyping(true);
    setTimeout(() => {
      setForm((f) => ({
        ...f,
        aiConfidence: 88,
        differential: 'Arrhythmia; Vasovagal syncope; Orthostatic hypotension',
        recommendations: 'ECG, orthostatic vitals, Holter if recurrent',
        drugInteractions: 'Review beta-blockers with current antihypertensives',
      }));
      setAiTyping(false);
    }, 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      differential: form.differential.split(',').map((s) => s.trim()).filter(Boolean),
    };
    if (editing) {
      updateDiagnosisSession({ ...editing, ...payload });
      onToast('success', 'Session updated');
    } else {
      addDiagnosisSession(payload);
      onToast('success', 'Diagnosis session created');
    }
    setSlideOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className={cn(glassCard, 'p-6 border-[#00FFA3]/30 relative overflow-hidden')}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D68F]/10 via-transparent to-[#00C2E0]/10 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row gap-6 items-start">
          <div className="w-16 h-16 rounded-2xl bg-[#00D68F]/20 border border-[#00FFA3]/40 flex items-center justify-center">
            <Brain className="text-[#00FFA3]" size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">AI Clinical Intelligence Workspace</h2>
            <p className="text-sm text-[#8AA39B] mb-4">
              Symptom analysis, differential diagnosis, drug interactions & evidence-based references.
            </p>
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all',
                    tab === t ? 'border-[#00FFA3] bg-[#00D68F]/20 text-[#00FFA3]' : 'border-white/10 text-[#8AA39B]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={openCreate} className={btnPrimary}>
            <Sparkles size={16} /> New Session
          </button>
        </div>
        {tab === 'Diagnosis' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-xl bg-[#071B11]/80 border border-white/10">
            <p className="text-xs text-[#8AA39B] mb-2">Conversational input</p>
            <div className="flex gap-2">
              <input className={cn(inputClass, 'flex-1')} placeholder="Describe symptoms…" />
              <button type="button" className="p-3 rounded-xl border border-[#00FFA3]/30 text-[#00FFA3]" aria-label="Voice">
                <Mic size={18} />
              </button>
            </div>
            {aiTyping && (
              <p className="text-xs text-[#00FFA3] mt-2 animate-pulse">AI analyzing clinical patterns…</p>
            )}
          </motion.div>
        )}
      </div>

      <DoctorSmartTable
        title="AI"
        entityName="Diagnosis Sessions"
        subtitle="Create, review, edit & archive AI-assisted diagnoses"
        data={diagnosisSessions}
        aiFilterHint="high confidence"
        onAdd={openCreate}
        onEdit={(row) => {
          setEditing(row);
          setForm({
            patientName: row.patientName,
            symptoms: row.symptoms,
            aiConfidence: row.aiConfidence,
            differential: row.differential.join(', '),
            recommendations: row.recommendations,
            drugInteractions: row.drugInteractions,
            status: row.status,
          });
          setSlideOpen(true);
        }}
        onArchive={(row) => {
          archiveDiagnosisSession(row.id);
          onToast('success', 'Session archived');
        }}
        onDelete={(row) => setToDelete(row)}
        columns={[
          { key: 'patientName', label: 'Patient' },
          { key: 'symptoms', label: 'Symptoms' },
          {
            key: 'aiConfidence',
            label: 'AI Confidence',
            render: (r) => (
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#00FFA3]" style={{ width: `${r.aiConfidence}%` }} />
                </div>
                <span className="text-[#00FFA3] font-mono text-xs">{r.aiConfidence}%</span>
              </div>
            ),
          },
          { key: 'status', label: 'Status' },
        ]}
      />

      <SlideOver
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        title={editing ? 'Edit Session' : 'New Diagnosis Session'}
        width="xl"
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={runAIAnalysis} className="flex-1 py-3 rounded-xl border border-[#00C2E0]/30 text-[#00C2E0] text-xs font-bold uppercase">
              Run AI Analysis
            </button>
            <button type="submit" form="dx-form" className={cn(btnPrimary, 'flex-1 justify-center')}>
              Save Session
            </button>
          </div>
        }
      >
        <form id="dx-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <textarea className={cn(inputClass, 'min-h-[100px]')} placeholder="Symptoms" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} required />
          <input className={inputClass} placeholder="Differential (comma-separated)" value={form.differential} onChange={(e) => setForm({ ...form, differential: e.target.value })} />
          <textarea className={inputClass} placeholder="Recommendations" value={form.recommendations} onChange={(e) => setForm({ ...form, recommendations: e.target.value })} />
          <input className={inputClass} placeholder="Drug interactions" value={form.drugInteractions} onChange={(e) => setForm({ ...form, drugInteractions: e.target.value })} />
        </form>
      </SlideOver>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete Session?"
        message="Permanently remove this AI diagnosis session?"
        onConfirm={() => {
          if (toDelete) deleteDiagnosisSession(toDelete.id);
          onToast('success', 'Session deleted');
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};
