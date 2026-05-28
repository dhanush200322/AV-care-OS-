import React from 'react';
import { motion } from 'motion/react';
import { Cookie, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useCookieConsent } from './useCookieConsent';

const buttonBase =
  'inline-flex h-9 items-center justify-center rounded-xl px-3 text-[11px] font-black uppercase tracking-[0.12em] outline-none transition-all focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50';

export const CookieConsentCard: React.FC = () => {
  const { acceptAll, denyAll, openPreferences } = useCookieConsent();

  return (
    <motion.section
      aria-label="Privacy and security preferences"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto fixed inset-x-3 bottom-3 z-[2147483000] rounded-2xl border border-emerald-300/15 bg-slate-950/72 p-3 text-slate-100 shadow-[0_24px_80px_-32px_rgba(16,185,129,0.75)] backdrop-blur-2xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[360px]"
    >
      <div className="absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(circle_at_88%_12%,rgba(45,212,191,0.20),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.82),rgba(2,6,23,0.72))]" />
      <div className="flex items-start gap-3">
        <div className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-200 shadow-[0_0_24px_rgba(45,212,191,0.18)]">
          <ShieldCheck size={17} aria-hidden="true" />
          <Cookie size={11} aria-hidden="true" className="absolute -right-1 -bottom-1 rounded-full bg-slate-950 text-teal-200" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-[13px] font-black tracking-[0.08em] text-white">
            Privacy & Security Preferences
          </h2>
          <p className="mt-1.5 text-[11px] font-medium leading-5 text-slate-300/85">
            AV CARE OS uses secure cookies for authentication, protection, analytics, and optimized healthcare operations.
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_auto]">
        <button
          type="button"
          onClick={acceptAll}
          className={`${buttonBase} col-span-2 bg-emerald-300 text-slate-950 shadow-[0_12px_28px_-18px_rgba(52,211,153,0.95)] hover:bg-emerald-200 sm:col-span-1`}
        >
          Accept & Continue
        </button>
        <button
          type="button"
          onClick={denyAll}
          className={`${buttonBase} border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]`}
        >
          Deny
        </button>
        <button
          type="button"
          onClick={openPreferences}
          className={`${buttonBase} gap-1.5 border border-teal-300/15 bg-teal-300/[0.06] text-teal-100 hover:bg-teal-300/[0.10]`}
          aria-haspopup="dialog"
        >
          <SlidersHorizontal size={13} aria-hidden="true" />
          Customize
        </button>
      </div>
    </motion.section>
  );
};
