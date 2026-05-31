import type { Broadcast } from '../../../store/useStore';

export type CommunicationsVariant = 'admin' | 'doctor' | 'receptionist' | 'security' | 'ambulance';

export type BroadcastAudience = Broadcast['audience'];

export interface CommunicationsTheme {
  composePanel: string;
  feedPanel: string;
  broadcastActive: string;
  broadcastInactive: string;
  messageActive: string;
  messageInactive: string;
  broadcastSubmit: string;
  messageSubmit: string;
  inputFocus: string;
  footerIcon: string;
  feedDot: string;
  feedBroadcastTab: string;
  feedBroadcastTabInactive: string;
  feedMessageTab: string;
  feedMessageTabInactive: string;
  officialWaveClass: string;
  officialWaveIcon: string;
}

export const adminCommunicationsTheme: CommunicationsTheme = {
  composePanel: 'bg-[#0f1225] border-white/5',
  feedPanel: 'bg-[#0a0d1d] border-white/5',
  broadcastActive: 'bg-purple-500 text-white shadow-lg shadow-purple-900/40',
  broadcastInactive: 'text-slate-400 hover:text-white',
  messageActive: 'bg-cyan-500 text-white shadow-lg shadow-cyan-900/40',
  messageInactive: 'text-slate-400 hover:text-white',
  broadcastSubmit: 'bg-purple-500 hover:bg-purple-400 shadow-lg shadow-purple-900/20',
  messageSubmit: 'bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-900/20',
  inputFocus: 'focus:border-purple-500/50',
  footerIcon: 'text-purple-500/60',
  feedDot: 'bg-cyan-400',
  feedBroadcastTab: 'bg-purple-500/20 text-purple-400 border border-purple-500/20',
  feedBroadcastTabInactive: 'text-white/40 hover:text-white',
  feedMessageTab: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20',
  feedMessageTabInactive: 'text-white/40 hover:text-white',
  officialWaveClass: 'text-purple-400',
  officialWaveIcon: 'text-purple-400',
};

export const doctorCommunicationsTheme: CommunicationsTheme = {
  composePanel: 'bg-[#0D2818]/80 border-[#00D68F]/15',
  feedPanel: 'bg-[#071B11]/90 border-[#00D68F]/15',
  broadcastActive: 'bg-[#00D68F] text-[#071B11] shadow-lg shadow-[#00D68F]/40',
  broadcastInactive: 'text-[#8AA39B] hover:text-white',
  messageActive: 'bg-[#00C2E0] text-[#071B11] shadow-lg shadow-[#00C2E0]/40',
  messageInactive: 'text-[#8AA39B] hover:text-white',
  broadcastSubmit: 'bg-gradient-to-r from-[#00D68F] to-[#00FFA3] text-[#071B11] shadow-lg shadow-[#00D68F]/25 hover:opacity-95',
  messageSubmit: 'bg-[#00C2E0] hover:bg-[#00E5FF] text-[#071B11] shadow-lg shadow-[#00C2E0]/25',
  inputFocus: 'focus:border-[#00D68F]/50',
  footerIcon: 'text-[#00D68F]/70',
  feedDot: 'bg-[#00FFA3]',
  feedBroadcastTab: 'bg-[#00D68F]/20 text-[#00FFA3] border border-[#00D68F]/25',
  feedBroadcastTabInactive: 'text-[#8AA39B] hover:text-white',
  feedMessageTab: 'bg-[#00C2E0]/20 text-[#00C2E0] border border-[#00C2E0]/25',
  feedMessageTabInactive: 'text-[#8AA39B] hover:text-white',
  officialWaveClass: 'text-[#00FFA3]',
  officialWaveIcon: 'text-[#00D68F]',
};

export const receptionCommunicationsTheme: CommunicationsTheme = {
  composePanel: 'bg-[#0D262B]/80 border-[#00C2A8]/15',
  feedPanel: 'bg-[#071A1D]/90 border-[#00C2A8]/15',
  broadcastActive: 'bg-[#00C2A8] text-[#071A1D] shadow-lg shadow-[#00C2A8]/40',
  broadcastInactive: 'text-[#89A9B0] hover:text-white',
  messageActive: 'bg-[#00C2E0] text-[#071A1D] shadow-lg shadow-[#00C2E0]/40',
  messageInactive: 'text-[#89A9B0] hover:text-white',
  broadcastSubmit: 'bg-gradient-to-r from-[#00C2A8] to-[#00FFD5] text-[#071A1D] shadow-lg shadow-[#00C2A8]/25 hover:opacity-95',
  messageSubmit: 'bg-[#00C2E0] hover:bg-[#00E5FF] text-[#071A1D] shadow-lg shadow-[#00C2E0]/25',
  inputFocus: 'focus:border-[#00C2A8]/50',
  footerIcon: 'text-[#00C2A8]/70',
  feedDot: 'bg-[#00FFD5]',
  feedBroadcastTab: 'bg-[#00C2A8]/20 text-[#00FFD5] border border-[#00C2A8]/25',
  feedBroadcastTabInactive: 'text-[#89A9B0] hover:text-white',
  feedMessageTab: 'bg-[#00C2E0]/20 text-[#00C2E0] border border-[#00C2E0]/25',
  feedMessageTabInactive: 'text-[#89A9B0] hover:text-white',
  officialWaveClass: 'text-[#00FFD5]',
  officialWaveIcon: 'text-[#00C2A8]',
};

export const securityCommunicationsTheme: CommunicationsTheme = {
  composePanel: 'bg-[#0A1824]/80 border-[#00C2E0]/15',
  feedPanel: 'bg-[#050D14]/90 border-[#00C2E0]/15',
  broadcastActive: 'bg-[#1E6FFF] text-white shadow-lg shadow-[#1E6FFF]/40',
  broadcastInactive: 'text-[#7F95B2] hover:text-white',
  messageActive: 'bg-[#00E5FF] text-[#050D14] shadow-lg shadow-[#00C2E0]/40',
  messageInactive: 'text-[#7F95B2] hover:text-white',
  broadcastSubmit: 'bg-gradient-to-r from-[#00C2E0] to-[#00E5FF] text-[#050D14] shadow-lg shadow-[#00C2E0]/25 hover:opacity-95',
  messageSubmit: 'bg-[#1E6FFF] hover:bg-[#3B82F6] text-white shadow-lg shadow-[#1E6FFF]/25',
  inputFocus: 'focus:border-[#00C2E0]/50',
  footerIcon: 'text-[#00C2E0]/70',
  feedDot: 'bg-[#00E5FF]',
  feedBroadcastTab: 'bg-[#1E6FFF]/20 text-[#00E5FF] border border-[#1E6FFF]/25',
  feedBroadcastTabInactive: 'text-[#7F95B2] hover:text-white',
  feedMessageTab: 'bg-[#00C2E0]/20 text-[#00C2E0] border border-[#00C2E0]/25',
  feedMessageTabInactive: 'text-[#7F95B2] hover:text-white',
  officialWaveClass: 'text-[#00E5FF]',
  officialWaveIcon: 'text-[#1E6FFF]',
};

export const ambulanceCommunicationsTheme: CommunicationsTheme = {
  composePanel: 'bg-[#22140B]/80 border-[#FF7A00]/20',
  feedPanel: 'bg-[#140B05]/90 border-[#FF7A00]/20',
  broadcastActive: 'bg-[#FF7A00] text-[#140B05] shadow-lg shadow-[#FF7A00]/40',
  broadcastInactive: 'text-[#B8A28F] hover:text-white',
  messageActive: 'bg-[#FFA63D] text-[#140B05] shadow-lg shadow-[#FFA63D]/40',
  messageInactive: 'text-[#B8A28F] hover:text-white',
  broadcastSubmit: 'bg-gradient-to-r from-[#FF7A00] to-[#FFA63D] text-[#140B05] shadow-lg shadow-[#FF7A00]/30 hover:opacity-95',
  messageSubmit: 'bg-[#FFA63D] hover:bg-[#FFB84D] text-[#140B05] shadow-lg shadow-[#FFA63D]/25',
  inputFocus: 'focus:border-[#FF7A00]/50',
  footerIcon: 'text-[#FF7A00]/70',
  feedDot: 'bg-[#FFA63D]',
  feedBroadcastTab: 'bg-[#FF7A00]/20 text-[#FFA63D] border border-[#FF7A00]/30',
  feedBroadcastTabInactive: 'text-[#B8A28F] hover:text-white',
  feedMessageTab: 'bg-[#FFA63D]/20 text-[#FFA63D] border border-[#FFA63D]/30',
  feedMessageTabInactive: 'text-[#B8A28F] hover:text-white',
  officialWaveClass: 'text-[#FFA63D]',
  officialWaveIcon: 'text-[#FF7A00]',
};

export function themeForVariant(variant: CommunicationsVariant): CommunicationsTheme {
  const map = {
    admin: adminCommunicationsTheme,
    doctor: doctorCommunicationsTheme,
    receptionist: receptionCommunicationsTheme,
    security: securityCommunicationsTheme,
    ambulance: ambulanceCommunicationsTheme,
  };
  return map[variant];
}

export function defaultAudienceForVariant(variant: CommunicationsVariant): BroadcastAudience {
  if (variant === 'receptionist') return 'reception';
  if (variant === 'admin') return 'all';
  return variant;
}

export function audienceFilterForVariant(variant: CommunicationsVariant) {
  if (variant === 'admin') return () => true;
  const key = defaultAudienceForVariant(variant);
  return (b: Broadcast) => b.audience === 'all' || b.audience === key;
}

export function officialWaveLabel(variant: CommunicationsVariant): string {
  const labels: Record<CommunicationsVariant, string> = {
    admin: 'OFFICIAL ADMIN WAVE',
    doctor: 'CLINICAL STAFF WAVE',
    receptionist: 'RECEPTION DESK WAVE',
    security: 'SECURITY COMMAND WAVE',
    ambulance: 'EMS DISPATCH WAVE',
  };
  return labels[variant];
}
