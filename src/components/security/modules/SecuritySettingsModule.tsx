import React, { useState } from 'react';
import { useSecurityStore } from '../../../store/securityStore';
import { glassCard, btnPrimary } from '../theme';
import { cn } from '../../../lib/utils';

export const SecuritySettingsModule: React.FC<{ onToast: (t: 'success' | 'error', m: string) => void }> = ({ onToast }) => {
  const { wsConnected, setWsConnected } = useSecurityStore();
  const [prefs, setPrefs] = useState({ aiSurveillance: true, autoEscalate: true, recordAllFeeds: true, reducedMotion: false });
  return (
    <div className="max-w-2xl space-y-6">
      <div className={cn(glassCard, 'p-6')}>
        <h2 className="text-lg font-bold text-white font-mono mb-4">Security Preferences</h2>
        {Object.entries(prefs).map(([k, v]) => (
          <label key={k} className="flex justify-between py-3 border-b border-white/5 cursor-pointer">
            <span className="text-sm text-white capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
            <input type="checkbox" checked={v} onChange={() => setPrefs({ ...prefs, [k]: !v })} className="accent-[#00C2E0]" />
          </label>
        ))}
        <button type="button" onClick={() => onToast('success', 'Saved')} className={cn(btnPrimary, 'mt-6')}>Save</button>
      </div>
      <div className={cn(glassCard, 'p-6')}>
        <h2 className="text-lg font-bold text-white mb-2 font-mono">Feed Sync</h2>
        <button type="button" onClick={() => { setWsConnected(!wsConnected); onToast('success', wsConnected ? 'Offline' : 'Live'); }} className={cn('px-4 py-2 rounded-xl text-xs font-bold uppercase font-mono border', wsConnected ? 'border-[#00E5FF] text-[#00E5FF]' : 'border-[#FF4444] text-[#FF4444]')}>{wsConnected ? 'WEBSOCKET LIVE' : 'DISCONNECTED'}</button>
      </div>
    </div>
  );
};
