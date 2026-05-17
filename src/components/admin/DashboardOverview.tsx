
import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Stethoscope, 
  Siren, 
  Calendar, 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  ExternalLink,
  Cake,
  SendHorizontal,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';
import { ADMIN_STATS, ACTIVITY_FEED, CHART_DATA, BIRTHDAYS, BRANCHES_DATA } from '../../constants/mockData';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

const iconMap: any = {
  Users, Stethoscope, Siren, Calendar, Building2
};

export const DashboardOverview: React.FC = () => {
  const { invoices, patients } = useStore();
  
  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  // Dynamic stats calculation
  const dynamicStats = ADMIN_STATS.map(stat => {
    if (stat.title === 'Pending Billing') {
      const pendingCount = invoices.filter(i => i.status === 'Pending').length;
      return { ...stat, value: pendingCount.toString() };
    }
    if (stat.title === 'Total Patients') {
      return { ...stat, value: patients.length.toLocaleString() };
    }
    return stat;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-2">
        <span>Admin</span>
        <ChevronRight size={10} />
        <span className="text-purple-400">Dashboard</span>
      </div>

      <header>
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">
          Systems <span className="font-bold text-purple-500">Overview</span>
        </h1>
        <p className="text-white/40 text-sm tracking-widest font-light">
          Operational status and real-time biometric feed from <span className="text-white/60">AV CARE CORE</span>.
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {dynamicStats.map((stat, i) => {
          const Icon = iconMap[stat.icon];
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden flex flex-col justify-between h-40 shadow-xl"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20" 
                   style={{ background: `linear-gradient(to bottom right, ${stat.color}, transparent)` }} />
              
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black tracking-widest uppercase",
                  stat.status === 'up' ? 'text-emerald-400' : stat.status === 'down' ? 'text-red-400' : 'text-slate-500'
                )}>
                  {stat.trend !== '0' && (stat.status === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
                  {stat.trend}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">{stat.title}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
        {/* Extra Premium Card for Revenue/Billing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-[24px] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group relative overflow-hidden flex flex-col justify-between h-40 shadow-xl"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-emerald-400">
              <CreditCard size={20} />
            </div>
            <div className="text-[10px] font-black tracking-widest uppercase text-emerald-400">
              Target 102%
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">MTD Revenue</p>
            <p className="text-2xl font-black text-white">₹{(totalRevenue / 1000000).toFixed(1)}M</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Biometric Traffic</h3>
                <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Patient influx comparison (7 days)</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Influx</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Resolved</span>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C3BFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6C3BFF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="patients" stroke="#6C3BFF" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                  <Area type="monotone" dataKey="cases" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 flex flex-col gap-8 shadow-xl">
                <div className="flex items-center justify-between">
                   <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Node Load Protocol</h3>
                      <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Branch patient distribution</p>
                   </div>
                   <TrendingUp className="text-purple-400" size={20} />
                </div>
                <div className="h-[200px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={BRANCHES_DATA}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                         <XAxis 
                           dataKey="name" 
                           axisLine={false} 
                           tickLine={false} 
                           hide
                         />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                            itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                         />
                         <Bar dataKey="patients" radius={[10, 10, 0, 0]}>
                            {BRANCHES_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#6C3BFF' : '#3B82F6'} opacity={0.8} />
                            ))}
                         </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white tracking-tight">Live Pulse</h3>
                  <button className="text-[10px] font-black uppercase text-purple-400 hover:text-purple-300 tracking-widest flex items-center gap-1 group transition-colors">
                    FULL LOGS <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="space-y-4">
                  {ACTIVITY_FEED.map((item) => (
                    <div key={item.id} className="flex gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-colors">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border border-white/5",
                        item.type === 'emergency' ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'
                      )}>
                        <Siren size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{item.user}</span>
                          <span className="text-[9px] text-white/20 font-bold uppercase">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed font-medium">{item.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             {/* Birthday Reminder Placeholder */}
             <div className="p-8 rounded-[32px] bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border border-purple-500/20 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Cake size={120} className="rotate-12" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Unit Birthdays <span className="text-[14px]">🎉</span>
                  </h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">Today's Celebrations</p>
                </div>
                <div className="space-y-4 mt-2">
                  {BIRTHDAYS.map((bday, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group">
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-wider">{bday.name}</p>
                        <p className="text-[9px] text-purple-400/80 font-bold uppercase tracking-widest">{bday.role} DEPT</p>
                      </div>
                      <button className="p-3 rounded-full bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95">
                        <SendHorizontal size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-4 flex flex-col gap-1 items-center justify-center text-center">
                  <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">Pulse-Check</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-500/30" />)}
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Sidebar Mini List */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Active Branches</h3>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Protocol Status</p>
                </div>
                <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                  <ExternalLink size={18} />
                </button>
              </div>
              <div className="space-y-4">
                {BRANCHES_DATA.map((branch) => (
                  <div key={branch.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-white group-hover:text-purple-400 transition-colors">{branch.name}</span>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        branch.status === 'Operational' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'
                      )} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                       <span>{branch.doctors} Doctors</span>
                       <div className="w-1 h-1 rounded-full bg-white/10" />
                       <span>{branch.patients} Active</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 rounded-2xl bg-purple-500 text-white font-black text-[10px] tracking-[0.4em] uppercase shadow-lg shadow-purple-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                + ADD NEW FACILITY
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
