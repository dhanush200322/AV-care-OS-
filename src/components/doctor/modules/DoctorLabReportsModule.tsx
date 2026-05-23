import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useDoctorStore, type DoctorLabReport } from '../../../store/doctorStore';
import { useStore } from '../../../store/useStore';
import { DoctorSmartTable } from '../shared/DoctorSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export const DoctorLabReportsModule: React.FC<Props> = ({ onToast }) => {
  const { doctorLabReports, addDoctorLabReport, updateDoctorLabReport, archiveDoctorLabReport, deleteDoctorLabReport } = useDoctorStore();
  const { labReports } = useStore();
  const allReports = [
    ...doctorLabReports,
    ...labReports.map((r) => ({
      id: r.id,
      patientName: r.patient,
      test: r.test,
      biomarkers: [{ name: 'Result', value: 0, unit: '', ref: '—' }],
      aiInterpretation: r.status === 'Completed' ? 'Review complete' : 'Pending review',
      annotations: '',
      status: (r.status === 'Completed' ? 'Reviewed' : 'Pending') as DoctorLabReport['status'],
      date: r.date,
      createdAt: r.date,
      updatedAt: r.date,
    })),
  ];
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<DoctorLabReport | null>(null);
  const [toDelete, setToDelete] = useState<{ id: string } | null>(null);
  const [form, setForm] = useState({ patientName: '', test: '', aiInterpretation: '', annotations: '', status: 'Pending' as DoctorLabReport['status'], date: new Date().toISOString().split('T')[0] });

  const trendData = doctorLabReports[0]?.biomarkers.map((b, i) => ({ name: b.name, v: b.value + i * 5 })) ?? [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      biomarkers: [{ name: 'LDL', value: 120, unit: 'mg/dL', ref: '<100' }],
    };
    if (editing && doctorLabReports.some((r) => r.id === editing.id)) {
      updateDoctorLabReport({ ...editing, ...payload });
      onToast('success', 'Report updated');
    } else {
      addDoctorLabReport(payload);
      onToast('success', 'Report uploaded');
    }
    setSlideOpen(false);
  };

  return (
    <>
      {trendData.length > 0 && (
        <div className={cn(glassCard, 'p-6 mb-6')}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8AA39B] mb-4">Biomarker Trends</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="name" stroke="#8AA39B" fontSize={10} />
                <YAxis stroke="#8AA39B" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0D2818', border: '1px solid #00D68F40' }} />
                <Line type="monotone" dataKey="v" stroke="#00FFA3" strokeWidth={2} dot={{ fill: '#00FFA3' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <DoctorSmartTable
        title="Lab"
        entityName="Reports"
        subtitle="AI interpretation, annotations & comparison mode"
        data={allReports}
        onAdd={() => { setEditing(null); setSlideOpen(true); }}
        onEdit={(row) => {
          if (doctorLabReports.some((r) => r.id === row.id)) {
            setEditing(row as DoctorLabReport);
            setForm({ patientName: row.patientName, test: row.test, aiInterpretation: row.aiInterpretation, annotations: row.annotations, status: row.status, date: row.date });
            setSlideOpen(true);
          }
        }}
        onArchive={(row) => { archiveDoctorLabReport(row.id); onToast('success', 'Archived'); }}
        onDelete={(row) => setToDelete({ id: row.id })}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'patientName', label: 'Patient' },
          { key: 'test', label: 'Test' },
          { key: 'aiInterpretation', label: 'AI Insight' },
          { key: 'status', label: 'Status' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Upload / Edit Report" footer={<button type="submit" form="lab-form" className={cn(btnPrimary, 'w-full justify-center')}>Save Report</button>}>
        <form id="lab-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <input className={inputClass} placeholder="Test name" value={form.test} onChange={(e) => setForm({ ...form, test: e.target.value })} required />
          <textarea className={inputClass} placeholder="AI interpretation" value={form.aiInterpretation} onChange={(e) => setForm({ ...form, aiInterpretation: e.target.value })} />
          <textarea className={inputClass} placeholder="Annotations" value={form.annotations} onChange={(e) => setForm({ ...form, annotations: e.target.value })} />
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toDelete} title="Delete Report?" message="Archive or delete this lab report?" variant="archive" confirmLabel="Delete" onConfirm={() => { if (toDelete) deleteDoctorLabReport(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
