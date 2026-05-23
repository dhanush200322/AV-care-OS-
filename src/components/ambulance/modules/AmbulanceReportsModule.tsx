import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useAmbulanceStore } from '../../../store/ambulanceStore';
import { glassCard } from '../theme';
import { AnimatedCounter } from '../shared/AnimatedCounter';
import { cn } from '../../../lib/utils';

export const AmbulanceReportsModule: React.FC = () => {
  const { activityLogs, dispatches, units, avgResponseMin } = useAmbulanceStore();
  const util = [{ u: 'ALPHA', p: 85 }, { u: 'BRAVO', p: 72 }, { u: 'CHARLIE', p: 90 }];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ l: 'Dispatches', v: dispatches.length }, { l: 'Fleet', v: units.length }, { l: 'Avg Response', v: avgResponseMin }].map((k) => (
          <div key={k.l} className={cn(glassCard, 'p-5')}><p className="text-[10px] uppercase text-[#B8A28F] font-mono">{k.l}</p><p className="text-3xl text-[#FFA63D] mt-2 font-mono"><AnimatedCounter value={k.v} decimals={k.l.includes('Response') ? 1 : 0} suffix={k.l.includes('Response') ? ' min' : ''} /></p></div>
        ))}
      </div>
      <div className={cn(glassCard, 'p-6')}><h3 className="text-xs font-bold uppercase text-[#B8A28F] mb-4 font-mono">Fleet Utilization</h3><div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={util}><XAxis dataKey="u" stroke="#B8A28F" fontSize={10} /><YAxis stroke="#B8A28F" fontSize={10} /><Tooltip contentStyle={{ background: '#22140B' }} /><Bar dataKey="p" fill="#FFA63D" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></div>
      <div className={cn(glassCard, 'p-6')}><h3 className="text-xs font-bold uppercase text-[#B8A28F] mb-4 font-mono">Audit</h3><ul className="space-y-2 max-h-56 overflow-y-auto font-mono text-xs">{activityLogs.map((l) => <li key={l.id} className="flex justify-between py-2 border-b border-white/5"><span>{l.summary}</span><span className="text-[#B8A28F]">{new Date(l.timestamp).toLocaleTimeString()}</span></li>)}</ul></div>
    </div>
  );
};
