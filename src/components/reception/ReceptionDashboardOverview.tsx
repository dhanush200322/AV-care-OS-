import React from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { UserPlus, Calendar, ListOrdered, CreditCard, Siren, Clock, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useReceptionStore } from '../../store/receptionStore';
import { AnimatedCounter } from './shared/AnimatedCounter';
import { glassCard } from './theme';
import { cn } from '../../lib/utils';

const chart = [{ t: '08', v: 6 }, { t: '10', v: 14 }, { t: '12', v: 22 }, { t: '14', v: 18 }, { t: '16', v: 25 }, { t: '18', v: 12 }];

export const ReceptionDashboardOverview: React.FC = () => {
  const { appointments, invoices } = useStore();
  const { tokens, registrationsToday, waitingHall } = useReceptionStore();

  const waiting = tokens.filter((t) => t.status === 'Waiting').length;
  const revenue = invoices.filter((i) => i.date === new Date().toISOString().split('T')[0]).reduce((s, i) => s + i.amount, 0) || 48500;
  const emergency = tokens.filter((t) => t.queueType === 'Emergency').length;
  const avgWait = tokens.length ? Math.round(tokens.reduce((s, t) => s + t.waitMinutes, 0) / tokens.length) : 0;

  const kpis = [
    { label: 'Registrations Today', value: registrationsToday, icon: UserPlus, color: '#00FFD5' },
    { label: 'Active Appointments', value: appointments.filter((a) => a.status !== 'Canceled').length, icon: Calendar, color: '#00C2A8' },
    { label: 'Queue Waiting', value: waiting, icon: ListOrdered, color: '#00C2E0' },
    { label: 'Revenue Today', value: revenue, icon: CreditCard, color: '#17C964', prefix: '₹' },
    { label: 'Emergency Walk-ins', value: emergency, icon: Siren, color: '#FF4444' },
    { label: 'Avg Wait Time', value: avgWait, icon: Clock, color: '#FFB800', suffix: 'm' },
  ];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className={cn(glassCard, 'xl:col-span-5 p-8 relative overflow-hidden')}>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#00FFD5]/80 mb-2">Operations Command</p>
          <h1 className="text-3xl font-light text-white">Welcome, <span className="font-bold text-[#00FFD5]">Ananya</span></h1>
          <p className="text-sm text-[#89A9B0] mb-6">Front Desk · AV Care Chennai HQ</p>
          <div className="p-4 rounded-2xl bg-[#071A1D]/60 border border-white/10 mb-4">
            <p className="text-xs font-bold text-[#00C2A8] uppercase mb-2">Today&apos;s Summary</p>
            <p className="text-2xl text-white font-light"><AnimatedCounter value={registrationsToday} /> registrations · <AnimatedCounter value={waiting} /> in queue</p>
          </div>
          <div className="p-4 rounded-2xl border border-[#00C2E0]/20 bg-[#00C2E0]/5">
            <div className="flex items-center gap-2 mb-2"><Sparkles className="text-[#00C2E0]" size={14} /><span className="text-xs font-bold text-[#00C2E0] uppercase">AI Workflow</span></div>
            <p className="text-sm text-white/80">Peak load 12–2 PM. Open counter 3 for priority queue. 2 delayed consults — notify patients via WhatsApp.</p>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-[#00C2A8]/10 border border-[#00C2A8]/20 text-xs text-[#89A9B0]">
            Waiting hall: <span className="text-[#00FFD5] font-bold">{waitingHall.reduce((s, w) => s + w.occupancy, 0)}</span> / {waitingHall.reduce((s, w) => s + w.maxCapacity, 0)} capacity
          </div>
        </motion.div>
        <div className="xl:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn(glassCard, 'p-5 relative overflow-hidden')}>
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: k.color }} />
              <k.icon size={16} style={{ color: k.color }} className="mb-3" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#89A9B0]">{k.label}</p>
              <p className="text-3xl font-light text-white mt-1">{k.prefix}<AnimatedCounter value={k.value} suffix={k.suffix} /></p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className={cn(glassCard, 'p-6')}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#89A9B0] mb-4">Patient inflow — live</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart}>
              <defs><linearGradient id="tealG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00FFD5" stopOpacity={0.4} /><stop offset="100%" stopColor="#00FFD5" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="t" stroke="#89A9B0" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#89A9B0" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0D262B', border: '1px solid #00C2A840' }} />
              <Area type="monotone" dataKey="v" stroke="#00FFD5" fill="url(#tealG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};
