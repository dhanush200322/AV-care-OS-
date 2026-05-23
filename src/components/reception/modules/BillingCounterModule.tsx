import React, { useState } from 'react';
import { useStore, type Invoice } from '../../../store/useStore';
import { ReceptionSmartTable } from '../shared/ReceptionSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';

interface Props { onToast: (t: 'success' | 'error', m: string) => void; }

export const BillingCounterModule: React.FC<Props> = ({ onToast }) => {
  const { invoices, addInvoice, markInvoicePaid } = useStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [toVoid, setToVoid] = useState<Invoice | null>(null);
  const [form, setForm] = useState({ patient: '', amount: 1500, service: 'OPD Consultation', payment: 'UPI' as 'UPI' | 'Card' | 'Cash', status: 'Pending' as 'Paid' | 'Pending' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      onToast('success', 'Invoice updated (demo)');
    } else {
      const id = addInvoice({ patient: form.patient, amount: form.amount, status: form.status, services: [{ name: form.service, price: form.amount }] });
      if (form.status === 'Paid') markInvoicePaid(id);
      onToast('success', `Invoice ${id} created`);
    }
    setSlideOpen(false);
  };

  const revenueToday = invoices.filter((i) => i.date === new Date().toISOString().split('T')[0] && i.status === 'Paid').reduce((s, i) => s + i.amount, 0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={cn(glassCard, 'p-5')}><p className="text-[10px] uppercase text-[#89A9B0]">Revenue Today</p><p className="text-2xl text-[#00FFD5] font-light">₹{revenueToday.toLocaleString()}</p></div>
        <div className={cn(glassCard, 'p-5')}><p className="text-[10px] uppercase text-[#89A9B0]">Pending Bills</p><p className="text-2xl text-[#FFB800] font-light">{invoices.filter((i) => i.status === 'Pending').length}</p></div>
        <div className={cn(glassCard, 'p-5')}><p className="text-[10px] uppercase text-[#89A9B0]">AI Insight</p><p className="text-sm text-white/80">Peak billing 12–1 PM · suggest express counter</p></div>
      </div>

      <ReceptionSmartTable title="Billing" entityName="Invoices" subtitle="OPD · lab · pharmacy · insurance · GST receipts" data={invoices}
        onAdd={() => { setEditing(null); setForm({ patient: '', amount: 1500, service: 'OPD Consultation', payment: 'UPI', status: 'Pending' }); setSlideOpen(true); }}
        onEdit={(r) => { setEditing(r); setForm({ patient: r.patient, amount: r.amount, service: r.services[0]?.name ?? '', payment: 'UPI', status: r.status }); setSlideOpen(true); }}
        onDelete={(r) => setToVoid(r)}
        columns={[
          { key: 'id', label: 'Invoice' },
          { key: 'patient', label: 'Patient' },
          { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount.toLocaleString()}` },
          { key: 'status', label: 'Status', render: (r) => <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold', r.status === 'Paid' ? 'bg-[#00D68F]/20 text-[#00D68F]' : 'bg-[#FFB800]/20 text-[#FFB800]')}>{r.status}</span> },
          { key: 'date', label: 'Date' },
        ]}
      />

      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Invoice Builder" width="lg" footer={<button type="submit" form="bill-form" className={cn(btnPrimary, 'w-full justify-center')}>Generate Invoice</button>}>
        <form id="bill-form" onSubmit={handleSave} className="space-y-4">
          <input className={inputClass} placeholder="Patient name" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required />
          <input className={inputClass} placeholder="Service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
          <input type="number" className={inputClass} placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
          <div className="flex gap-2">
            {[{ icon: Smartphone, label: 'UPI' }, { icon: CreditCard, label: 'Card' }, { icon: Banknote, label: 'Cash' }].map((p) => (
              <button key={p.label} type="button" onClick={() => setForm({ ...form, payment: p.label as typeof form.payment })} className={cn('flex-1 p-3 rounded-xl border text-xs font-bold uppercase', form.payment === p.label ? 'border-[#00FFD5] bg-[#00C2A8]/15 text-[#00FFD5]' : 'border-white/10 text-[#89A9B0]')}>
                <p.icon size={16} className="mx-auto mb-1" />{p.label}
              </button>
            ))}
          </div>
          <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'Paid' | 'Pending' })}><option value="Pending">Pending</option><option value="Paid">Paid</option></select>
        </form>
      </SlideOver>

      <ConfirmDialog open={!!toVoid} title="Void Invoice?" message="Cancel this bill?" variant="delete" onConfirm={() => { onToast('success', 'Invoice voided'); setToVoid(null); }} onCancel={() => setToVoid(null)} />
    </>
  );
};
