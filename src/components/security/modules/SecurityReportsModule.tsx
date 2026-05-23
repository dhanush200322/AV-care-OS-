import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useSecurityStore } from '../../../store/securityStore';
import { glassCard } from '../theme';
import { AnimatedCounter } from '../shared/AnimatedCounter';
import { cn } from '../../../lib/utils';

export const SecurityReportsModule: React.FC = () => {
  const { activityLogs, incidents, alerts, cameras, visitors } = useSecurityStore();
  const uptime = [{ z: 'Lobby', u: 99 }, { z: 'ICU', u: 97 }, { z: 'Parking', u: 100 }, { z: 'OT', u: 95 }];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ l: 'Incidents', v: incidents.length }, { l: 'Alerts', v: alerts.length }, { l: 'Cameras', v: cameras.length }, { l: 'Visitors', v: visitors.length }].map((k) => (
          <div key={k.l} className={cn(glassCard, 'p-5')}><p className="text-[10px] uppercase text-[#7F95B2] font-mono">{k.l}</p><p className="text-3xl text-[#00E5FF] mt-2 font-mono"><AnimatedCounter value={k.v} /></p></div>
        ))}
      </div>
      <div className={cn(glassCard, 'p-6')}><h3 className="text-xs font-bold uppercase text-[#7F95B2] mb-4 font-mono">CCTV Uptime</h3><div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={uptime}><XAxis dataKey="z" stroke="#7F95B2" fontSize={10} /><YAxis stroke="#7F95B2" domain={[90, 100]} fontSize={10} /><Tooltip contentStyle={{ background: '#0A1824' }} /><Bar dataKey="u" fill="#00E5FF" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></div>
      <div className={cn(glassCard, 'p-6')}><h3 className="text-xs font-bold uppercase text-[#7F95B2] mb-4 font-mono">Audit Trail</h3><ul className="space-y-2 max-h-64 overflow-y-auto no-scrollbar font-mono text-xs">{activityLogs.map((l) => <li key={l.id} className="flex justify-between py-2 border-b border-white/5"><span className="text-white/80">{l.summary}</span><span className="text-[#7F95B2]">{new Date(l.timestamp).toLocaleTimeString()}</span></li>)}</ul></div>
    </div>
  );
};
