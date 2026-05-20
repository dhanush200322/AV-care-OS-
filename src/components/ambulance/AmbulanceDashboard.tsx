import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { 
  Ambulance, 
  MapPin, 
  Navigation, 
  Phone, 
  Siren, 
  LogOut, 
  Bell, 
  Search,
  Activity,
  ArrowRight,
  Radio
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const AmbulanceDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { notifications, broadcasts, sentWishes } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  const activeBroadcasts = broadcasts?.filter(b => b.audience === 'all' || b.audience === 'ambulance') || [];
  const incomingGreetings = sentWishes?.filter(w => w.wishType === 'Dashboard' && w.dashboardSource === 'Ambulance Dashboard') || [];

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-100 placeholder:text-white/10">
      {/* Mini Sidebar */}
      <aside className="w-20 border-r border-white/5 bg-white/[0.02] flex flex-col items-center py-8 gap-8">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
          <Ambulance className="text-orange-500" size={24} />
        </div>
        <nav className="flex-1 flex flex-col gap-4">
          {[
            { id: 'overview', icon: Siren },
            { id: 'dispatch', icon: Navigation },
            { id: 'contacts', icon: Phone },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "p-3 rounded-xl transition-all group relative",
                activeTab === item.id ? "bg-orange-600 text-white" : "text-white/20 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {activeTab === item.id && (
                <motion.div layoutId="active-nav" className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-600 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="p-3 rounded-xl text-white/20 hover:bg-red-500/10 hover:text-red-500 transition-all text-white">
          <LogOut size={20} />
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.01]">
          <div>
            <h1 className="text-xl font-light tracking-tight text-white uppercase">
              RAPID <span className="font-bold text-orange-500">PULSE</span>
            </h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Emergency Response Link</p>
          </div>

          <div className="flex items-center gap-6 text-white">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="GPS COORDINATES..." 
                className="bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-[10px] w-64 focus:outline-none focus:border-orange-500/30 transition-all font-bold tracking-widest" 
              />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-white uppercase tracking-tight">Paramedic John</p>
                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Unit 04 Commander</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 p-[1px]">
                 <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-orange-400 font-black text-xs">PJ</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8 text-white">

          {/* Incoming Birthday Greetings Console */}
          {incomingGreetings.length > 0 && (
             <div className="space-y-3">
               {incomingGreetings.map((g, idx) => (
                  <motion.div
                     key={idx}
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-indigo-500/5 to-cyan-500/10 border border-purple-500/30 flex items-start gap-4 shadow-xl shadow-purple-950/10 relative overflow-hidden group animate-pulse"
                  >
                     <div className="absolute right-4 top-4 text-[8px] font-mono text-purple-300 truncate font-black">
                        {g.timeSent || "LIVE"}
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                        🎉
                     </div>
                     <div className="flex-1 min-w-0 pr-12 text-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                           <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/20">
                              Birthday Greeting Broadcast
                           </span>
                           <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Sender: {g.senderName}</span>
                        </div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wide mb-1 select-none">
                           TO: <span className="text-purple-400 font-extrabold">{g.recipientName}</span> (Happy Birthday!)
                        </h4>
                        <p className="text-xs text-white/90 leading-relaxed italic font-semibold">"{g.content}"</p>
                     </div>
                  </motion.div>
               ))}
             </div>
          )}

          {/* Active Broadcast Alert Banner */}
          {activeBroadcasts.length > 0 && (
             <div className="space-y-3">
                {activeBroadcasts.map((b) => (
                   <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-purple-500/10 border border-orange-500/30 flex items-start gap-4 shadow-lg shadow-orange-950/20 relative overflow-hidden group"
                   >
                      <div className="absolute right-4 top-4 text-[8px] font-mono text-white/30 truncate">
                         {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0 animate-pulse">
                         <Radio size={18} />
                      </div>
                      <div className="flex-1 min-w-0 pr-12">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/20">
                               {b.audience === 'all' ? "global transmission" : "ems dispatch"}
                            </span>
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">AV Care Core Broadcast</span>
                         </div>
                         <h4 className="text-xs font-black text-white uppercase tracking-wide mb-1">{b.title}</h4>
                         <p className="text-xs text-white/80 font-semibold leading-relaxed">{b.message}</p>
                      </div>
                   </motion.div>
                ))}
             </div>
          )}

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                 { label: 'Units Active', value: '08', icon: Ambulance, color: 'text-orange-400' },
                 { label: 'Dispatch Pending', value: '01', icon: Siren, color: 'text-orange-400' },
                 { label: 'Avg Respond', value: '4m 12s', icon: Activity, color: 'text-emerald-500' },
                 { label: 'Fuel Status', value: '82%', icon: Navigation, color: 'text-orange-400' },
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

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex flex-col gap-6">
                 <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">DYNAMIC DISPATCH MAP</h2>
                 <div className="aspect-video rounded-3xl bg-slate-900 border border-white/5 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff22 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                       <MapPin size={48} className="text-red-500 animate-bounce" />
                       <div className="text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Active Emergency</p>
                          <p className="text-sm font-bold uppercase tracking-tight">Sector 4 - High Intensity Incident</p>
                       </div>
                       <button className="px-8 py-3 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-orange-900/40 hover:scale-105 transition-all mt-4">
                          Route Unit 04
                       </button>
                    </div>
                    {/* Decorative GPS data */}
                    <div className="absolute top-8 left-8 space-y-2 font-mono text-[8px] text-orange-500/50">
                       <p>LAT: 28.6139° N</p>
                       <p>LONG: 77.2090° E</p>
                       <p>ALT: 213M</p>
                    </div>
                 </div>
              </div>

              <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex flex-col gap-6 text-white text-sm">
                 <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">UNIT ASSIGNMENTS</h2>
                 <div className="space-y-4">
                    {[
                       { id: 'UNIT-01', status: 'En Route', ETA: '2m', color: 'text-orange-500' },
                       { id: 'UNIT-02', status: 'At Scene', ETA: 'N/A', color: 'text-red-500' },
                       { id: 'UNIT-03', status: 'Standby', ETA: 'N/A', color: 'text-emerald-500' },
                       { id: 'UNIT-04', status: 'Returning', ETA: '12m', color: 'text-white/20' },
                    ].map((unit) => (
                       <div key={unit.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <Ambulance size={18} className={unit.color} />
                             </div>
                             <div>
                                <p className="font-bold uppercase tracking-tight">{unit.id}</p>
                                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">DRIVE SYSTEM: {unit.status.toUpperCase()}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] font-black uppercase tracking-widest text-white/10">ETA</p>
                             <p className="text-xs font-bold text-orange-500">{unit.ETA}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Global Glow */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};
