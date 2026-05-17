import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { 
  Shield, 
  Eye, 
  Lock, 
  AlertTriangle, 
  MapPin, 
  LogOut, 
  Bell, 
  Search,
  Activity,
  UserCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const SecurityDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { notifications } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* Mini Sidebar */}
      <aside className="w-20 border-r border-white/5 bg-white/[0.02] flex flex-col items-center py-8 gap-8">
        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
          <Shield className="text-red-500" size={24} />
        </div>
        <nav className="flex-1 flex flex-col gap-4">
          {[
            { id: 'overview', icon: Eye },
            { id: 'access', icon: Lock },
            { id: 'incidents', icon: AlertTriangle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "p-3 rounded-xl transition-all group relative",
                activeTab === item.id ? "bg-red-600 text-white" : "text-white/20 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {activeTab === item.id && (
                <motion.div layoutId="active-nav" className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-600 rounded-r-full" />
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
              AEGIS <span className="font-bold text-red-500">GRID</span>
            </h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Facility Protection Terminal</p>
          </div>

          <div className="flex items-center gap-6 text-white">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="PROXIMITY SEARCH..." 
                className="bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-[10px] w-64 focus:outline-none focus:border-red-500/30 transition-all font-bold tracking-widest" 
              />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-white uppercase tracking-tight">Sgt. Vikram</p>
                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Watch Commander</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 p-[1px]">
                 <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-red-400 font-black text-xs">SV</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8 text-white">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                 { label: 'Personnel Onsite', value: '1,242', icon: UserCheck, color: 'text-red-400' },
                 { label: 'Active Sensors', value: '402', icon: Activity, color: 'text-red-400' },
                 { label: 'Red Alerts', value: '0', icon: AlertTriangle, color: 'text-emerald-500' },
                 { label: 'Secured Zones', value: '18', icon: Lock, color: 'text-red-400' },
              ].map((stat, i) => (
                 <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{stat.label}</p>
                       <stat.icon className={stat.color} size={16} />
                    </div>
                    <p className="text-3xl font-light text-white">{stat.value}</p>
                 </div>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex flex-col gap-6">
                 <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">LIVE PERIMETER FEED</h2>
                 <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                       <div key={i} className="aspect-video rounded-2xl bg-black border border-white/5 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                             <span className="text-[8px] font-black tracking-widest text-white/60 uppercase text-white">CAM 0{i} - SECTOR B</span>
                          </div>
                          <div className="absolute bottom-4 right-4 text-[8px] font-mono text-white/20">
                             {new Date().toLocaleTimeString()}
                          </div>
                          <div className="w-full h-full flex items-center justify-center">
                             <Eye size={24} className="text-white/5 group-hover:text-red-500/20 transition-colors" />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex flex-col gap-6 text-white text-sm">
                 <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">ACCESS LOGS</h2>
                 <div className="space-y-4">
                    {[
                       { id: 'LOG-4421', user: 'Dr. Satish K.', action: 'Authorized Entry', zone: 'Cardiology ICU', time: '2m ago' },
                       { id: 'LOG-4420', user: 'Ananya S.', action: 'Authorized Exit', zone: 'Pathology Lab', time: '8m ago' },
                       { id: 'LOG-4419', user: 'Unknown Device', action: 'Scan Attempt', zone: 'Neural Core', time: '12m ago', alert: true },
                       { id: 'LOG-4418', user: 'Officer Dev', action: 'Shift Rotation', zone: 'Lobby A', time: '15m ago' },
                    ].map((log) => (
                       <div key={log.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                log.alert ? "bg-red-500/20 text-red-500" : "bg-white/5 text-white/40"
                             )}>
                                <MapPin size={16} />
                             </div>
                             <div>
                                <p className="font-bold uppercase tracking-tight">{log.user}</p>
                                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">{log.action} • {log.zone}</p>
                             </div>
                          </div>
                          <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">{log.time}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Global Glow */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};
