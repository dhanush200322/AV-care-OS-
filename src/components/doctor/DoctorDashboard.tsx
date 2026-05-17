import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  Activity, 
  Clock, 
  LogOut, 
  Bell, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const DoctorDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { patients, labReports, notifications } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* Mini Sidebar */}
      <aside className="w-20 border-r border-white/5 bg-white/[0.02] flex flex-col items-center py-8 gap-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
          <Stethoscope className="text-emerald-400" size={24} />
        </div>
        <nav className="flex-1 flex flex-col gap-4">
          {[
            { id: 'overview', icon: Activity },
            { id: 'patients', icon: Users },
            { id: 'schedule', icon: Calendar },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "p-3 rounded-xl transition-all group relative",
                activeTab === item.id ? "bg-emerald-500 text-white" : "text-white/20 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {activeTab === item.id && (
                <motion.div layoutId="active-nav" className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="p-3 rounded-xl text-white/20 hover:bg-red-500/10 hover:text-red-500 transition-all">
          <LogOut size={20} />
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.01]">
          <div>
            <h1 className="text-xl font-light tracking-tight text-white uppercase">
              VITAL <span className="font-bold text-emerald-500">CORE</span>
            </h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Clinical Command & Control</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH PATIENT ARCHIVES..." 
                className="bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-[10px] w-64 focus:outline-none focus:border-emerald-500/30 transition-all font-bold tracking-widest" 
              />
            </div>
            <button className="relative p-2 text-white/40 hover:text-white transition-colors">
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-950" />
              )}
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-white uppercase tracking-tight">Dr. Satish K.</p>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Senior Cardiologist</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-[1px]">
                 <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-emerald-400 font-black text-xs">SK</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Cases</p>
                    <Activity className="text-emerald-500" size={16} />
                 </div>
                 <p className="text-3xl font-light text-white">42</p>
                 <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500">
                    <CheckCircle2 size={12} />
                    <span>8 TRANSFERRED TODAY</span>
                 </div>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Pending Clearances</p>
                    <Clock className="text-yellow-500" size={16} />
                 </div>
                 <p className="text-3xl font-light text-white">{labReports.filter(r => r.status === 'Pending').length}</p>
                 <div className="flex items-center gap-2 text-[9px] font-black text-white/20">
                    <AlertCircle size={12} />
                    <span>3 URGENT REVIEWS</span>
                 </div>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Scheduled Rounds</p>
                    <Calendar className="text-emerald-500" size={16} />
                 </div>
                 <p className="text-3xl font-light text-white">12</p>
                 <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span>NEXT ROUND IN 15M</span>
                 </div>
              </div>
           </div>

           {/* Patients List (Placeholder style) */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex flex-col gap-6">
                 <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">PRIORITY WARD REVIEWS</h2>
                 <div className="space-y-4">
                    {patients.slice(0, 4).map((p) => (
                       <div key={p.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black",
                               p.condition === 'Critical' ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-400"
                             )}>
                                {p.id.split('-')[1]}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-white uppercase tracking-tight">{p.name}</p>
                                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">{p.ward} • {p.condition}</p>
                             </div>
                          </div>
                          <button className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                             View Charts
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex flex-col gap-6 text-white text-sm">
                 <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">LAB ANALYTICS FEED</h2>
                 <div className="space-y-4">
                    {labReports.map((r) => (
                       <div key={r.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                          <div className="flex flex-col gap-1">
                             <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{r.id}</p>
                             <p className="text-sm font-bold text-white uppercase tracking-tight">{r.test}</p>
                             <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">FOR: {r.patient}</p>
                          </div>
                          <div className={cn(
                             "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]",
                             r.status === 'Completed' ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/20"
                          )}>
                             {r.status}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Global Glow */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};
