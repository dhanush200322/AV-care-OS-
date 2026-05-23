import React from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Ambulance, Siren, Clock, Wrench, Users, AlertTriangle, Sparkles } from 'lucide-react';
import { useAmbulanceStore } from '../../store/ambulanceStore';
import { AnimatedCounter } from './shared/AnimatedCounter';
import { glassCard } from './theme';
import { cn } from '../../lib/utils';

const respData = [{ t: '06', v: 12 }, { t: '08', v: 9 }, { t: '10', v: 7 }, { t: '12', v: 8 }, { t: '14', v: 6 }, { t: '16', v: 10 }];

export const AmbulanceDashboardOverview: React.FC = () => {
  const { units, requests, drivers, alerts, avgResponseMin, vehicleHealth } = useAmbulanceStore();
  const activeUnits = units.filter((u) => u.status !== 'Maintenance').length;
  const pendingReq = requests.filter((r) => r.status === 'Pending').length;
  const onDuty = drivers.filter((d) => d.status === 'On Duty').length;
  const fleetHealth = Math.round(units.reduce((s, u) => s + u.healthScore, 0) / (units.length || 1));
  const critical = requests.filter((r) => r.severity === 'P1 Critical').length;

  const kpis = [
    { label: 'Active Ambulances', value: activeUnits, icon: Ambulance, color: '#FFA63D' },
    { label: 'Emergency Requests', value: pendingReq, icon: Siren, color: '#FF7A00' },
    { label: 'Avg Response', value: avgResponseMin, icon: Clock, color: '#FF9E57', suffix: ' min', decimals: 1 },
    { label: 'Fleet Health', value: fleetHealth, icon: Wrench, color: '#00D68F', suffix: '%' },
    { label: 'Critical Cases', value: critical, icon: AlertTriangle, color: '#FF4444' },
    { label: 'Drivers On Duty', value: onDuty, icon: Users, color: '#FFC857' },
  ];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className={cn(glassCard, 'xl:col-span-5 p-8')}>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#FFA63D]/70 font-mono mb-2">EMS-CMD</p>
          <h1 className="text-3xl font-light text-white">Dispatcher <span className="font-bold text-[#FFA63D] font-mono">Priya N.</span></h1>
          <p className="text-sm text-[#B8A28F] mb-6">Alpha Shift · Chennai Metro Fleet</p>
          <div className="p-4 rounded-2xl bg-[#140B05]/80 border border-[#FF7A00]/30 mb-4">
            <div className="flex items-center gap-2 mb-2"><Sparkles className="text-[#FFA63D]" size={14} /><span className="text-xs font-bold text-[#FFA63D] uppercase font-mono">AI Emergency Insight</span></div>
            <p className="text-sm text-white/85">P1 cardiac active — ALPHA-1 en route 6min. BRAVO-2 staged for OMR accident. Traffic moderate on Anna Salai.</p>
          </div>
          <div className="p-4 rounded-2xl border border-[#00D68F]/25 bg-[#00D68F]/5 text-xs text-[#B8A28F]">Fleet readiness: <span className="text-[#00D68F] font-bold">{activeUnits}/{units.length} operational</span> · {vehicleHealth.filter((v) => v.status !== 'Healthy').length} maintenance flags</div>
        </motion.div>
        <div className="xl:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn(glassCard, 'p-5', k.label.includes('Critical') && critical > 0 && 'border-[#FF4444]/30')}>
              <k.icon size={16} style={{ color: k.color }} className="mb-3" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#B8A28F] font-mono">{k.label}</p>
              <p className="text-3xl font-light text-white mt-1 font-mono"><AnimatedCounter value={k.value} suffix={k.suffix} decimals={k.decimals} /></p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className={cn(glassCard, 'p-6')}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#B8A28F] mb-4 font-mono">Response time — 24h</h2>
        <div className="h-48"><ResponsiveContainer width="100%" height="100%"><AreaChart data={respData}><defs><linearGradient id="orgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFA63D" stopOpacity={0.4} /><stop offset="100%" stopColor="#FFA63D" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="t" stroke="#B8A28F" fontSize={10} tickLine={false} axisLine={false} /><YAxis stroke="#B8A28F" fontSize={10} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: '#22140B', border: '1px solid #FF7A0040', fontFamily: 'monospace' }} /><Area type="monotone" dataKey="v" stroke="#FFA63D" fill="url(#orgG)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
      </section>
    </div>
  );
};
