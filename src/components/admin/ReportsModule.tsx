import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  Activity, 
  DollarSign, 
  ArrowUpRight,
  TrendingDown,
  Printer,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';
import { cn } from '../../lib/utils';

// Premium high density mock reports datasets
const MONTHLY_REVENUE_DATA = [
  { name: 'Jan', revenue: 1540000, overhead: 1200000, margin: 340000 },
  { name: 'Feb', revenue: 1680000, overhead: 1220000, margin: 460000 },
  { name: 'Mar', revenue: 1890000, overhead: 1250000, margin: 640000 },
  { name: 'Apr', revenue: 2040000, overhead: 1300000, margin: 740000 },
  { name: 'May', revenue: 2200000, overhead: 1320000, margin: 880000 },
  { name: 'Jun', revenue: 2150000, overhead: 1290000, margin: 860000 },
  { name: 'Jul', revenue: 2310000, overhead: 1340000, margin: 970000 },
];

const TRAFFIC_DATA = [
  { name: 'Mon', emergency: 54, OPD: 210, pharmacyInvoices: 180 },
  { name: 'Tue', emergency: 62, OPD: 245, pharmacyInvoices: 212 },
  { name: 'Wed', emergency: 48, OPD: 198, pharmacyInvoices: 165 },
  { name: 'Thu', emergency: 70, OPD: 280, pharmacyInvoices: 240 },
  { name: 'Fri', emergency: 65, OPD: 260, pharmacyInvoices: 220 },
  { name: 'Sat', emergency: 85, OPD: 140, pharmacyInvoices: 145 },
  { name: 'Sun', emergency: 95, OPD: 110, pharmacyInvoices: 120 },
];

const DEPARTMENT_TRAFFIC = [
  { name: 'Cardiology', count: 450 },
  { name: 'Pediatrics', count: 320 },
  { name: 'Neurology', count: 180 },
  { name: 'Orthopedics', count: 290 },
  { name: 'Oncology', count: 210 },
  { name: 'Gastro', count: 150 },
];

export const ReportsModule: React.FC = () => {
  const [timeline, setTimeline] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert("SLA PROTOCOL SECURE DISK: Compiling encrypted PDF telemetry sheet. Check your browser downloads directory shortly.");
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Headers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Diagnostic Analytics & Reporting Center</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Audit billing margin lines, departmental flow metrics, and emergency response performance.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Filter */}
          <div className="flex bg-slate-900/60 border border-white/5 rounded-xl p-1 shrink-0">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeline(t)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                  timeline === t 
                    ? "bg-purple-600/30 text-purple-300 border border-purple-500/20 shadow-sm"
                    : "text-white/30 hover:text-white/60"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <button 
            onClick={handlePrint}
            className="p-2.5 bg-slate-900/60 hover:bg-white/10 rounded-xl border border-white/10 text-white/60 hover:text-white transition-all"
            title="SLA hardcopy print link"
          >
            <Printer size={14} />
          </button>

          <button 
            onClick={handleExport}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 transition-all shrink-0"
          >
            <Download size={14} /> Download Ledger
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total gross revenues', value: '₹14.01M', trend: '+14% YoY', sign: true, color: 'text-emerald-400 border-emerald-500/20' },
          { label: 'Net margins accrued', value: '₹4.93M', trend: '+18%', sign: true, color: 'text-purple-400 border-purple-500/20' },
          { label: 'Bed occupancies', value: '82.4%', trend: 'SLA Limit Stable', sign: false, color: 'text-cyan-400 border-cyan-500/20' },
          { label: 'Avg medical costs', value: '₹18,450', trend: '-2.4% costs drop', sign: false, color: 'text-amber-400 border-amber-500/20' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-5 relative overflow-hidden">
            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{stat.label}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-black text-white tracking-tight">{stat.value}</h3>
              <span className={cn("text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-md border", stat.color)}>
                {stat.trend}
              </span>
            </div>
            {/* Background design accents */}
            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
              <TrendingUp size={48} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Revenue Ledger Dynamics</h3>
              <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-1">Cross comparison between gross billing & pharmaceutical procurement overheads.</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <div className="w-2 h-2 rounded-full bg-cyan-400" /> Gross Billing
              </div>
              <div className="flex items-center gap-1.5 text-purple-400">
                <div className="w-2 h-2 rounded-full bg-purple-400" /> Procurement Overhead
              </div>
            </div>
          </div>

          <div className="h-[280px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={MONTHLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorOverhead" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#A855F7" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                 <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                 <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} width={45} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#050816', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                   labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', fontStyle: 'normal' }}
                   itemStyle={{ color: '#fff', fontSize: '11px', textTransform: 'uppercase' }}
                 />
                 <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                 <Area type="monotone" dataKey="overhead" name="Overhead" stroke="#A855F7" strokeWidth={2} fillOpacity={1} fill="url(#colorOverhead)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic bar chart */}
        <div className="bg-slate-900/40 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6">
          <div className="mb-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">OPD Traffic Intensity</h3>
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-1">Monitored weekly ambulance admissions vs outpatient intake.</p>
          </div>

          <div className="h-[280px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={TRAFFIC_DATA}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                 <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                 <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} width={30} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#050816', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                   labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase' }}
                   itemStyle={{ color: '#fff', fontSize: '11px', textTransform: 'uppercase' }}
                 />
                 <Bar dataKey="OPD" name="Outpatients" fill="#A855F7" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="emergency" name="Trauma/ER" fill="#EC4899" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution (Horizontal Bars) */}
        <div className="bg-slate-900/40 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6 lg:col-span-1">
          <div className="mb-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Active Division Counts</h3>
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-1">Assures bed allocations across high density zones.</p>
          </div>

          <div className="space-y-4">
             {DEPARTMENT_TRAFFIC.map((dept, i) => {
               const maxVal = Math.max(...DEPARTMENT_TRAFFIC.map(d => d.count));
               const percent = (dept.count / maxVal) * 100;
               return (
                 <div key={i} className="space-y-1">
                   <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider">
                     <span className="text-white/60">{dept.name}</span>
                     <span className="text-white font-mono">{dept.count} consults</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       whileInView={{ width: `${percent}%` }}
                       viewport={{ once: true }}
                       className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                     />
                   </div>
                 </div>
               );
             })}
          </div>
        </div>

        {/* Actionable Report Warnings */}
        <div className="bg-slate-900/40 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl">
                <Activity size={16} />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Clinical Audit Ledger Warnings</h3>
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-0.5">Automated warning telemetry logs that require immediate response.</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-[10px] text-white/50">
               {[
                 { id: 'WL-9051', type: 'SLA Breach', desc: 'Average lab response clock reached 48 minutes in Ward 4B Pathology.', time: '2 hours ago', priority: 'High', color: 'text-red-400 border-red-500/20 bg-red-500/5' },
                 { id: 'WL-8812', type: 'Billing Dip', desc: 'Billing dip warning: Pharmacy items stock re-allocations decreased gross margin in sector-12 by 4%.', time: '13 hours ago', priority: 'Medium', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
                 { id: 'WL-7243', type: 'GPS Lag', desc: 'Ambulance Unit-05 dispatch telemetry down due to localized signal loss.', time: '1 day ago', priority: 'Low', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
               ].map((warn) => (
                 <div key={warn.id} className={cn("p-4 border rounded-xl flex items-start justify-between gap-4", warn.color)}>
                   <div>
                     <div className="flex items-center gap-2">
                       <span className="font-extrabold uppercase tracking-widest">{warn.type}</span>
                       <span className="opacity-20">•</span>
                       <span>ID: {warn.id}</span>
                     </div>
                     <p className="mt-1 leading-relaxed text-slate-300 font-sans font-semibold text-xs">{warn.desc}</p>
                   </div>
                   <div className="text-right shrink-0">
                     <span className="opacity-40">{warn.time}</span>
                     <p className="font-extrabold uppercase mt-1 tracking-widest">{warn.priority}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
