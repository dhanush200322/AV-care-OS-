import React, { useState } from 'react';
import { useStore, type Appointment } from '../../../store/useStore';
import { DoctorSmartTable } from '../shared/DoctorSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass } from '../theme';
import { cn } from '../../../lib/utils';

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export const DoctorAppointmentsModule: React.FC<Props> = ({ onToast }) => {
  const { appointments, setAppointments, addAppointment } = useStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [confirm, setConfirm] = useState<Appointment | null>(null);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [view, setView] = useState<'calendar' | 'timeline' | 'table'>('table');
  const [form, setForm] = useState({
    patientName: '',
    doctorName: 'Dr. Satish K.',
    specialty: 'Cardiology',
    date: '',
    time: '',
    status: 'Confirmed' as Appointment['status'],
    urgency: 'Routine',
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      patientName: '',
      doctorName: 'Dr. Satish K.',
      specialty: 'Cardiology',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      status: 'Confirmed',
      urgency: 'Routine',
    });
    setSlideOpen(true);
  };

  const openEdit = (row: Appointment) => {
    setEditing(row);
    setForm({
      patientName: row.patientName,
      doctorName: row.doctorName,
      specialty: row.specialty,
      date: row.date,
      time: row.time,
      status: row.status,
      urgency: 'Routine',
    });
    setSlideOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName || !form.date || !form.time) {
      onToast('error', 'Please fill required fields');
      return;
    }
    if (editing) {
      setAppointments(
        appointments.map((a) =>
          a.id === editing.id
            ? { ...editing, ...form, status: form.status as Appointment['status'] }
            : a
        )
      );
      onToast('success', 'Appointment updated');
    } else {
      addAppointment({
        patientName: form.patientName,
        doctorName: form.doctorName,
        specialty: form.specialty,
        date: form.date,
        time: form.time,
        status: form.status,
      });
      onToast('success', 'Appointment created');
    }
    setSlideOpen(false);
  };

  const handleDelete = () => {
    if (!confirm) return;
    setAppointments(appointments.filter((a) => a.id !== confirm.id));
    onToast('success', 'Appointment cancelled');
    setConfirm(null);
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        {(['table', 'calendar', 'timeline'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all',
              view === v
                ? 'border-[#00FFA3]/40 bg-[#00D68F]/15 text-[#00FFA3]'
                : 'border-white/10 text-[#8AA39B] hover:text-white'
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'table' ? (
        <DoctorSmartTable
          title="Manage"
          entityName="Appointments"
          subtitle="Calendar, timeline & AI scheduling suggestions"
          data={appointments}
          aiFilterHint="priority"
          onAdd={openCreate}
          onEdit={openEdit}
          onView={(row) => openEdit(row)}
          onDelete={(row) => setConfirm(row)}
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'patientName', label: 'Patient' },
            { key: 'specialty', label: 'Specialty' },
            {
              key: 'date',
              label: 'Slot',
              render: (r) => (
                <span>
                  {r.date} · {r.time}
                </span>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (r) => (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                    r.status === 'Confirmed' && 'bg-[#00D68F]/20 text-[#00FFA3]',
                    r.status === 'Pending' && 'bg-[#FFB800]/20 text-[#FFB800]',
                    r.status === 'Canceled' && 'bg-white/10 text-[#8AA39B]'
                  )}
                >
                  {r.status}
                </span>
              ),
            },
          ]}
        />
      ) : (
        <div className="grid grid-cols-7 gap-2 p-6 rounded-2xl border border-white/10 bg-[#0D2818]/40">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="min-h-[80px] p-2 rounded-xl border border-white/5 bg-[#071B11]/50">
              <p className="text-[10px] text-[#8AA39B] mb-2">Day {i + 1}</p>
              {appointments
                .filter((_, j) => j % 7 === i)
                .slice(0, 2)
                .map((a) => (
                  <div key={a.id} className="text-[9px] p-1 mb-1 rounded bg-[#00D68F]/20 text-[#00FFA3] truncate">
                    {a.patientName}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      <SlideOver
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        title={editing ? 'Edit Appointment' : 'Create Appointment'}
        subtitle="AI suggests optimal slots based on queue load"
        footer={
          <button type="submit" form="appt-form" className={cn(btnPrimary, 'w-full justify-center')}>
            {editing ? 'Save Changes' : 'Book Appointment'}
          </button>
        }
      >
        <form id="appt-form" onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-[#8AA39B] tracking-wider">Patient</label>
            <input className={inputClass} value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-[#8AA39B]">Date</label>
              <input type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-[#8AA39B]">Time</label>
              <input type="time" className={inputClass} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-[#8AA39B]">Specialty</label>
            <input className={inputClass} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-[#8AA39B]">Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Appointment['status'] })}>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <p className="text-xs text-[#00C2E0] flex items-center gap-2 p-3 rounded-xl bg-[#00C2E0]/10 border border-[#00C2E0]/20">
            AI: Suggested slot 10:30 — lowest queue wait
          </p>
        </form>
      </SlideOver>

      <ConfirmDialog
        open={!!confirm}
        title="Cancel Appointment?"
        message={`Remove appointment for ${confirm?.patientName}? This can be undone from activity log.`}
        variant="delete"
        confirmLabel="Cancel Appointment"
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
};
