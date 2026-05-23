/** AV CareOS Doctor Dashboard — Green Command Center design tokens */
export const doctorTheme = {
  bg: '#071B11',
  surface: '#0D2818',
  primary: '#00D68F',
  neon: '#00FFA3',
  glow: '#3DFFB5',
  emerald: '#17C964',
  success: '#00E096',
  warning: '#FFB800',
  critical: '#FF4444',
  aiCyan: '#00C2E0',
  textSecondary: '#8AA39B',
  textPrimary: '#FFFFFF',
} as const;

export const glassCard =
  'rounded-2xl border border-[#00D68F]/15 bg-[#0D2818]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,214,143,0.08)]';
export const glassPanel =
  'rounded-3xl border border-white/10 bg-[#0D2818]/40 backdrop-blur-2xl';
export const btnPrimary =
  'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D68F] to-[#00FFA3] text-[#071B11] font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#00D68F]/25 hover:shadow-[#00FFA3]/40 hover:scale-[1.02] active:scale-[0.98] transition-all';
export const btnGhost =
  'inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-[#00D68F]/30 hover:bg-[#00D68F]/10 text-xs font-bold uppercase tracking-widest transition-all';
export const inputClass =
  'w-full bg-[#071B11]/80 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-[#8AA39B]/50 focus:outline-none focus:border-[#00D68F]/50 focus:ring-1 focus:ring-[#00D68F]/30 transition-all';
