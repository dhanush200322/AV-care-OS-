import React, { useState } from 'react';
import { useStore, type Appointment } from '../../../store/useStore';
import { ReceptionSmartTable } from '../shared/ReceptionSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass } from '../theme';
import { cn } from '../../../lib/utils';

interface Props { onToast: (t: 'success' | 'error', m: string) => void; }

export const ReceptionAppointmentsModule: React.FC<Props> = ({ onToast }) => {
  const { appointments, setAppointments, addAppointment, doctors } = useStore();
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const [form, setForm] = useState({ patientName: '', doctorName: '', specialty: 'General', date: '', time: '', status: 'Confirmed' as Appointment['status'], walkIn: false, telemedicine: false });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setAppointments(appointments.map((a) => (a.id === editing.id ? { ...editing, ...form, status: form.status } : a)));
      onToast('success', 'Appointment rescheduled');
    } else {
      addAppointment({ patientName: form.patientName, doctorName: form.doctorName, specialty: form.specialty, date: form.date, time: form.time, status: form.status });
      onToast('success', 'Appointment booked');
    }
    setSlideOpen(false);
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        {(['table', 'calendar'] as const).map((v) => (
          <button key={v} type="button" onClick={() => setView(v)} className={cn('px-4 py-2 rounded-xl text-xs font-bold uppercase border', view === v ? 'border-[#00FFD5]/40 bg-[#00C2A8]/15 text-[#00FFD5]' : 'border-white/10 text-[#89A9B0]')}>{v}</button>
        ))}
        <p className="ml-auto text-xs text-[#00C2E0] self-center">AI: Suggested slot 11:30 — Dr. Satish K.</p>
      </div>

      {view === 'table' ? (
        <ReceptionSmartTable title="Schedule" entityName="Appointments" subtitle="Calendar · walk-in · telemedicine · waitlist" data={appointments} aiFilterHint="conflicts"
          onAdd={() => { setEditing(null); setForm({ patientName: '', doctorName: doctors[0]?.name ?? 'Dr. Satish K.', specialty: 'General', date: new Date().toISOString().split('T')[0], time: '10:00', status: 'Confirmed', walkIn: false, telemedicine: false }); setSlideOpen(true); }}
          onEdit={(r) => { setEditing(r); setForm({ patientName: r.patientName, doctorName: r.doctorName, specialty: r.specialty, date: r.date, time: r.time, status: r.status, walkIn: false, telemedicine: false }); setSlideOpen(true); }}
          onDelete={(r) => setToCancel(r)}
          columns={[
            { key: 'patientName', label: 'Patient' },
            { key: 'doctorName', label: 'Doctor' },
            { key: 'date', label: 'Slot', render: (r) => `${r.date} ${r.time}` },
            { key: 'status', label: 'Status', render: (r) => <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', r.status === 'Confirmed' && 'bg-[#00C2A8]/20 text-[#00FFD5]')}>{r.status}</span> },
          ]}
        />
      ) : (
        <div className="grid grid-cols-7 gap-2 p-6 rounded-2xl border border-white/10 bg-[#0D262B]/40">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="min-h-[100px] p-2 rounded-xl bg-[#071A1D]/50 border border-white/5">
              <p className="text-[10px] text-[#89A9B0] mb-2">Day {i + 1}</p>
              {appointments.filter((_, j) => j % 7 === i).slice(0, 3).map((a) => (
                <div key={a.id} className="text-[9px] p-1 mb-1 rounded bg-[#00C2A8]/20 text-[#00FFD5] truncate cursor-pointer" onClick={() => { setEditing(a); setSlideOpen(true); }}>{a.patientName}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Reschedule' : 'Book Appointment'} footer={<button type="submit" form="appt-rx" className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <form id="appt-rx" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <select className={inputClass} value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })}>
            {doctors.map((d) => <option key={d.id} value={d.name}>{d.name} — {d.department}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <input type="time" className={inputClass} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#89A9B0]"><input type="checkbox" checked={form.walkIn} onChange={(e) => setForm({ ...form, walkIn: e.target.checked })} /> Walk-in</label>
          <label className="flex items-center gap-2 text-sm text-[#89A9B0]"><input type="checkbox" checked={form.telemedicine} onChange={(e) => setForm({ ...form, telemedicine: e.target.checked })} /> Telemedicine</label>
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toCancel} title="Cancel Appointment?" message={`Cancel ${toCancel?.patientName}'s appointment?`} variant="delete" confirmLabel="Cancel Appt" onConfirm={() => { if (toCancel) setAppointments(appointments.map((a) => a.id === toCancel.id ? { ...a, status: 'Canceled' } : a)); onToast('success', 'Cancelled'); setToCancel(null); }} onCancel={() => setToCancel(null)} />
    </>
  );
};
