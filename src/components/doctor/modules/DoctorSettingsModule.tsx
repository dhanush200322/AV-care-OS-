import React, { useState } from 'react';
import { glassCard, btnPrimary } from '../theme';
import { cn } from '../../../lib/utils';
import { useDoctorStore } from '../../../store/doctorStore';

interface Props {
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export const DoctorSettingsModule: React.FC<Props> = ({ onToast }) => {
  const { wsConnected, setWsConnected } = useDoctorStore();
  const [prefs, setPrefs] = useState({
    autosave: true,
    aiAssist: true,
    reducedMotion: false,
    notifications: true,
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className={cn(glassCard, 'p-6')}>
        <h2 className="text-lg font-bold text-white mb-4">Clinical Preferences</h2>
        {Object.entries(prefs).map(([key, val]) => (
          <label key={key} className="flex items-center justify-between py-3 border-b border-white/5 cursor-pointer">
            <span className="text-sm text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <input
              type="checkbox"
              checked={val}
              onChange={() => setPrefs({ ...prefs, [key]: !val })}
              className="w-5 h-5 rounded accent-[#00D68F]"
            />
          </label>
        ))}
        <button type="button" onClick={() => onToast('success', 'Settings saved')} className={cn(btnPrimary, 'mt-6')}>
          Save Preferences
        </button>
      </div>

      <div className={cn(glassCard, 'p-6')}>
        <h2 className="text-lg font-bold text-white mb-4">Realtime Connection</h2>
        <p className="text-sm text-[#8AA39B] mb-4">WebSocket sync for live queue & emergency updates</p>
        <button
          type="button"
          onClick={() => {
            setWsConnected(!wsConnected);
            onToast('success', wsConnected ? 'Disconnected' : 'Connected');
          }}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold uppercase border',
            wsConnected ? 'border-[#00FFA3] text-[#00FFA3]' : 'border-[#FF4444] text-[#FF4444]'
          )}
        >
          {wsConnected ? 'Live — Click to disconnect' : 'Offline — Connect'}
        </button>
      </div>

      <div className={cn(glassCard, 'p-6')}>
        <h2 className="text-lg font-bold text-white mb-4">Accessibility</h2>
        <p className="text-xs text-[#8AA39B]">WCAG-compliant contrast, keyboard navigation, reduced motion support enabled system-wide.</p>
      </div>
    </div>
  );
};
