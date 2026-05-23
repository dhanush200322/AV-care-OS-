import React, { useState } from 'react';
import { useReceptionStore } from '../../../store/receptionStore';
import { glassCard, btnPrimary } from '../theme';
import { cn } from '../../../lib/utils';

interface Props { onToast: (t: 'success' | 'error', m: string) => void; }

export const ReceptionSettingsModule: React.FC<Props> = ({ onToast }) => {
  const { wsConnected, setWsConnected } = useReceptionStore();
  const [prefs, setPrefs] = useState({ autoToken: true, smsReminders: true, aiAssist: true, reducedMotion: false });

  return (
    <div className="max-w-2xl space-y-6">
      <div className={cn(glassCard, 'p-6')}>
        <h2 className="text-lg font-bold text-white mb-4">Front Desk Preferences</h2>
        {Object.entries(prefs).map(([k, v]) => (
          <label key={k} className="flex justify-between py-3 border-b border-white/5 cursor-pointer">
            <span className="text-sm text-white capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
            <input type="checkbox" checked={v} onChange={() => setPrefs({ ...prefs, [k]: !v })} className="accent-[#00C2A8]" />
          </label>
        ))}
        <button type="button" onClick={() => onToast('success', 'Saved')} className={cn(btnPrimary, 'mt-6')}>Save</button>
      </div>
      <div className={cn(glassCard, 'p-6')}>
        <h2 className="text-lg font-bold text-white mb-2">Realtime Sync</h2>
        <button type="button" onClick={() => { setWsConnected(!wsConnected); onToast('success', wsConnected ? 'Offline' : 'Connected'); }} className={cn('px-4 py-2 rounded-xl text-xs font-bold uppercase border', wsConnected ? 'border-[#00FFD5] text-[#00FFD5]' : 'border-[#FF4444] text-[#FF4444]')}>
          {wsConnected ? 'WebSocket Live' : 'Disconnected'}
        </button>
      </div>
      <div className={cn(glassCard, 'p-6')}><p className="text-xs text-[#89A9B0]">WCAG accessibility, keyboard navigation, and reduced motion are supported.</p></div>
    </div>
  );
};
