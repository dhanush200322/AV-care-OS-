import React from 'react';
import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Calendar, Users, Siren, Brain, FileText, Video, Sparkles, Clock } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useDoctorStore } from '../../store/doctorStore';
import { AnimatedCounter } from './shared/AnimatedCounter';
import { glassCard } from './theme';
import { cn } from '../../lib/utils';

const chartData = [
  { t: '08', v: 4 },
  { t: '10', v: 8 },
  { t: '12', v: 12 },
  { t: '14', v: 9 },
  { t: '16', v: 14 },
  { t: '18', v: 7 },
];

const kpis = [
  { key: 'consultations', label: "Today's Consultations", icon: Users, color: '#00FFA3' },
  { key: 'patients', label: 'Active Patients', icon: Users, color: '#00D68F' },
  { key: 'emergency', label: 'Emergency Cases', icon: Siren, color: '#FF4444' },
  { key: 'ai', label: 'AI Health Score', icon: Brain, color: '#00C2E0' },
  { key: 'reports', label: 'Pending Reports', icon: FileText, color: '#FFB800' },
  { key: 'tele', label: 'Telemedicine', icon: Video, color: '#3DFFB5' },
];

export const DoctorDashboardOverview: React.FC = () => {
  const { appointments, labReports, patients } = useStore();
  const { queue, emergencies, telemedicineSessions } = useDoctorStore();

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.date === today && a.status !== 'Canceled');
  const pendingLabs = labReports.filter((r) => r.status === 'Pending').length;
  const activeEmergencies = emergencies.filter((e) => e.status === 'Active').length;
  const teleToday = telemedicineSessions.filter((s) => s.scheduledAt.startsWith(today)).length;

  const values: Record<string, number> = {
    consultations: todayAppts.length + 8,
    patients: queue.filter((q) => q.status !== 'Completed').length + patients.length,
    emergency: activeEmergencies,
    ai: 94,
    reports: pendingLabs,
    tele: teleToday,
  };

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(glassCard, 'xl:col-span-5 p-8 relative overflow-hidden')}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FFA3]/10 rounded-full blur-3xl pointer-events-none" />
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#00FFA3]/80 mb-2">
            Welcome back
          </p>
          <h1 className="text-3xl font-light text-white mb-1">
            Dr. <span className="font-bold text-[#00FFA3]">Satish Kumar</span>
          </h1>
          <p className="text-sm text-[#8AA39B] mb-6">Cardiology · AV Care Chennai HQ</p>

          <div className="p-4 rounded-2xl bg-[#071B11]/60 border border-white/10 mb-4">
            <div className="flex items-center gap-2 text-[#00FFA3] mb-2">
              <Calendar size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Schedule</span>
            </div>
            <p className="text-2xl font-light text-white">
              <AnimatedCounter value={todayAppts.length} /> appointments
            </p>
            <p className="text-xs text-[#8AA39B] mt-1 flex items-center gap-2">
              <Clock size={12} /> Next: {todayAppts[0]?.time ?? '10:30 AM'} — {todayAppts[0]?.patientName ?? 'Walk-in'}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[#00C2E0]/20 bg-[#00C2E0]/5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-[#00C2E0]" size={14} />
              <span className="text-xs font-bold text-[#00C2E0] uppercase tracking-wider">AI Productivity</span>
            </div>
            <p className="text-sm text-white/80">
              Queue optimized: 3 urgent cases flagged. AI suggests clearing lab reviews before 2 PM rounds.
            </p>
          </div>
        </motion.div>

        <div className="xl:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(glassCard, 'p-5 relative overflow-hidden group hover:border-[#00FFA3]/40 transition-colors')}
            >
              <div
                className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: kpi.color }}
              />
              <kpi.icon size={16} style={{ color: kpi.color }} className="mb-3" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#8AA39B] mb-1">{kpi.label}</p>
              <p className="text-3xl font-light text-white">
                <AnimatedCounter value={values[kpi.key] ?? 0} suffix={kpi.key === 'ai' ? '%' : ''} />
              </p>
              {kpi.key === 'emergency' && activeEmergencies > 0 && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-[#FF4444] rounded-full animate-pulse" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section className={cn(glassCard, 'p-6')}>
        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-[#8AA39B] mb-4">
          Consultation throughput — live
        </h2>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FFA3" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00FFA3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" stroke="#8AA39B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8AA39B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#0D2818',
                  border: '1px solid #00D68F40',
                  borderRadius: 12,
                }}
              />
              <Area type="monotone" dataKey="v" stroke="#00FFA3" fill="url(#greenGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};
