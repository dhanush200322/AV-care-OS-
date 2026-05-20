import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { 
  Building2, 
  Users, 
  Calendar, 
  CreditCard, 
  Clock, 
  LogOut, 
  Bell, 
  Search,
  Plus,
  ArrowRight,
  Radio
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const ReceptionDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { patients, invoices, notifications, broadcasts, sentWishes } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  const activeBroadcasts = broadcasts?.filter(b => b.audience === 'all' || b.audience === 'reception') || [];
  const incomingGreetings = sentWishes?.filter(w => w.wishType === 'Dashboard' && w.dashboardSource === 'Reception Dashboard') || [];

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* Mini Sidebar */}
      <aside className="w-20 border-r border-white/5 bg-white/[0.02] flex flex-col items-center py-8 gap-8">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
          <Building2 className="text-teal-400" size={24} />
        </div>
        <nav className="flex-1 flex flex-col gap-4">
          {[
            { id: 'overview', icon: Calendar },
            { id: 'patients', icon: Users },
            { id: 'billing', icon: CreditCard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "p-3 rounded-xl transition-all group relative",
                activeTab === item.id ? "bg-teal-500 text-white" : "text-white/20 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {activeTab === item.id && (
                <motion.div layoutId="active-nav" className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
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
              FLOW <span className="font-bold text-teal-500">MANAGER</span>
            </h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Client Service Terminal</p>
          </div>

          <div className="flex items-center gap-6 text-white">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-teal-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH REGISTRY..." 
                className="bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-[10px] w-64 focus:outline-none focus:border-teal-500/30 transition-all font-bold tracking-widest" 
              />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-white uppercase tracking-tight">Kiran Dev</p>
                <p className="text-[9px] font-black text-teal-500 uppercase tracking-widest">Chief of Admissions</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 p-[1px]">
                 <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-teal-400 font-black text-xs">KD</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">

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
                      className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-cyan-500/5 to-purple-500/10 border border-teal-500/30 flex items-start gap-4 shadow-lg shadow-teal-950/20 relative overflow-hidden group"
                   >
                      <div className="absolute right-4 top-4 text-[8px] font-mono text-white/30 truncate">
                         {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 flex-shrink-0 animate-pulse">
                         <Radio size={18} />
                      </div>
                      <div className="flex-1 min-w-0 pr-12">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-teal-500/20 text-teal-400 border border-teal-500/20">
                               {b.audience === 'all' ? "global transmission" : "admissions dispatch"}
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

           <div className="flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-[0.5em] text-white">DAILY OPERATIONS LOG</h2>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-teal-900/40 hover:scale-105 transition-all">
                 <Plus size={14} /> New Admission
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                 { label: 'Walk-ins', value: '18', icon: Users, color: 'text-teal-400' },
                 { label: 'Scheduled', value: '42', icon: Calendar, color: 'text-teal-400' },
                 { label: 'Pending Bills', value: invoices.filter(i => i.status === 'Pending').length, icon: CreditCard, color: 'text-yellow-500' },
                 { label: 'Wait Time', value: '12m', icon: Clock, color: 'text-teal-400' },
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
                 <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">PATIENT FLOW QUEUE</h2>
                 <div className="overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5">
                          <tr>
                             <th className="pb-4">Patient</th>
                             <th className="pb-4">Arrival</th>
                             <th className="pb-4">Assignee</th>
                             <th className="pb-4">Status</th>
                             <th className="pb-4 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="text-sm font-bold text-white">
                          {patients.map((p) => (
                             <tr key={p.id} className="group hover:bg-white/[0.02] transition-all">
                                <td className="py-5">
                                   <p className="uppercase tracking-tight">{p.name}</p>
                                   <p className="text-[9px] text-white/20 font-black tracking-widest">{p.id}</p>
                                </td>
                                <td className="py-5 text-white/40 font-light">10:24 AM</td>
                                <td className="py-5">DR. ANANYA</td>
                                <td className="py-5">
                                   <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-500 text-[9px] font-black uppercase tracking-widest border border-teal-500/20">Checked In</span>
                                </td>
                                <td className="py-5 text-right">
                                   <button className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/5 transition-all">
                                      <ArrowRight size={16} />
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex flex-col gap-6 text-white text-sm">
                 <h2 className="text-xs font-black text-white/20 uppercase tracking-[0.4em]">BILLING PROTOCOLS</h2>
                 <div className="space-y-4">
                    {invoices.map((inv) => (
                       <div key={inv.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3 group hover:bg-white/5 transition-all">
                          <div className="flex justify-between items-center">
                             <span className="text-[9px] font-black uppercase tracking-widest text-teal-400">{inv.id}</span>
                             <span className={cn(
                               "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                               inv.status === 'Paid' ? "bg-teal-500/20 text-teal-400" : "bg-red-500/20 text-red-400"
                             )}>{inv.status}</span>
                          </div>
                          <p className="font-bold uppercase tracking-tight">{inv.patient}</p>
                          <div className="flex justify-between items-center pt-2 border-t border-white/5">
                             <span className="text-lg font-light">₹{inv.amount.toLocaleString()}</span>
                             <button className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-teal-400 transition-colors">Generate PDF</button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Global Glow */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};
