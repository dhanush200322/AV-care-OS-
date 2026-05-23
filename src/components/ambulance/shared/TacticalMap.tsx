import React from 'react';
import { motion } from 'motion/react';
import type { AmbulanceUnit, AmbulanceStatus } from '../../../store/ambulanceStore';
import { cn } from '../../../lib/utils';

const STATUS_COLOR: Record<AmbulanceStatus, string> = {
  Available: '#00D68F',
  Dispatched: '#FFA63D',
  'En Route': '#FF7A00',
  'On Scene': '#FF4444',
  Returning: '#00C2E0',
  Maintenance: '#7F95B2',
};

/** Tactical map visualization (Mapbox-ready placeholder) */
export const TacticalMap: React.FC<{ units: AmbulanceUnit[]; fullscreen?: boolean; onUnitClick?: (u: AmbulanceUnit) => void }> = ({ units, fullscreen, onUnitClick }) => {
  const norm = (lat: number, lng: number) => ({
    left: `${((lng - 80.20) / 0.08) * 100}%`,
    top: `${((13.10 - lat) / 0.10) * 100}%`,
  });

  return (
    <div className={cn('relative rounded-2xl overflow-hidden border border-[#FF7A00]/30 bg-[#140B05]', fullscreen ? 'h-[70vh]' : 'h-[420px]')}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,122,0,0.12),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(255,166,61,0.08),transparent_40%)]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,122,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <span className="px-2 py-1 rounded bg-black/60 text-[10px] font-mono text-[#FFA63D] border border-[#FF7A00]/30">LIVE GPS</span>
        <span className="px-2 py-1 rounded bg-black/60 text-[10px] font-mono text-[#B8A28F]">{units.length} units</span>
      </div>
      {units.map((u) => {
        const pos = norm(u.lat, u.lng);
        const color = STATUS_COLOR[u.status];
        return (
          <motion.button
            key={u.id}
            type="button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => onUnitClick?.(u)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: pos.left, top: pos.top }}
            title={`${u.callSign} — ${u.status}`}
          >
            <span className="relative flex h-4 w-4">
              {(u.status === 'En Route' || u.status === 'Dispatched') && (
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: color }} />
              )}
              <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-white" style={{ backgroundColor: color }} />
            </span>
            <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold text-white bg-black/70 px-1.5 py-0.5 rounded">{u.callSign}</span>
          </motion.button>
        );
      })}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        {units.filter((u) => u.status === 'En Route').map((u, i) => {
          const p = norm(u.lat, u.lng);
          return <line key={u.id} x1="85%" y1="15%" x2={p.left} y2={p.top} stroke="#FF7A00" strokeWidth="2" strokeDasharray="6 4" />;
        })}
      </svg>
    </div>
  );
};
