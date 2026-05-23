import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useDoctorStore } from '../../../store/doctorStore';
import { useStore } from '../../../store/useStore';
import { glassCard } from '../theme';
import { AnimatedCounter } from '../shared/AnimatedCounter';
import { cn } from '../../../lib/utils';

const COLORS = ['#00FFA3', '#00D68F', '#00C2E0', '#FFB800', '#FF4444'];

export const DoctorAnalyticsModule: React.FC = () => {
  const { queue, consultations, prescriptions, activityLogs } = useDoctorStore();
  const { appointments, patients } = useStore();

  const barData = [
    { name: 'Mon', consults: 12 },
    { name: 'Tue', consults: 18 },
    { name: 'Wed', consults: 15 },
    { name: 'Thu', consults: 22 },
    { name: 'Fri', consults: 19 },
  ];

  const pieData = [
    { name: 'Routine', value: queue.filter((q) => q.priority === 'Routine').length || 3 },
    { name: 'Urgent', value: queue.filter((q) => q.priority === 'Urgent').length || 2 },
    { name: 'Emergency', value: queue.filter((q) => q.priority === 'Emergency').length || 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Consultations', value: consultations.length + 24 },
          { label: 'Prescriptions', value: prescriptions.length + 18 },
          { label: 'Appointments', value: appointments.length },
          { label: 'Patients', value: patients.length },
        ].map((kpi) => (
          <div key={kpi.label} className={cn(glassCard, 'p-5')}>
            <p className="text-[10px] uppercase tracking-widest text-[#8AA39B]">{kpi.label}</p>
            <p className="text-3xl font-light text-[#00FFA3] mt-2">
              <AnimatedCounter value={kpi.value} />
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cn(glassCard, 'p-6')}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8AA39B] mb-4">Weekly Throughput</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#8AA39B" fontSize={10} />
                <YAxis stroke="#8AA39B" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0D2818', border: '1px solid #00D68F40' }} />
                <Bar dataKey="consults" fill="#00FFA3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={cn(glassCard, 'p-6')}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8AA39B] mb-4">Queue Priority Mix</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0D2818', border: '1px solid #00D68F40' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={cn(glassCard, 'p-6')}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#8AA39B] mb-4">Audit Activity Log</h3>
        <ul className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
          {activityLogs.slice(0, 10).map((log) => (
            <li key={log.id} className="flex justify-between text-xs py-2 border-b border-white/5">
              <span className="text-white/80">{log.summary}</span>
              <span className="text-[#8AA39B] font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
