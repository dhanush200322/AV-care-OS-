import React from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, AlertTriangle, Video, Lock, Siren, Car, Sparkles } from 'lucide-react';
import { useSecurityStore } from '../../store/securityStore';
import { AnimatedCounter } from './shared/AnimatedCounter';
import { glassCard } from './theme';
import { cn } from '../../lib/utils';

const threatData = [{ t: '00', v: 2 }, { t: '04', v: 5 }, { t: '08', v: 12 }, { t: '12', v: 8 }, { t: '16', v: 15 }, { t: '20', v: 6 }];

export const SecurityDashboardOverview: React.FC = () => {
  const { visitors, incidents, cameras, restrictedZones, alerts, parkingRecords } = useSecurityStore();
  const activeVisitors = visitors.filter((v) => v.status === 'Active').length;
  const activeInc = incidents.filter((i) => i.status === 'Active' || i.status === 'Investigating').length;
  const camsOnline = cameras.filter((c) => c.status === 'Online' || c.status === 'Recording').length;
  const breachAttempts = restrictedZones.reduce((s, z) => s + z.unauthorizedAttempts, 0);
  const criticalAlerts = alerts.filter((a) => a.severity === 'Critical' && a.status === 'Active').length;
  const parkingOcc = parkingRecords.filter((p) => p.status === 'Parked').length;

  const kpis = [
    { label: 'Active Visitors', value: activeVisitors, icon: Users, color: '#00E5FF' },
    { label: 'Active Incidents', value: activeInc, icon: AlertTriangle, color: '#FF4444' },
    { label: 'CCTV Online', value: camsOnline, icon: Video, color: '#00C2E0', suffix: `/${cameras.length}` },
    { label: 'Restricted Attempts', value: breachAttempts, icon: Lock, color: '#FFB800' },
    { label: 'Emergency Alerts', value: criticalAlerts, icon: Siren, color: '#FF3B30' },
    { label: 'Parking Occupied', value: parkingOcc, icon: Car, color: '#00D68F' },
  ];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className={cn(glassCard, 'xl:col-span-5 p-8 border-[#00C2E0]/20')}>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#00E5FF]/70 mb-2 font-mono">SEC-CMD</p>
          <h1 className="text-3xl font-light text-white">Officer <span className="font-bold text-[#00E5FF] font-mono">Vikram S.</span></h1>
          <p className="text-sm text-[#7F95B2] mb-6">Alpha Shift · Chennai HQ Perimeter</p>
          <div className="p-4 rounded-2xl bg-[#050D14]/80 border border-[#FF4444]/30 mb-4">
            <p className="text-xs font-bold text-[#FF4444] uppercase mb-2 font-mono">AI Threat Analysis</p>
            <p className="text-sm text-white/85">2 critical anomalies: ICU unauthorized access pattern. Motion cluster OT corridor. Recommend elevated patrol.</p>
          </div>
          <div className="p-4 rounded-2xl border border-[#00C2E0]/20 bg-[#1E6FFF]/10 flex items-center gap-2">
            <Sparkles className="text-[#00E5FF]" size={16} />
            <p className="text-xs text-[#7F95B2]">Facility status: <span className="text-[#00D68F] font-bold">OPERATIONAL</span> · Perimeter secure</p>
          </div>
        </motion.div>
        <div className="xl:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn(glassCard, 'p-5 relative', k.label.includes('Incident') || k.label.includes('Emergency') ? 'border-[#FF4444]/25' : '')}>
              {k.label.includes('Emergency') && criticalAlerts > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-[#FF4444] rounded-full animate-ping" />}
              <k.icon size={16} style={{ color: k.color }} className="mb-3" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#7F95B2] font-mono">{k.label}</p>
              <p className="text-3xl font-light text-white mt-1 font-mono"><AnimatedCounter value={k.value} suffix={k.suffix} /></p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className={cn(glassCard, 'p-6')}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#7F95B2] mb-4 font-mono">Threat activity — 24h</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={threatData}>
              <defs><linearGradient id="cyanG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00E5FF" stopOpacity={0.35} /><stop offset="100%" stopColor="#00E5FF" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="t" stroke="#7F95B2" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#7F95B2" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0A1824', border: '1px solid #00C2E040', fontFamily: 'monospace' }} />
              <Area type="monotone" dataKey="v" stroke="#00E5FF" fill="url(#cyanG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};
