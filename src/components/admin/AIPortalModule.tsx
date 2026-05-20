import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  SendHorizontal, 
  Terminal, 
  AlertCircle, 
  Cpu, 
  Settings, 
  HelpCircle, 
  RefreshCw,
  Zap,
  CheckCircle,
  FileText,
  BarChart,
  Network
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  { 
    title: 'Audit Ward SLA Bottlenecks', 
    prompt: 'Analyze current patient check-in queues in Ward 4B and identify bottlenecks.',
    desc: 'Diagnose average check-in SLA times and recommend float physician dispatch.'
  },
  { 
    title: 'Forecast Supply Replenishment', 
    prompt: 'Examine pharmaceuticals stock levels and forecast replenishment requirements.',
    desc: 'Evaluates low quantities on Paracetamol, Gauzes, Gloves, and projects runout rates.'
  },
  { 
    title: 'Contrast Lab Cost Margin', 
    prompt: 'Examine laboratory profit margins and suggest overhead audit actions.',
    desc: 'Audit surgical vs diagnosis gross margins to reconcile vendor contracts.'
  }
];

export const AIPortalModule: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'm-0', 
      role: 'assistant', 
      content: "Aegis Neuro-AI Core V12.4 synchronized. Security encryption validated. I have full read-access to the clinical database nodes. Select a diagnostic protocol or submit manual system queries below.", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const apiKey = process.env.GROQ_API_KEY || process.env.GROCK_API_KEY;
  const isDemoMode = !apiKey || apiKey === 'undefined' || apiKey === 'MY_GROQ_API_KEY' || apiKey === '';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || query;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setQuery('');
    setLoading(true);

    if (isDemoMode) {
      // Demonstration simulated AI responses with realistic diagnostic data
      setTimeout(() => {
        let aiContent = "";
        const lowered = textToSend.toLowerCase();

        if (lowered.includes('sla') || lowered.includes('ward') || lowered.includes('bottleneck')) {
          aiContent = "SLA REGULATOR DIAGNOSTICS:\n\n1. Average patient intake latency in Ward 4B is currently 42.1 minutes, exceeding SLA targets by 14.1m.\n2. Primary Bottleneck: An imbalance in front-desk shifts during peak OPD hours (11:00 AM - 01:30 PM).\n3. Recommending action: Re-allocate 1 triage nurse from Telemedicine back-office queue to Ward 4B check-in Desk.";
        } else if (lowered.includes('stock') || lowered.includes('pharmaceuticals') || lowered.includes('supply') || lowered.includes('replenish')) {
          aiContent = "CLINICAL LOGISTICS RUNOUT FORECAST:\n\n1. Critical Risk: 'Insulin Glargine Pen-injectors' stock drops under minimum threshold within 3 days (Current count: 18 units, average consumption: 6 units/day).\n2. Moderate Risk: 'Surgical Gloves (L)' at 320 pairs (min limit 500).\n3. Reordering plan triggered: Scheduled 1500 units replenishment from Astra Supplies.";
        } else if (lowered.includes('overhead') || lowered.includes('margin') || lowered.includes('lab') || lowered.includes('profit')) {
          aiContent = "REVENUE LEDGER RECONCILIATION:\n\n- Gross diagnosis revenue: ₹1.89M. Direct operating overhead: ₹1.25M.\n- Net Segment Margin: 33.8%\n- Identified leak: Laboratory blood panel vials are purchased at a 12% premium relative to tier-1 vendor averages. Recommend renegotiating with LifeTech Diagnostics.";
        } else {
          aiContent = `Aegis Diagnostic Query Received: "${textToSend}"\n\n- System telemetry: Normal.\n- Database nodes searched: Patients (Ready), Doctors (Ready), Billing Ledger (Ready).\n- Recommended response: Create customized automated birthday wishes templates and dispatch them to hospital groups to foster community feedback loops. Let me know if you would like me to compile a performance reports spreadsheet instead.`;
        }

        const aiMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: aiContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
      }, 1200);

    } else {
      // Real API execution to Groq Llama-3
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { 
                role: 'system', 
                content: 'You are Aegis Medical AI, the core intelligence powering AV CARE OS, a hospital and clinical enterprise operational manager. Answer with technical, crisp, authoritative clinical management answers. Keep it structured, bulleted, and professional in a cybernetic theme.' 
              },
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: textToSend }
            ],
            temperature: 0.5,
            max_tokens: 800
          })
        });

        if (!response.ok) {
          throw new Error(`API returned status code ${response.status}`);
        }

        const data = await response.json();
        const aiAnswer = data.choices[0]?.message?.content || "No telemetry feedback received from Aegis.";

        const aiMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: aiAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch (err: any) {
        console.error("Groq query failure:", err);
        const errorMsg: ChatMessage = {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: `AI OVERLORD FAULT: Aegis Neural link disrupted. Cause: ${err.message || 'Unknown stream interruption'}. Standard fallback demonstration systems enabled.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Sidebar: Presets and Status */}
      <div className="space-y-4 lg:col-span-1">
        
        {/* Connection status card */}
        <div className="bg-slate-900/40 border border-white/5 backdrop-blur-3xl rounded-[28px] p-5">
           <div className="flex items-center gap-3">
             <div className={cn(
               "p-2.5 rounded-xl border",
               isDemoMode ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
             )}>
                <Cpu size={18} />
             </div>
             <div>
               <h4 className="text-xs font-black text-white uppercase tracking-wider">Aegis Neural Status</h4>
               <p className="text-[10px] text-white/40 font-mono tracking-widest mt-0.5">
                 {isDemoMode ? 'Sandbox Demonstration' : 'Active Llama-3.1 Link'}
               </p>
             </div>
           </div>

           {isDemoMode && (
             <div className="mt-4 p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2 text-[9px] font-mono leading-relaxed text-amber-400 uppercase">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>Operating in Local Emulation. Configure GROQ_API_KEY in the Secrets settings tab to load actual real-time smart predictions.</span>
             </div>
           )}

           {!isDemoMode && (
             <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2 text-[9px] font-mono text-emerald-400 uppercase">
                <CheckCircle size={12} className="shrink-0" />
                <span>Authorized secure Groq API key loaded successfully.</span>
             </div>
           )}
        </div>

        {/* Diagnostic presets */}
        <div className="bg-slate-900/40 border border-white/10 backdrop-blur-3xl rounded-[28px] p-5 space-y-3">
          <h4 className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-3 px-1">Prescribed Prompts Library</h4>
          {PRESET_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.prompt)}
              disabled={loading}
              className="w-full text-left p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all group flex flex-col gap-1.5"
            >
              <span className="text-xs font-black uppercase text-white tracking-wide group-hover:text-purple-400 transition-colors flex items-center justify-between">
                {p.title} <Zap size={10} className="text-white/20 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
              </span>
              <p className="text-[9px] text-white/40 leading-relaxed uppercase font-semibold">{p.desc}</p>
            </button>
          ))}
        </div>

      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-2 bg-slate-900/40 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6 lg:p-8 flex flex-col h-[650px] justify-between overflow-hidden relative">
        
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl">
               <Sparkles size={16} />
             </div>
             <div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Aegis Neuro-AI Chat Terminal</h3>
               <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-0.5">Secure, real-time hospital decision-support and data diagnostic loops.</p>
             </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-wider">
            <Network size={10} strokeWidth={3} className="text-purple-400" /> core stable
          </div>
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 space-y-4 pr-2 no-scrollbar">
          {messages.map((m) => {
            const isAI = m.role === 'assistant';
            return (
              <div 
                key={m.id} 
                className={cn(
                  "flex flex-col gap-1.5 max-w-[85%]",
                  isAI ? "items-start" : "items-end ml-auto"
                )}
              >
                <div className="flex items-center gap-2 text-[9px] font-mono text-white/30 uppercase tracking-widest px-1">
                  <span>{isAI ? 'Aegis Core' : 'Security Admin'}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-xs leading-relaxed font-semibold uppercase whitespace-pre-line tracking-tight border",
                  isAI 
                    ? "bg-white/[0.03] border-white/[0.05] text-white/80" 
                    : "bg-purple-600/20 border-purple-500/20 text-purple-200"
                )}>
                  {m.content}
                </div>
              </div>
            );
          })}
          
          {loading && (
            <div className="flex flex-col gap-1.5 max-w-[80%] items-start animate-pulse">
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest px-1">Aegis AI streams tele-response...</span>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce delay-150" />
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce delay-300" />
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="border-t border-white/5 pt-4 shrink-0 relative">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Submit manual queries to clinical intelligence (E.G. 'Audit laboratory costs...')" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-purple-500/60 font-mono uppercase transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !query.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/40 hover:scale-105 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
            >
              <SendHorizontal size={14} />
            </button>
          </div>
          <p className="mt-3 text-[9px] font-mono text-white/20 text-center uppercase tracking-widest">
            Aegis AI respects patient confidentiality SLA constraints. All trace queries recorded securely.
          </p>
        </div>

      </div>
    </div>
  );
};
