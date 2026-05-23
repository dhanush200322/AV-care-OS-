import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSecurityStore, type AccessLog } from '../../../store/securityStore';
import { SecuritySmartTable } from '../shared/SecuritySmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';

export const AccessLogsModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { accessLogs, addAccessLog, updateAccessLog, deleteAccessLog } = useSecurityStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<AccessLog | null>(null);
  const [toDelete, setToDelete] = useState<AccessLog | null>(null);
  const [form, setForm] = useState({ personName: '', personType: 'Visitor' as AccessLog['personType'], zone: 'Main Gate', direction: 'Entry' as AccessLog['direction'], method: 'Badge' as AccessLog['method'], timestamp: new Date().toISOString(), suspicious: false, notes: '' });

  const liveFeed = accessLogs.slice(0, 5);

  return (
    <>
      <div className={cn(glassCard, 'p-4 mb-6 max-h-48 overflow-y-auto no-scrollbar')}>
        <p className="text-[10px] uppercase text-[#7F95B2] mb-3 font-mono">Live access feed</p>
        {liveFeed.map((log, i) => (
          <motion.div key={log.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={cn('flex justify-between py-2 border-b border-white/5 text-xs font-mono', log.suspicious && 'text-[#FF4444]')}>
            <span>{log.direction} · {log.personName} · {log.zone}</span>
            <span className="text-[#7F95B2]">{new Date(log.timestamp).toLocaleTimeString()}</span>
          </motion.div>
        ))}
      </div>
      <SecuritySmartTable title="Access" entityName="Logs" subtitle="Staff · visitors · vendors · timeline" data={accessLogs} aiFilterHint="suspicious"
        onAdd={() => { setEditing(null); setSlideOpen(true); }} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }} onDelete={(r) => setToDelete(r)}
        columns={[
          { key: 'personName', label: 'Person' },
          { key: 'personType', label: 'Type' },
          { key: 'zone', label: 'Zone' },
          { key: 'direction', label: 'Dir' },
          { key: 'suspicious', label: 'Flag', render: (r) => r.suspicious ? '⚠ SUS' : 'OK' },
        ]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Access Log" footer={<button type="submit" form="al-form" className={cn(btnPrimary, 'w-full justify-center')} onClick={(e) => { e.preventDefault(); if (editing) updateAccessLog(editing); else addAccessLog(form); onToast('success', 'Saved'); setSlideOpen(false); }}>Save</button>}>
        <form id="al-form" className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input className={inputClass} value={form.personName} onChange={(e) => setForm({ ...form, personName: e.target.value })} placeholder="Name" />
          <select className={inputClass} value={form.personType} onChange={(e) => setForm({ ...form, personType: e.target.value as AccessLog['personType'] })}><option>Staff</option><option>Visitor</option><option>Vendor</option></select>
          <input className={inputClass} value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} placeholder="Zone" />
          <label className="flex items-center gap-2 text-sm text-[#7F95B2]"><input type="checkbox" checked={form.suspicious} onChange={(e) => setForm({ ...form, suspicious: e.target.checked })} /> Suspicious activity</label>
        </form>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete log?" message="Remove access log entry?" onConfirm={() => { if (toDelete) deleteAccessLog(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
