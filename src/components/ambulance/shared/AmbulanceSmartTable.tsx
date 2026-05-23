import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Download, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Archive, Eye, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { btnGhost, btnPrimary, glassPanel } from '../theme';

export interface AmbColumn<T> { key: string; label: string; render?: (row: T) => React.ReactNode; }

export function AmbulanceSmartTable<T extends { id: string }>({ title, subtitle, entityName, data, columns, onAdd, onEdit, onView, onDelete, onArchive, aiFilterHint }: {
  title: string; subtitle: string; entityName: string; data: T[]; columns: AmbColumn<T>[];
  onAdd?: () => void; onEdit?: (r: T) => void; onView?: (r: T) => void; onDelete?: (r: T) => void; onArchive?: (r: T) => void; aiFilterHint?: string;
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [aiOn, setAiOn] = useState(false);
  const PAGE = 8;
  const filtered = useMemo(() => {
    let rows = data.filter((r) => Object.values(r as object).some((v) => String(v).toLowerCase().includes(search.toLowerCase())));
    if (aiOn && aiFilterHint) rows = rows.slice(0, Math.max(1, Math.ceil(rows.length * 0.65)));
    return rows;
  }, [data, search, aiOn, aiFilterHint]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageData = filtered.slice(page * PAGE, (page + 1) * PAGE);

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#FFA63D]/70 font-mono">EMS-OPS</p><h1 className="text-3xl font-light text-white">{title} <span className="font-bold text-[#FFA63D]">{entityName}</span></h1><p className="text-sm text-[#B8A28F] mt-2">{subtitle}</p></div>
        <div className="flex gap-2"><button type="button" className={btnGhost}><Download size={14} />Export</button>{onAdd && <button type="button" onClick={onAdd} className={btnPrimary}><Plus size={16} />Add</button>}</div>
      </header>
      <div className={cn(glassPanel, 'overflow-hidden')}>
        <div className="p-4 flex gap-3 border-b border-white/5">
          <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A28F]" size={16} /><input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="w-full bg-[#140B05]/80 border border-white/10 rounded-xl py-2.5 pl-11 text-sm text-white focus:border-[#FF7A00]/40 focus:outline-none" /></div>
          {aiFilterHint && <button type="button" onClick={() => setAiOn(!aiOn)} className={cn(btnGhost, aiOn && 'border-[#FFA63D]/40 text-[#FFA63D]')}><Sparkles size={14} />AI</button>}
        </div>
        {filtered.length === 0 ? <p className="p-12 text-center text-[#B8A28F]">No records</p> : (
          <div className="overflow-x-auto"><table className="w-full text-left font-mono text-sm"><thead><tr className="border-b border-white/5">{columns.map((c) => <th key={c.key} className="p-4 text-[10px] uppercase text-[#B8A28F]">{c.label}</th>)}<th className="p-4 text-right text-[10px] uppercase text-[#B8A28F]">Ops</th></tr></thead><tbody>{pageData.map((row, i) => (
            <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-white/5 hover:bg-[#FF7A00]/5">
              {columns.map((c) => <td key={c.key} className="p-4 text-white/90">{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '—')}</td>)}
              <td className="p-4"><div className="flex justify-end gap-1">{onView && <button type="button" onClick={() => onView(row)} className="p-2 hover:bg-white/10 rounded"><Eye size={14} /></button>}{onEdit && <button type="button" onClick={() => onEdit(row)} className="p-2 text-[#FFA63D] hover:bg-[#FF7A00]/20 rounded"><Edit2 size={14} /></button>}{onArchive && <button type="button" onClick={() => onArchive(row)} className="p-2 text-[#FFC857] rounded"><Archive size={14} /></button>}{onDelete && <button type="button" onClick={() => onDelete(row)} className="p-2 text-[#FF4444] rounded"><Trash2 size={14} /></button>}</div></td>
            </motion.tr>
          ))}</tbody></table></div>
        )}
        <div className="p-4 flex justify-between text-xs text-[#B8A28F] font-mono border-t border-white/5">
          <span>{page * PAGE + 1}–{Math.min((page + 1) * PAGE, filtered.length)} / {filtered.length}</span>
          <div className="flex gap-2"><button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={16} /></button><span className="text-[#FFA63D]">{page + 1}/{totalPages}</span><button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></button></div>
        </div>
      </div>
    </div>
  );
}
