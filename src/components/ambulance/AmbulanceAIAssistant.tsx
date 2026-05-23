import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Mic, SendHorizontal, Ambulance } from 'lucide-react';
import { cn } from '../../lib/utils';
import { glassPanel } from './theme';

export const AmbulanceAIAssistant: React.FC<{ forceOpen?: boolean; onForceOpenChange?: (o: boolean) => void }> = ({ forceOpen, onForceOpenChange }) => {
  const [internal, setInternal] = useState(false);
  const open = forceOpen ?? internal;
  const setOpen = (v: boolean) => { setInternal(v); onForceOpenChange?.(v); };
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([{ role: 'ai', content: 'EMS Dispatch AI online. Route optimization, unit assignment, and emergency triage ready.' }]);
  const [typing, setTyping] = useState(false);
  const send = () => {
    if (!query.trim()) return;
    const q = query; setQuery('');
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setTyping(true);
    setTimeout(() => { setMessages((m) => [...m, { role: 'ai', content: `For "${q}": Recommend BRAVO-2 (4.1km, 9min ETA). Route via OMR avoids congestion. P1 SLA within target.` }]); setTyping(false); }, 1000);
  };
  return (
    <>
      <AnimatePresence>{open && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn(glassPanel, 'fixed bottom-24 right-6 z-[100] w-[min(100vw-2rem,420px)] max-h-[min(70vh,540px)] flex flex-col border-[#FF7A00]/35 shadow-[0_0_50px_rgba(255,122,0,0.25)] font-mono')}>
          <header className="flex justify-between p-4 border-b border-white/10"><div className="flex items-center gap-2"><Ambulance className="text-[#FFA63D]" size={20} /><div><p className="text-sm font-bold text-white">Dispatch AI</p><p className="text-[9px] text-[#FFA63D]">EMS v4</p></div></div><button type="button" onClick={() => setOpen(false)}><X size={18} className="text-[#B8A28F]" /></button></header>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar min-h-[180px]">{messages.map((m, i) => <div key={i} className={cn('p-3 rounded-xl text-xs', m.role === 'ai' ? 'bg-[#FF7A00]/15 border border-[#FF7A00]/25' : 'ml-auto bg-[#140B05] border border-white/10')}>{m.content}</div>)}{typing && <div className="flex gap-1">{[0,1,2].map((i) => <motion.span key={i} animate={{ opacity: [0.3,1,0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.2 }} className="w-2 h-2 rounded-full bg-[#FFA63D]" />)}</div>}</div>
          <footer className="p-4 border-t border-white/10 flex gap-2"><button type="button" className="p-2.5 rounded-xl border border-white/10 text-[#FFA63D]"><Mic size={18} /></button><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Dispatch query…" className="flex-1 bg-[#140B05]/90 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-[#FF7A00]/40 focus:outline-none" /><button type="button" onClick={send} className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FFA63D] text-[#140B05]"><SendHorizontal size={18} /></button></footer>
        </motion.div>
      )}</AnimatePresence>
      <motion.button type="button" onClick={() => setOpen(!open)} whileHover={{ scale: 1.05 }} className="fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FFA63D] shadow-[0_0_35px_rgba(255,166,61,0.55)] flex items-center justify-center border-2 border-[#FF9E57]/60">
        <motion.div animate={{ scale: [1,1.15,1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-[#FFA63D]/25" /><Sparkles className="text-[#140B05] relative z-10" size={24} />
      </motion.button>
    </>
  );
};
