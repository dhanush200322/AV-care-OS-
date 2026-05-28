import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, RotateCcw, ShieldCheck, X } from 'lucide-react';
import { useCookieConsent } from './useCookieConsent';
import type { CookieCategoryId } from './consent.types';

const categories: Array<{
  id: CookieCategoryId;
  title: string;
  description: string;
  locked?: boolean;
}> = [
  {
    id: 'essential',
    title: 'Essential Cookies',
    description: 'Required for core platform availability and safety controls.',
    locked: true,
  },
  {
    id: 'authentication',
    title: 'Authentication Cookies',
    description: 'Keeps secure role login and session continuity available.',
  },
  {
    id: 'analytics',
    title: 'Analytics Cookies',
    description: 'Helps improve healthcare operations and usage reliability.',
  },
  {
    id: 'securityMonitoring',
    title: 'Security Monitoring Cookies',
    description: 'Supports audit signals, abuse prevention, and risk monitoring.',
  },
  {
    id: 'preferences',
    title: 'Preference Cookies',
    description: 'Remembers interface and privacy selections for this device.',
  },
];

const buttonBase =
  'inline-flex h-9 items-center justify-center rounded-xl px-3 text-[11px] font-black uppercase tracking-[0.12em] outline-none transition-all focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

export const CookiePreferencesModal: React.FC = () => {
  const {
    closePreferences,
    draftPreferences,
    resetPreferences,
    savePreferences,
    setDraftPreference,
  } = useCookieConsent();
  const [openItem, setOpenItem] = React.useState<CookieCategoryId>('essential');
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePreferences();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePreferences]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
      className="fixed inset-0 z-[2147483001] flex items-end justify-center bg-slate-950/25 p-3 backdrop-blur-[2px] sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePreferences();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[430px] rounded-2xl border border-emerald-300/15 bg-slate-950/86 p-4 text-slate-100 shadow-[0_30px_90px_-38px_rgba(20,184,166,0.9)] backdrop-blur-2xl"
      >
        <div className="absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(circle_at_85%_5%,rgba(45,212,191,0.16),transparent_34%),linear-gradient(145deg,rgba(15,23,42,0.92),rgba(2,6,23,0.86))]" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-200">
              <ShieldCheck size={17} aria-hidden="true" />
            </div>
            <div>
              <h2 id="cookie-preferences-title" className="text-sm font-black tracking-[0.08em] text-white">
                Privacy Controls
              </h2>
              <p className="mt-1 text-[11px] leading-5 text-slate-300/80">
                Configure AV CARE OS cookies by operational category.
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closePreferences}
            aria-label="Close privacy preferences"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {categories.map((category) => {
            const checked = draftPreferences[category.id];
            const expanded = openItem === category.id;

            return (
              <div key={category.id} className="rounded-2xl border border-white/10 bg-white/[0.035]">
                <div className="flex w-full items-center justify-between gap-3 px-3 py-2.5">
                  <span className="min-w-0">
                    <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-white">
                      {category.title}
                    </span>
                    {category.locked && (
                      <span className="mt-0.5 block text-[9px] font-black uppercase tracking-[0.16em] text-emerald-200/80">
                        Locked enabled
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={checked}
                      aria-label={`${category.title} ${checked ? 'enabled' : 'disabled'}`}
                      disabled={category.locked}
                      onClick={(event) => {
                        event.stopPropagation();
                        setDraftPreference(category.id, !checked);
                      }}
                      className={`relative h-6 w-11 rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 ${
                        checked
                          ? 'border-emerald-300/35 bg-emerald-300/35'
                          : 'border-white/10 bg-white/[0.05]'
                      } ${category.locked ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      <motion.span
                        layout
                        animate={{ x: checked ? 20 : 2 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                        className="absolute top-[2px] h-5 w-5 rounded-full bg-white shadow-lg"
                      />
                      </button>
                    <button
                      type="button"
                      aria-label={`${expanded ? 'Collapse' : 'Expand'} ${category.title}`}
                      aria-expanded={expanded}
                      aria-controls={`cookie-panel-${category.id}`}
                      onClick={() => setOpenItem(expanded ? 'essential' : category.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
                    >
                      <ChevronDown
                        size={15}
                        aria-hidden="true"
                        className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </span>
                </div>

                {expanded && (
                  <div id={`cookie-panel-${category.id}`} className="px-3 pb-3 text-[11px] leading-5 text-slate-300/75">
                    {category.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[10px] leading-4 text-slate-400/80">
          GDPR-ready consent controls. Essential cookies remain active for secure healthcare platform operation.
        </p>

        <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
          <button
            type="button"
            onClick={resetPreferences}
            className={`${buttonBase} gap-1.5 border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]`}
          >
            <RotateCcw size={13} aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={savePreferences}
            className={`${buttonBase} bg-emerald-300 text-slate-950 hover:bg-emerald-200`}
          >
            Save Preferences
          </button>
        </div>
      </motion.div>
    </div>
  );
};
