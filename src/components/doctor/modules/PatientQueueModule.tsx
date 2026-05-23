import React, { useState } from 'react';
import { useDoctorStore, type QueuePatient, type Urgency } from '../../../store/doctorStore';
import { DoctorSmartTable } from '../shared/DoctorSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass } from '../theme';
import { cn } from '../../../lib/utils';

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export const PatientQueueModule: React.FC<Props> = ({ onToast }) => {
  const { queue, addToQueue, updateQueue, removeFromQueue } = useDoctorStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<QueuePatient | null>(null);
  const [toRemove, setToRemove] = useState<QueuePatient | null>(null);
  const [form, setForm] = useState({
    patientName: '',
    age: 30,
    chiefComplaint: '',
    priority: 'Routine' as Urgency,
    department: 'General',
    status: 'Waiting' as QueuePatient['status'],
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ patientName: '', age: 30, chiefComplaint: '', priority: 'Routine', department: 'General', status: 'Waiting' });
    setSlideOpen(true);
  };

  const openEdit = (row: QueuePatient) => {
    setEditing(row);
    setForm({
      patientName: row.patientName,
      age: row.age,
      chiefComplaint: row.chiefComplaint,
      priority: row.priority,
      department: row.department,
      status: row.status,
    });
    setSlideOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateQueue({ ...editing, ...form });
      onToast('success', 'Queue updated');
    } else {
      addToQueue(form);
      onToast('success', 'Patient added to queue');
    }
    setSlideOpen(false);
  };

  return (
    <>
      <DoctorSmartTable
        title="Realtime"
        entityName="Patient Queue"
        subtitle="Live token system with emergency priority"
        data={queue}
        aiFilterHint="urgent first"
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={(row) => setToRemove(row)}
        columns={[
          {
            key: 'token',
            label: 'Token',
            render: (r) => (
              <span className="font-mono text-[#00FFA3] font-bold">#{r.token}</span>
            ),
          },
          { key: 'patientName', label: 'Patient' },
          { key: 'chiefComplaint', label: 'Complaint' },
          {
            key: 'waitMinutes',
            label: 'Wait',
            render: (r) => (
              <span className="flex items-center gap-2">
                {r.waitMinutes}m
                {r.priority === 'Emergency' && (
                  <span className="w-2 h-2 rounded-full bg-[#FF4444] animate-pulse" />
                )}
              </span>
            ),
          },
          {
            key: 'priority',
            label: 'Priority',
            render: (r) => (
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                  r.priority === 'Emergency' && 'bg-[#FF4444]/20 text-[#FF4444]',
                  r.priority === 'Urgent' && 'bg-[#FFB800]/20 text-[#FFB800]',
                  r.priority === 'Routine' && 'bg-[#00D68F]/20 text-[#00FFA3]'
                )}
              >
                {r.priority}
              </span>
            ),
          },
          { key: 'status', label: 'Status' },
        ]}
      />

      <SlideOver
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        title={editing ? 'Update Queue Entry' : 'Add to Queue'}
        footer={
          <button type="submit" form="queue-form" className={cn(btnPrimary, 'w-full justify-center')}>
            Save
          </button>
        }
      >
        <form id="queue-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient name" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
          <input type="number" className={inputClass} placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: +e.target.value })} />
          <input className={inputClass} placeholder="Chief complaint" value={form.chiefComplaint} onChange={(e) => setForm({ ...form, chiefComplaint: e.target.value })} required />
          <select className={inputClass} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Urgency })}>
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent</option>
            <option value="Emergency">Emergency</option>
          </select>
          <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as QueuePatient['status'] })}>
            <option value="Waiting">Waiting</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Completed">Completed</option>
          </select>
        </form>
      </SlideOver>

      <ConfirmDialog
        open={!!toRemove}
        title="Remove from Queue?"
        message={`Remove ${toRemove?.patientName} from the live queue?`}
        onConfirm={() => {
          if (toRemove) removeFromQueue(toRemove.id);
          onToast('success', 'Removed from queue');
          setToRemove(null);
        }}
        onCancel={() => setToRemove(null)}
      />
    </>
  );
};
