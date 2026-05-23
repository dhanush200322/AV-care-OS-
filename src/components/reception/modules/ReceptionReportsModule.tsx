import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useReceptionStore } from '../../../store/receptionStore';
import { useStore } from '../../../store/useStore';
import { glassCard } from '../theme';
import { AnimatedCounter } from '../shared/AnimatedCounter';
import { cn } from '../../../lib/utils';

export const ReceptionReportsModule: React.FC = () => {
  const { activityLogs, tokens, registrationsToday } = useReceptionStore();
  const { appointments, invoices } = useStore();

  const inflow = [{ h: '08', n: 8 }, { h: '10', n: 18 }, { h: '12', n: 28 }, { h: '14', n: 22 }, { h: '16', n: 15 }];
  const revenue = [{ d: 'Mon', v: 42 }, { d: 'Tue', v: 55 }, { d: 'Wed', v: 48 }, { d: 'Thu', v: 62 }, { d: 'Fri', v: 58 }];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'Registrations', v: registrationsToday },
          { l: 'Appointments', v: appointments.length },
          { l: 'Queue Tokens', v: tokens.length },
          { l: 'Invoices', v: invoices.length },
        ].map((k) => (
          <div key={k.l} className={cn(glassCard, 'p-5')}><p className="text-[10px] uppercase text-[#89A9B0]">{k.l}</p><p className="text-3xl text-[#00FFD5] font-light mt-2"><AnimatedCounter value={k.v} /></p></div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={cn(glassCard, 'p-6')}><h3 className="text-xs font-bold uppercase text-[#89A9B0] mb-4">Patient Inflow</h3><div className="h-48"><ResponsiveContainer width="100%" height="100%"><LineChart data={inflow}><XAxis dataKey="h" stroke="#89A9B0" fontSize={10} /><YAxis stroke="#89A9B0" fontSize={10} /><Tooltip contentStyle={{ background: '#0D262B' }} /><Line type="monotone" dataKey="n" stroke="#00FFD5" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
        <div className={cn(glassCard, 'p-6')}><h3 className="text-xs font-bold uppercase text-[#89A9B0] mb-4">Revenue Trend</h3><div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={revenue}><XAxis dataKey="d" stroke="#89A9B0" fontSize={10} /><YAxis stroke="#89A9B0" fontSize={10} /><Tooltip contentStyle={{ background: '#0D262B' }} /><Bar dataKey="v" fill="#00C2A8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
      </div>
      <div className={cn(glassCard, 'p-6')}><h3 className="text-xs font-bold uppercase text-[#89A9B0] mb-4">Audit Log</h3><ul className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">{activityLogs.map((l) => <li key={l.id} className="flex justify-between text-xs py-2 border-b border-white/5"><span className="text-white/80">{l.summary}</span><span className="text-[#89A9B0] font-mono">{new Date(l.timestamp).toLocaleTimeString()}</span></li>)}</ul></div>
    </div>
  );
};
