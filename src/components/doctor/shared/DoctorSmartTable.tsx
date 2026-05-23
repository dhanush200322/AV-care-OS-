import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Archive,
  Eye,
  Sparkles,
  LayoutGrid,
  List,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { btnGhost, btnPrimary, glassPanel } from '../theme';
import { DoctorEmptyState } from './DoctorEmptyState';

export interface DoctorColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DoctorSmartTableProps<T extends { id: string }> {
  title: string;
  subtitle: string;
  entityName: string;
  data: T[];
  columns: DoctorColumn<T>[];
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  onDelete?: (row: T) => void;
  onArchive?: (row: T) => void;
  onBulkDelete?: (ids: string[]) => void;
  loading?: boolean;
  aiFilterHint?: string;
}

const PAGE_SIZE = 8;

export function DoctorSmartTable<T extends { id: string }>({
  title,
  subtitle,
  entityName,
  data,
  columns,
  onAdd,
  onEdit,
  onView,
  onDelete,
  onArchive,
  onBulkDelete,
  loading,
  aiFilterHint,
}: DoctorSmartTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [aiFilterOn, setAiFilterOn] = useState(false);

  const filtered = useMemo(() => {
    let rows = data.filter((row) =>
      Object.values(row as object).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    );
    if (aiFilterOn && aiFilterHint) {
      rows = rows.slice(0, Math.max(1, Math.ceil(rows.length * 0.6)));
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortKey] ?? '');
        const bv = String((b as Record<string, unknown>)[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [data, search, sortKey, sortDir, aiFilterOn, aiFilterHint]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleAll = () => {
    if (selected.length === pageData.length) setSelected([]);
    else setSelected(pageData.map((r) => r.id));
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-[#0D2818]/80 border border-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#00D68F]/60 mb-2">
            Clinical Operations
          </p>
          <h1 className="text-3xl font-light text-white tracking-tight">
            {title}{' '}
            <span className="font-bold bg-gradient-to-r from-[#00D68F] to-[#00FFA3] bg-clip-text text-transparent">
              {entityName}
            </span>
          </h1>
          <p className="text-sm text-[#8AA39B] mt-2">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={btnGhost}>
            <Download size={14} />
            Export
          </button>
          {onAdd && (
            <button type="button" onClick={onAdd} className={btnPrimary}>
              <Plus size={16} />
              Add {entityName}
            </button>
          )}
        </div>
      </header>

      <div className={cn(glassPanel, 'overflow-hidden')}>
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-white/5">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8AA39B] group-focus-within:text-[#00FFA3]" size={16} />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder={`Search ${entityName.toLowerCase()}…`}
              className="w-full bg-[#071B11]/60 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-[#8AA39B]/40 focus:outline-none focus:border-[#00D68F]/40"
              aria-label={`Search ${entityName}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className={btnGhost} aria-label="Filters">
              <Filter size={14} />
            </button>
            {aiFilterHint && (
              <button
                type="button"
                onClick={() => setAiFilterOn(!aiFilterOn)}
                className={cn(
                  btnGhost,
                  aiFilterOn && 'border-[#00FFA3]/40 text-[#00FFA3] bg-[#00D68F]/10'
                )}
              >
                <Sparkles size={14} />
                AI Filter
              </button>
            )}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className={btnGhost}
              aria-label="Toggle view"
            >
              {viewMode === 'table' ? <LayoutGrid size={14} /> : <List size={14} />}
            </button>
          </div>
        </div>

        {selected.length > 0 && onBulkDelete && (
          <div className="px-4 py-2 bg-[#00D68F]/10 border-b border-[#00D68F]/20 flex items-center justify-between">
            <span className="text-xs text-[#00FFA3] font-bold">{selected.length} selected</span>
            <button
              type="button"
              onClick={() => {
                onBulkDelete(selected);
                setSelected([]);
              }}
              className="text-xs text-[#FF4444] font-bold uppercase tracking-wider hover:underline"
            >
              Bulk Delete
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="p-8">
            <DoctorEmptyState
              title={`No ${entityName} records`}
              description={`Create your first ${entityName.toLowerCase()} to begin clinical workflows.`}
              onAction={onAdd}
            />
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 w-12">
                    <input
                      type="checkbox"
                      checked={selected.length === pageData.length && pageData.length > 0}
                      onChange={toggleAll}
                      className="rounded border-white/20"
                      aria-label="Select all"
                    />
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="p-4 text-[10px] font-black uppercase tracking-widest text-[#8AA39B] cursor-pointer hover:text-[#00FFA3]"
                      onClick={() => col.sortable !== false && toggleSort(col.key)}
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-[#8AA39B]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, idx) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-white/5 hover:bg-[#00D68F]/5 transition-colors group"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() =>
                          setSelected((s) =>
                            s.includes(row.id) ? s.filter((i) => i !== row.id) : [...s, row.id]
                          )
                        }
                        className="rounded border-white/20"
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="p-4 text-sm text-white/90">
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                      </td>
                    ))}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100">
                        {onView && (
                          <button type="button" onClick={() => onView(row)} className="p-2 rounded-lg hover:bg-white/10 text-[#8AA39B] hover:text-white" aria-label="View">
                            <Eye size={14} />
                          </button>
                        )}
                        {onEdit && (
                          <button type="button" onClick={() => onEdit(row)} className="p-2 rounded-lg hover:bg-[#00D68F]/20 text-[#00D68F]" aria-label="Edit">
                            <Edit2 size={14} />
                          </button>
                        )}
                        {onArchive && (
                          <button type="button" onClick={() => onArchive(row)} className="p-2 rounded-lg hover:bg-[#FFB800]/20 text-[#FFB800]" aria-label="Archive">
                            <Archive size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button type="button" onClick={() => onDelete(row)} className="p-2 rounded-lg hover:bg-[#FF4444]/20 text-[#FF4444]" aria-label="Delete">
                            <Trash2 size={14} />
                          </button>
                        )}
                        <button type="button" className="p-2 rounded-lg hover:bg-white/10 text-[#8AA39B]" aria-label="More">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageData.map((row) => (
              <div
                key={row.id}
                className="p-5 rounded-2xl border border-white/10 bg-[#071B11]/50 hover:border-[#00D68F]/30 transition-all"
              >
                {columns.slice(0, 3).map((col) => (
                  <div key={col.key} className="mb-2">
                    <p className="text-[9px] uppercase tracking-widest text-[#8AA39B]">{col.label}</p>
                    <p className="text-sm text-white font-medium">
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </p>
                  </div>
                ))}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                  {onEdit && (
                    <button type="button" onClick={() => onEdit(row)} className={btnGhost}>
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button type="button" onClick={() => onDelete(row)} className="text-xs text-[#FF4444]">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 flex items-center justify-between border-t border-white/5 text-xs text-[#8AA39B]">
          <span>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-lg disabled:opacity-30 hover:bg-white/10"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-[#00FFA3]">
              {page + 1}/{totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg disabled:opacity-30 hover:bg-white/10"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
