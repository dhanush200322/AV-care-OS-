import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Archive, Eye, Sparkles, LayoutGrid, List } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { btnGhost, btnPrimary, glassPanel } from '../theme';
import { ReceptionEmptyState } from './ReceptionEmptyState';

export interface ReceptionColumn<T> { key: string; label: string; sortable?: boolean; render?: (row: T) => React.ReactNode; }

interface Props<T extends { id: string }> {
  title: string; subtitle: string; entityName: string; data: T[]; columns: ReceptionColumn<T>[];
  onAdd?: () => void; onEdit?: (row: T) => void; onView?: (row: T) => void; onDelete?: (row: T) => void; onArchive?: (row: T) => void;
  onBulkDelete?: (ids: string[]) => void; loading?: boolean; aiFilterHint?: string;
}

const PAGE = 8;

export function ReceptionSmartTable<T extends { id: string }>({ title, subtitle, entityName, data, columns, onAdd, onEdit, onView, onDelete, onArchive, onBulkDelete, loading, aiFilterHint }: Props<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [aiOn, setAiOn] = useState(false);

  const filtered = useMemo(() => {
    let rows = data.filter((r) => Object.values(r as object).some((v) => String(v).toLowerCase().includes(search.toLowerCase())));
    if (aiOn && aiFilterHint) rows = rows.slice(0, Math.max(1, Math.ceil(rows.length * 0.65)));
    if (sortKey) rows = [...rows].sort((a, b) => { const av = String((a as Record<string, unknown>)[sortKey] ?? ''); const bv = String((b as Record<string, unknown>)[sortKey] ?? ''); return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av); });
    return rows;
  }, [data, search, sortKey, sortDir, aiOn, aiFilterHint]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageData = filtered.slice(page * PAGE, (page + 1) * PAGE);

  if (loading) return <div className="space-y-4 animate-pulse">{[1,2,3].map((i) => <div key={i} className="h-16 rounded-2xl bg-[#0D262B]/80" />)}</div>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#00C2A8]/60 mb-2">Front Desk Operations</p>
          <h1 className="text-3xl font-light text-white">{title} <span className="font-bold bg-gradient-to-r from-[#00C2A8] to-[#00FFD5] bg-clip-text text-transparent">{entityName}</span></h1>
          <p className="text-sm text-[#89A9B0] mt-2">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className={btnGhost}><Download size={14} />Export</button>
          {onAdd && <button type="button" onClick={onAdd} className={btnPrimary}><Plus size={16} />Add {entityName}</button>}
        </div>
      </header>

      <div className={cn(glassPanel, 'overflow-hidden')}>
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#89A9B0]" size={16} />
            <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder={`Search ${entityName.toLowerCase()}…`} className="w-full bg-[#071A1D]/60 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#00C2A8]/40" />
          </div>
          <div className="flex gap-2">
            <button type="button" className={btnGhost}><Filter size={14} /></button>
            {aiFilterHint && <button type="button" onClick={() => setAiOn(!aiOn)} className={cn(btnGhost, aiOn && 'border-[#00FFD5]/40 text-[#00FFD5] bg-[#00C2A8]/10')}><Sparkles size={14} />AI Filter</button>}
            <button type="button" onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')} className={btnGhost}>{viewMode === 'table' ? <LayoutGrid size={14} /> : <List size={14} />}</button>
          </div>
        </div>

        {selected.length > 0 && onBulkDelete && (
          <div className="px-4 py-2 bg-[#00C2A8]/10 border-b flex justify-between text-xs text-[#00FFD5]">
            <span>{selected.length} selected</span>
            <button type="button" onClick={() => { onBulkDelete(selected); setSelected([]); }} className="text-[#FF4444] font-bold">Bulk Delete</button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="p-8"><ReceptionEmptyState title={`No ${entityName}`} description={`Create your first ${entityName.toLowerCase()}.`} onAction={onAdd} /></div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-white/5">
                <th className="p-4"><input type="checkbox" checked={selected.length === pageData.length && pageData.length > 0} onChange={() => setSelected(selected.length === pageData.length ? [] : pageData.map((r) => r.id))} /></th>
                {columns.map((c) => <th key={c.key} className="p-4 text-[10px] font-black uppercase text-[#89A9B0] cursor-pointer" onClick={() => { if (sortKey === c.key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(c.key); setSortDir('asc'); } }}>{c.label}</th>)}
                <th className="p-4 text-right text-[10px] font-black uppercase text-[#89A9B0]">Actions</th>
              </tr></thead>
              <tbody>
                {pageData.map((row, i) => (
                  <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-white/5 hover:bg-[#00C2A8]/5 group">
                    <td className="p-4"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => setSelected((s) => s.includes(row.id) ? s.filter((x) => x !== row.id) : [...s, row.id])} /></td>
                    {columns.map((c) => <td key={c.key} className="p-4 text-sm text-white/90">{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '—')}</td>)}
                    <td className="p-4"><div className="flex justify-end gap-1">
                      {onView && <button type="button" onClick={() => onView(row)} className="p-2 rounded-lg hover:bg-white/10"><Eye size={14} /></button>}
                      {onEdit && <button type="button" onClick={() => onEdit(row)} className="p-2 rounded-lg hover:bg-[#00C2A8]/20 text-[#00C2A8]"><Edit2 size={14} /></button>}
                      {onArchive && <button type="button" onClick={() => onArchive(row)} className="p-2 rounded-lg hover:bg-[#FFB800]/20 text-[#FFB800]"><Archive size={14} /></button>}
                      {onDelete && <button type="button" onClick={() => onDelete(row)} className="p-2 rounded-lg hover:bg-[#FF4444]/20 text-[#FF4444]"><Trash2 size={14} /></button>}
                    </div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageData.map((row) => (
              <div key={row.id} className="p-5 rounded-2xl border border-white/10 bg-[#071A1D]/50">
                {columns.slice(0, 3).map((c) => <div key={c.key} className="mb-2"><p className="text-[9px] uppercase text-[#89A9B0]">{c.label}</p><p className="text-sm text-white">{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}</p></div>)}
                {onEdit && <button type="button" onClick={() => onEdit(row)} className={btnGhost}>Edit</button>}
              </div>
            ))}
          </div>
        )}

        <div className="p-4 flex justify-between text-xs text-[#89A9B0] border-t border-white/5">
          <span>{page * PAGE + 1}–{Math.min((page + 1) * PAGE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-2">
            <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="p-2 rounded-lg disabled:opacity-30"><ChevronLeft size={16} /></button>
            <span className="text-[#00FFD5] font-mono">{page + 1}/{totalPages}</span>
            <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="p-2 rounded-lg disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
