
import React, { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  Users
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { EmptyState } from './EmptyState';

export const PatientFlowKanban: React.FC = () => {
  const { patients } = useStore();
  
  if (patients.length === 0) {
    return <EmptyState title="No Patient Flow" description="Admit patients to see their real-time transitions across the hospital." icon={Users} />;
  }

  // Simulated columns
  const [columns, setColumns] = useState({
    waiting: patients.slice(0, 5),
    consultation: patients.slice(5, 8),
    completed: patients.slice(8, 12),
  });

  const getStatusColor = (condition: string) => {
    switch (condition) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Stable': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/30 font-black mb-2">
            <span>Admin</span>
            <ChevronRight size={10} />
            <span className="text-purple-400">Tactical</span>
            <ChevronRight size={10} />
            <span className="text-white/60">Queue Flow</span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">
            Interactive <span className="font-bold text-purple-500">Flow Control</span>
          </h1>
          <p className="text-white/40 text-sm tracking-widest font-light">Real-time throughput management and priority overrides.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="Filter by UUID or Name..." 
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs text-white w-[300px] focus:outline-none focus:border-purple-500/50 transition-all font-mono uppercase" 
            />
          </div>
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[calc(100vh-350px)]">
        {Object.entries(columns).map(([id, items]) => (
          <div key={id} className="flex flex-col gap-6">
             <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">{id}</h3>
                   <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400">{items.length}</span>
                </div>
                <button className="text-white/20 hover:text-white"><MoreHorizontal size={16} /></button>
             </div>

             <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[32px] p-4 flex flex-col gap-4 overflow-y-auto no-scrollbar scroll-smooth">
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                    <Clock size={40} />
                    <p className="text-[10px] font-black uppercase tracking-widest mt-4">Queue Empty</p>
                  </div>
                ) : (
                  items.map((patient, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={patient.id}
                      className="p-5 rounded-2xl bg-slate-900 border border-white/5 hover:border-purple-500/30 cursor-grab active:cursor-grabbing transition-all group"
                    >
                       <div className="flex justify-between items-start mb-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                            getStatusColor(patient.condition)
                          )}>
                            {patient.condition}
                          </span>
                          <span className="text-[9px] font-mono text-white/20">#{patient.id.slice(0, 8)}</span>
                       </div>
                       <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight group-hover:text-purple-400 transition-colors">{patient.name}</p>
                       <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{patient.ward} • AGE {patient.age}</p>
                       
                       <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <Clock size={12} className="text-white/20" />
                             <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Wait: {Math.floor(Math.random() * 20) + 5}m</span>
                          </div>
                          {patient.condition === 'Critical' && (
                            <AlertCircle size={14} className="text-red-500 animate-pulse" />
                          )}
                       </div>
                    </motion.div>
                  ))
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
