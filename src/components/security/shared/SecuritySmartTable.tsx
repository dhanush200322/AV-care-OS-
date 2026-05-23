import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Archive, Eye, Sparkles, LayoutGrid, List } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { btnGhost, btnPrimary, glassPanel } from '../theme';
import { SecurityEmptyState } from './SecurityEmptyState';

export interface SecColumn<T> { key: string; label: string; render?: (row: T) => React.ReactNode; }

interface Props<T extends { id: string }> {
  title: string; subtitle: string; entityName: string; data: T[]; columns: SecColumn<T>[];
  onAdd?: () => void; onEdit?: (r: T) => void; onView?: (r: T) => void; onDelete?: (r: T) => void; onArchive?: (r: T) => void;
  onBulkDelete?: (ids: string[]) => void; aiFilterHint?: string;
}

const PAGE = 8;

export function SecuritySmartTable<T extends { id: string }>({ title, subtitle, entityName, data, columns, onAdd, onEdit, onView, onDelete, onArchive, onBulkDelete, aiFilterHint }: Props<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [aiOn, setAiOn] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filtered = useMemo(() => {
    let rows = data.filter((r) => Object.values(r as object).some((v) => String(v).toLowerCase().includes(search.toLowerCase())));
    if (aiOn && aiFilterHint) rows = rows.slice(0, Math.max(1, Math.ceil(rows.length * 0.6)));
    return rows;
  }, [data, search, aiOn, aiFilterHint]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageData = filtered.slice(page * PAGE, (page + 1) * PAGE);

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#00C2E0]/60 mb-2 font-mono">SEC-OPS</p>
          <h1 className="text-3xl font-light text-white">{title} <span className="font-bold text-[#00E5FF]">{entityName}</span></h1>
          <p className="text-sm text-[#7F95B2] mt-2">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className={btnGhost}><Download size={14} />Export</button>
          {onAdd && <button type="button" onClick={onAdd} className={btnPrimary}><Plus size={16} />Add</button>}
        </div>
      </header>
      <div className={cn(glassPanel, 'overflow-hidden border-[#00C2E0]/10')}>
        <div className="p-4 flex gap-3 border-b border-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7F95B2]" size={16} />
            <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder={`Search ${entityName}…`} className="w-full bg-[#050D14]/80 border border-white/10 rounded-xl py-2.5 pl-11 text-sm text-white focus:border-[#00C2E0]/40 focus:outline-none" />
          </div>
          {aiFilterHint && <button type="button" onClick={() => setAiOn(!aiOn)} className={cn(btnGhost, aiOn && 'border-[#00E5FF]/40 text-[#00E5FF]')}><Sparkles size={14} />AI</button>}
          <button type="button" onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')} className={btnGhost}>{viewMode === 'table' ? <LayoutGrid size={14} /> : <List size={14} />}</button>
        </div>
        {selected.length > 0 && onBulkDelete && (
          <div className="px-4 py-2 bg-[#FF4444]/10 border-b border-[#FF4444]/20 flex justify-between text-xs"><span className="text-[#FF4444]">{selected.length} selected</span><button type="button" onClick={() => { onBulkDelete(selected); setSelected([]); }} className="text-[#FF4444] font-bold">Bulk Delete</button></div>
        )}
        {filtered.length === 0 ? (
          <div className="p-8"><SecurityEmptyState title={`No ${entityName}`} description="Create a new record." onAction={onAdd} /></div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead><tr className="border-b border-white/5">
                <th className="p-4 w-10"><input type="checkbox" checked={selected.length === pageData.length && pageData.length > 0} onChange={() => setSelected(selected.length === pageData.length ? [] : pageData.map((r) => r.id))} /></th>
                {columns.map((c) => <th key={c.key} className="p-4 text-[10px] font-black uppercase text-[#7F95B2] tracking-wider">{c.label}</th>)}
                <th className="p-4 text-right text-[10px] uppercase text-[#7F95B2]">Ops</th>
              </tr></thead>
              <tbody>
                {pageData.map((row, i) => (
                  <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-white/5 hover:bg-[#00C2E0]/5 group">
                    <td className="p-4"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => setSelected((s) => s.includes(row.id) ? s.filter((x) => x !== row.id) : [...s, row.id])} /></td>
                    {columns.map((c) => <td key={c.key} className="p-4 text-white/90">{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '—')}</td>)}
                    <td className="p-4"><div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100">
                      {onView && <button type="button" onClick={() => onView(row)} className="p-2 hover:bg-white/10 rounded"><Eye size={14} /></button>}
                      {onEdit && <button type="button" onClick={() => onEdit(row)} className="p-2 hover:bg-[#00C2E0]/20 text-[#00E5FF] rounded"><Edit2 size={14} /></button>}
                      {onArchive && <button type="button" onClick={() => onArchive(row)} className="p-2 hover:bg-[#FFB800]/20 text-[#FFB800] rounded"><Archive size={14} /></button>}
                      {onDelete && <button type="button" onClick={() => onDelete(row)} className="p-2 hover:bg-[#FF4444]/20 text-[#FF4444] rounded"><Trash2 size={14} /></button>}
                    </div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageData.map((row) => (
              <div key={row.id} className="p-4 rounded-xl border border-white/10 bg-[#050D14]/60">
                {columns.slice(0, 3).map((c) => <div key={c.key} className="mb-2"><p className="text-[9px] uppercase text-[#7F95B2]">{c.label}</p><p className="text-sm text-white">{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}</p></div>)}
                {onEdit && <button type="button" onClick={() => onEdit(row)} className={btnGhost}>Edit</button>}
              </div>
            ))}
          </div>
        )}
        <div className="p-4 flex justify-between text-xs text-[#7F95B2] border-t border-white/5 font-mono">
          <span>{page * PAGE + 1}–{Math.min((page + 1) * PAGE, filtered.length)} / {filtered.length}</span>
          <div className="flex gap-2">
            <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="p-2 disabled:opacity-30"><ChevronLeft size={16} /></button>
            <span className="text-[#00E5FF]">{page + 1}/{totalPages}</span>
            <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="p-2 disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
