
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../contexts/LanguageContext';

interface Column {
  key: string;
  label: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface TableModuleProps {
  title: string;
  subtitle: string;
  data: any[];
  columns: Column[];
  onAddClick?: () => void;
  onEditClick?: (row: any) => void;
  onTrashClick?: (row: any) => void;
  entityName: string;
}

export const TableModule: React.FC<TableModuleProps> = ({ 
  title, 
  subtitle, 
  data, 
  columns, 
  onAddClick, 
  onEditClick,
  onTrashClick,
  entityName 
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.id || item.name));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-2">
        <span>{t('Admin')}</span>
        <ChevronRight size={10} />
        <span className="text-purple-400">{t(entityName)}</span>
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">
            {t('Manage')} <span className="font-bold text-purple-500">{t(title)}</span>
          </h1>
          <p className="text-white/40 text-sm tracking-widest font-light">{t(subtitle)}</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs tracking-widest uppercase hover:bg-white/10 transition-all">
            <Download size={16} />
            <span>{t('EXFIL DATA')}</span>
          </button>
          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 text-white font-bold text-xs tracking-[0.2em] uppercase shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>{t('NEW')} {t(entityName).toUpperCase()}</span>
          </button>
        </div>
      </header>

      {/* Table Surface */}
      <div className="p-1 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
        {/* Toolbar */}
        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={t(`Search ${entityName.toLowerCase()} registry...`)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-medium text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-colors">
              <Filter size={18} />
            </button>
            <div className="w-[1px] h-6 bg-white/10 mx-2" />
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              {t('Showing')} {filteredData.length} {t('records')}
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-6">
                  <div 
                    onClick={toggleSelectAll}
                    className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all",
                      selectedItems.length === filteredData.length && selectedItems.length > 0 
                        ? "bg-purple-500 border-purple-500" 
                        : "bg-white/5 border-white/10"
                    )}
                  >
                    {selectedItems.length === filteredData.length && selectedItems.length > 0 && <Plus size={12} className="rotate-45" />}
                  </div>
                </th>
                {columns.map((col) => (
                  <th key={col.key} className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                    {t(col.label)}
                  </th>
                ))}
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
                <motion.tr 
                  key={row.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] group transition-colors"
                >
                  <td className="p-6">
                    <div 
                      onClick={() => toggleSelect(row.id || row.name)}
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all",
                        selectedItems.includes(row.id || row.name)
                          ? "bg-purple-500 border-purple-500" 
                          : "bg-white/5 border-white/10"
                      )}
                    >
                      {selectedItems.includes(row.id || row.name) && <Plus size={12} className="rotate-45" />}
                    </div>
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-6">
                      <div className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">
                        {col.render ? col.render(row[col.key], row) : (typeof row[col.key] === 'string' ? t(row[col.key] as string) : row[col.key])}
                      </div>
                    </td>
                  ))}
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                      <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500 hover:text-white transition-all">
                         <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => onEditClick?.(row)}
                        className="p-2 rounded-lg bg-white/5 border border-white/5 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => onTrashClick?.(row)}
                        className="p-2 rounded-lg bg-white/5 border border-white/5 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                   <td colSpan={columns.length + 2} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                         <Search size={48} />
                         <p className="text-sm font-bold uppercase tracking-[0.3em]">{t('No Registry Entries Found')}</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{t('Page 1 of 12')}</span>
           </div>
           <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white disabled:opacity-20 transition-colors" disabled>
                 <ChevronLeft size={18} />
              </button>
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white transition-colors">
                 <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
