import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Mic, SendHorizontal, Brain } from 'lucide-react';
import { cn } from '../../lib/utils';
import { glassPanel } from './theme';

interface DoctorAIAssistantProps {
  forceOpen?: boolean;
  onForceOpenChange?: (open: boolean) => void;
}

export const DoctorAIAssistant: React.FC<DoctorAIAssistantProps> = ({
  forceOpen,
  onForceOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = forceOpen ?? internalOpen;
  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onForceOpenChange?.(v);
  };
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
    {
      role: 'ai',
      content:
        'CareOS Clinical AI online. I can assist with differential diagnosis, drug interactions, SOAP notes, and queue prioritization. How can I help?',
    },
  ]);
  const [typing, setTyping] = useState(false);

  const handleSend = () => {
    if (!query.trim()) return;
    const q = query;
    setQuery('');
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'ai',
          content: `Based on clinical context: "${q}" — I recommend reviewing vitals, recent labs, and cross-referencing drug interactions. Priority queue patients with Emergency flag first.`,
        },
      ]);
      setTyping(false);
    }, 1200);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              glassPanel,
              'fixed bottom-24 right-6 z-[100] w-[min(100vw-2rem,400px)] max-h-[min(70vh,520px)] flex flex-col border-[#00D68F]/30 shadow-[0_0_40px_rgba(0,255,163,0.2)]'
            )}
          >
            <header className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Brain className="text-[#00FFA3]" size={20} />
                <div>
                  <p className="text-sm font-bold text-white">Clinical AI</p>
                  <p className="text-[9px] text-[#00FFA3] uppercase tracking-widest">Neural Assist v3</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="p-2 text-[#8AA39B] hover:text-white">
                <X size={18} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar min-h-[200px]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-3 rounded-2xl text-sm leading-relaxed max-w-[90%]',
                    msg.role === 'ai'
                      ? 'bg-[#00D68F]/10 border border-[#00D68F]/20 text-white/90'
                      : 'ml-auto bg-[#071B11] border border-white/10 text-white'
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {typing && (
                <div className="flex gap-1 p-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-[#00FFA3]"
                    />
                  ))}
                </div>
              )}
            </div>
            <footer className="p-4 border-t border-white/10 flex gap-2">
              <button type="button" className="p-2.5 rounded-xl border border-white/10 text-[#00FFA3] hover:bg-[#00D68F]/10" aria-label="Voice input">
                <Mic size={18} />
              </button>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask clinical AI…"
                className="flex-1 bg-[#071B11]/80 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00D68F]/40"
              />
              <button
                type="button"
                onClick={handleSend}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#00D68F] to-[#00FFA3] text-[#071B11]"
                aria-label="Send"
              >
                <SendHorizontal size={18} />
              </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-full bg-gradient-to-br from-[#00D68F] to-[#00FFA3] shadow-[0_0_30px_rgba(0,255,163,0.5)] flex items-center justify-center border-2 border-[#3DFFB5]/50"
        aria-label="Open AI assistant"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-[#00FFA3]/20"
        />
        <Sparkles className="text-[#071B11] relative z-10" size={24} />
      </motion.button>
    </>
  );
};
