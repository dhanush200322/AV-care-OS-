import React, { useState } from 'react';
import { useAmbulanceStore, type RoutePlan } from '../../../store/ambulanceStore';
import { AmbulanceSmartTable } from '../shared/AmbulanceSmartTable';
import { SlideOver } from '../shared/SlideOver';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { btnPrimary, inputClass, glassCard } from '../theme';
import { cn } from '../../../lib/utils';
import { Sparkles } from 'lucide-react';

export const RouteOptimizationModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { routes, addRoute, updateRoute, archiveRoute, deleteRoute } = useAmbulanceStore();
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<RoutePlan | null>(null);
  const [toDelete, setToDelete] = useState<RoutePlan | null>(null);
  const [form, setForm] = useState({ name: '', origin: '', destination: '', distanceKm: 5, durationMin: 12, trafficLevel: 'Medium' as RoutePlan['trafficLevel'], aiRecommended: true, weatherImpact: 'Clear', status: 'Active' as RoutePlan['status'] });

  return (
    <>
      <div className={cn(glassCard, 'p-6 mb-6')}>
        <div className="flex items-center gap-2 mb-4"><Sparkles className="text-[#FFA63D]" /><span className="text-sm font-bold text-[#FFA63D] font-mono">AI ROUTE ENGINE</span></div>
        <div className="h-32 rounded-xl bg-[#140B05] border border-[#FF7A00]/20 flex items-center justify-center text-[#B8A28F] text-xs font-mono">Traffic heatmap · emergency lane optimization · hospital capacity sync</div>
      </div>
      <AmbulanceSmartTable title="Route" entityName="Optimization" subtitle="AI recommendations · weather · alternates" data={routes}
        onAdd={() => setSlideOpen(true)} onEdit={(r) => { setEditing(r); setForm(r); setSlideOpen(true); }}
        onArchive={(r) => { archiveRoute(r.id); onToast('success', 'Archived'); }} onDelete={(r) => setToDelete(r)}
        columns={[{ key: 'name', label: 'Route' }, { key: 'durationMin', label: 'Duration', render: (r) => `${r.durationMin} min` }, { key: 'trafficLevel', label: 'Traffic' }, { key: 'aiRecommended', label: 'AI', render: (r) => r.aiRecommended ? '✓' : '—' }]}
      />
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="Route Plan" footer={<button type="button" onClick={() => { if (editing) updateRoute({ ...editing, ...form }); else addRoute(form); onToast('success', 'Saved'); setSlideOpen(false); }} className={cn(btnPrimary, 'w-full justify-center')}>Save</button>}>
        <div className="space-y-4"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Route name" /><input className={inputClass} value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Origin" /><input className={inputClass} value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Destination" /></div>
      </SlideOver>
      <ConfirmDialog open={!!toDelete} title="Delete route?" message="Remove route plan?" onConfirm={() => { if (toDelete) deleteRoute(toDelete.id); onToast('success', 'Deleted'); setToDelete(null); }} onCancel={() => setToDelete(null)} />
    </>
  );
};
