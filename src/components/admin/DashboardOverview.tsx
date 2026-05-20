import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartPulse, Inbox, Activity, Calendar, Users, CreditCard, Gift, Star, Send, X, PartyPopper } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

// Mock data for today's special events (Birthdays / Achievements) including all requested staff roles
const TODAY_EVENTS = [
  {
    id: 1,
    type: 'birthday',
    name: 'Dr. Sarah Jenkins',
    role: 'Chief Cardiologist',
    department: 'doctors',
    message: "Dr. Jenkins' Birthday 🎂",
    details: "Today is Dr. Sarah Jenkins's Birthday! Let's send her a celebratory heart-saving wish!",
    avatar: '👩‍⚕️'
  },
  {
    id: 2,
    type: 'achievement',
    name: 'Michael Chang',
    role: 'Security Lead',
    department: 'roles',
    message: "100% Safety Clearance 🌟",
    details: "Michael Chang achieved 100% Zero-Breach Safety clearance and complete security integrity!",
    avatar: '👮‍♂️'
  },
  {
    id: 3,
    type: 'birthday',
    name: 'Ambulance Driver Rajesh',
    role: 'Emergency Ambulance Pilot',
    department: 'notifications',
    message: "Pilot Rajesh's Birthday 🚑",
    details: "It is Pilot Rajesh's Birthday today! Wishing him safe routes and speedy rescues across the city!",
    avatar: '👨‍✈️'
  },
  {
    id: 4,
    type: 'achievement',
    name: 'Nurse Emily Cooper',
    role: 'Ward 4B Charge Nurse',
    department: 'messages',
    message: "Clinical Hero Nominee 🏆",
    details: "Nurse Emily was nominated for the Healthcare Hero of the Month award for outstanding clinical care!",
    avatar: '👩‍⚕️'
  }
];

export const DashboardOverview: React.FC = () => {
  const { 
    patients, 
    invoices, 
    broadcasts, 
    addNotification, 
    birthdayPeople, 
    sentWishes, 
    addSentWish, 
    wishingDashboards 
  } = useStore();

  const [selectedCelebrant, setSelectedCelebrant] = useState<any | null>(null);
  const [wishChannel, setWishChannel] = useState<'SMS' | 'Email' | 'WhatsApp' | 'Dashboard'>('WhatsApp');
  const [selectedWishDashboard, setSelectedWishDashboard] = useState<string>('Main Lobby Portal');
  const [wishSenderName, setWishSenderName] = useState<string>('Hospital Admin Office');
  const [wishMessage, setWishMessage] = useState<string>('');
  const [wishSuccess, setWishSuccess] = useState<boolean>(false);
  const [wishedEvents, setWishedEvents] = useState<Set<string>>(new Set());
  
  const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

  // Live Birthday Calculations for current calendar simulation (May 20, 2026)
  const todayBirthdays = React.useMemo(() => {
    return birthdayPeople.filter(p => p.month === 5 && p.day === 20);
  }, [birthdayPeople]);

  const upcomingBirthdays = React.useMemo(() => {
    return birthdayPeople.filter(p => !(p.month === 5 && p.day === 20));
  }, [birthdayPeople]);

  const notificationCounter = React.useMemo(() => {
    // Counts how many of today's birthdays have not yet been wished today on any channel
    const wishedNames = new Set(
      sentWishes
        .filter(w => w.dateSent === new Date().toISOString().split('T')[0])
        .map(w => w.recipientName)
    );
    return todayBirthdays.filter(p => !wishedNames.has(p.name)).length;
  }, [todayBirthdays, sentWishes]);

  const handleDispatchQuickWish = () => {
    if (!selectedCelebrant || !wishMessage) return;
    
    addSentWish({
      recipientName: selectedCelebrant.name,
      role: selectedCelebrant.category,
      wishType: wishChannel,
      content: wishMessage,
      senderName: wishSenderName,
      dashboardSource: selectedWishDashboard,
      timeSent: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setWishSuccess(true);
    setWishedEvents(prev => new Set(prev).add(selectedCelebrant.id));
    setTimeout(() => {
      setWishSuccess(false);
      setSelectedCelebrant(null);
    }, 1500);
  };


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      
      {/* 1. HERO HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5 relative z-10 w-full overflow-hidden">
        <div className="space-y-1 w-full max-w-full">
          <div className="flex items-center gap-2 mb-1 w-full">
             <HeartPulse className="w-5 h-5 flex-shrink-0 text-cyan-500" />
             <h1 className="text-xl md:text-3xl font-light tracking-tight text-white capitalize whitespace-nowrap overflow-hidden text-ellipsis w-full">
               Admin <span className="font-bold text-cyan-500">Dashboard</span>
             </h1>
          </div>
          <p className="text-white/40 text-[10px] md:text-xs tracking-widest font-black uppercase flex items-center gap-2 w-full truncate">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>
      </header>

      {/* CLINICAL BIRTHDAY CELEBRATIONS HUB (AUTOMATED WIDGET) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-20">
         {/* Left Column: Today's Active Celebrants */}
         <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0f1225]/85 border border-purple-500/10 backdrop-blur-3xl space-y-4">
           <div className="flex items-center justify-between border-b border-white/5 pb-3">
             <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-fuchsia-500 animate-[bounce_2s_infinite]" />
                <h2 className="text-xs font-black uppercase text-white tracking-widest leading-none">Today's Celebrants Widget</h2>
             </div>
             {notificationCounter > 0 && (
                <span className="bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-400 font-extrabold text-[9px] px-2.5 py-1 rounded-full animate-pulse uppercase tracking-widest">
                  ★ {notificationCounter} Action Required
                </span>
             )}
           </div>

           {todayBirthdays.length === 0 ? (
             <div className="py-12 text-center text-slate-500 text-xs font-black uppercase tracking-wider">
               🎉 Hospital Queue Nominal. No active patient or staff birthdays today.
             </div>
           ) : (
             <div className="space-y-3.5">
               {todayBirthdays.map(person => {
                  const alreadyWished = sentWishes.some(
                    w => w.recipientName === person.name && 
                    w.dateSent === new Date().toISOString().split('T')[0]
                  );
                  return (
                    <div 
                      key={person.id} 
                      className={cn(
                        "p-4 rounded-xl border flex items-center justify-between flex-wrap gap-4 transition-all duration-300",
                        alreadyWished 
                          ? "bg-emerald-500/[0.02] border-emerald-500/10 opacity-75" 
                          : "bg-slate-950/60 border-white/5 hover:border-purple-500/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-slate-900 border border-white/5 text-2xl flex items-center justify-center">
                          {person.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-100">{person.name}</h3>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[8px] font-black uppercase border",
                              person.category === 'Doctor' ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" :
                              person.category === 'Admin' ? "bg-rose-500/10 border-rose-500/25 text-rose-400" :
                              person.category === 'Reception' ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-400" :
                              person.category === 'Security' ? "bg-amber-500/10 border-amber-500/25 text-amber-400" :
                              "bg-purple-500/10 border-purple-500/25 text-purple-400"
                            )}>
                              {person.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/40 font-black tracking-widest uppercase mt-0.5">{person.role}</p>
                          <p className="text-[9px] text-white/30 font-semibold tracking-wider font-mono mt-0.5">Age: {person.age} Yrs • Born: {person.birthdayDate}</p>
                        </div>
                      </div>

                      <div>
                        {alreadyWished ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest font-mono">
                            ✓ Wish Dispatched
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedCelebrant(person);
                              setWishMessage(`Happy Birthday ${person.name}! 🎉 Wishing you supreme health, success, and joy! Happy returns from the clinical team at AV Care! 🏥💝🎂`);
                              setWishChannel('WhatsApp');
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 border border-purple-500/20 hover:border-purple-500/40 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-purple-950/25 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send size={10} /> Customize Greeting
                          </button>
                        )}
                      </div>
                    </div>
                  );
               })}
             </div>
           )}
         </div>

         {/* Right Column: Calculations & Data Points overview */}
         <div className="p-6 rounded-3xl bg-[#0f1225]/85 border border-purple-500/10 backdrop-blur-2xl flex flex-col justify-between gap-4">
            <div>
               <h3 className="text-xs font-black uppercase text-white tracking-[0.2em] border-b border-white/5 pb-2">Celebrations KPI Ledger</h3>
               <div className="grid grid-cols-2 gap-3 mt-3 w-full">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5">
                    <p className="text-2xl font-black text-white font-mono leading-none">{todayBirthdays.length}</p>
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-wider block mt-1.5">Today (Count)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5">
                    <p className="text-2xl font-black text-white font-mono leading-none">{upcomingBirthdays.length}</p>
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-wider block mt-1.5">Upcoming Year</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5">
                    <p className="text-2xl font-black text-white font-mono leading-none">{sentWishes.length}</p>
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-wider block mt-1.5">Dispatched Wishes</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-fuchsia-500/10 bg-fuchsia-500/[0.01]">
                    <p className="text-2xl font-black text-fuchsia-400 font-mono leading-none">{notificationCounter}</p>
                    <span className="text-[9px] font-black uppercase text-fuchsia-400/60 tracking-wider block mt-1.5">Unsent Queue Alert</span>
                  </div>
               </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
              <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Active Broadcasting Node</h4>
              <p className="text-[9px] text-white/30 leading-relaxed uppercase">
                Secured wishing gateways enable automatic delivery across SMS cellular bands, secure SMTP mail relays, WhatsApp web networks and the smart clinical dashboard.
              </p>
            </div>
         </div>
      </div>

      {/* QUICK DISPATCH GREETING MODAL */}
      <AnimatePresence>
        {selectedCelebrant && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCelebrant(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col"
            >
              {wishSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl animate-bounce">🎁</div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Wish Dispatched Successfully</h3>
                  <p className="text-xs text-emerald-400 font-mono">STATUS: DELIVERED VIA {wishChannel.toUpperCase()}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                       <span className="text-2xl">{selectedCelebrant.avatar}</span>
                       <div>
                         <h3 className="text-xs font-bold text-white uppercase tracking-wide">Customize Birthday Wish</h3>
                         <p className="text-[9px] text-white/45 uppercase tracking-widest font-black">For {selectedCelebrant.name} ({selectedCelebrant.category})</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedCelebrant(null)} className="p-1 text-slate-400 hover:text-white bg-white/5 rounded-full">
                       <X size={14} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Channel Selector */}
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block font-mono">Communication Channel</label>
                       <div className="grid grid-cols-4 gap-2">
                          {([
                            { id: 'WhatsApp', icon: '🟢', label: 'WhatsApp' },
                            { id: 'SMS', icon: '💬', label: 'SMS' },
                            { id: 'Email', icon: '📧', label: 'Email' },
                            { id: 'Dashboard', icon: '🖥️', label: 'Dashboard' }
                          ] as const).map(ch => (
                            <button
                              key={ch.id}
                              onClick={() => setWishChannel(ch.id)}
                              className={cn(
                                "py-2.5 rounded-lg border text-[9px] font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1 transition-all",
                                wishChannel === ch.id 
                                  ? "bg-purple-500/20 border-purple-500/55 text-purple-300" 
                                  : "bg-slate-950 border-white/5 text-slate-400 hover:text-white"
                              )}
                            >
                              <span>{ch.icon}</span>
                              <span>{ch.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Dashboard Selector */}
                    {wishChannel === 'Dashboard' && (
                      <div className="space-y-1.5 font-mono">
                         <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block font-mono">Mount to Wishing Dashboard Board</label>
                         <select
                           value={selectedWishDashboard}
                           onChange={(e) => setSelectedWishDashboard(e.target.value)}
                           className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-purple-500 font-mono"
                         >
                           {wishingDashboards.map(db => (
                             <option key={db.id} value={db.name}>{db.name} ({db.location})</option>
                           ))}
                         </select>
                      </div>
                    )}

                    {/* Sender Name Input */}
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block font-mono">Signature Sender Name</label>
                       <input 
                         type="text"
                         value={wishSenderName}
                         onChange={(e) => setWishSenderName(e.target.value)}
                         placeholder="Enter signature sender..."
                         className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                       />
                    </div>

                    {/* Custom wishes template words */}
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block font-mono">Message Text</label>
                       <textarea
                         value={wishMessage}
                         onChange={(e) => setWishMessage(e.target.value)}
                         rows={2}
                         className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white font-medium focus:outline-none focus:border-purple-500"
                       />
                    </div>

                    {/* Send dispatch clicker */}
                    <button 
                      onClick={handleDispatchQuickWish}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-purple-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send size={12} /> Send Celebration Greeting
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. REAL KPI STRIP (If data exists) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[
          { title: 'Total Patients', value: patients.length, icon: Users, color: '#3B82F6' },
          { title: 'Active Admits', value: patients.filter(p => p.status === 'admitted').length, icon: Activity, color: '#A855F7' },
          { title: 'Paid Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: CreditCard, color: '#10B981' },
          { title: 'Invoices', value: invoices.length, icon: Calendar, color: '#22D3EE' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-2xl bg-[#0f1225] shadow-xl border border-white/5 relative overflow-hidden flex-shrink-0"
          >
            <div className="flex flex-col gap-3 relative z-10 w-full h-full justify-between">
              <div className="p-2.5 rounded-xl bg-white/5 w-fit border border-white/5 flex-shrink-0 text-slate-400">
                 <kpi.icon size={18} />
              </div>
              <div className="mt-1 flex-1 min-w-0">
                <span className="text-2xl font-bold text-white tracking-tight w-full truncate block">{kpi.value}</span>
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 truncate mt-1 w-full">{kpi.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="pt-8 border-t border-white/5">
         {patients.length === 0 && invoices.length === 0 && broadcasts.length === 0 ? (
            <EmptyState title="Dashboard is empty" description="Start adding patients, scheduling appointments, or generating invoices to see analytics here." icon={Inbox} />
         ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
               {/* Show empty states for modules that aren't populated yet */}
               <div className="p-6 rounded-2xl bg-[#0f1225] border border-white/5 flex flex-col min-h-[300px]">
                 <h3 className="text-sm font-bold text-white mb-6">Recent Analytics</h3>
                 <div className="flex-1 flex items-center justify-center">
                    <EmptyState title="No analytics available" description="Not enough data points collected over time to generate charts." icon={Activity} />
                 </div>
               </div>
               <div className="p-6 rounded-2xl bg-[#0f1225] border border-white/5 flex flex-col min-h-[300px]">
                 <h3 className="text-sm font-bold text-white mb-6">Recent Activity</h3>
                 <div className="flex-1 flex items-center justify-center">
                    <EmptyState title="No active logs" description="System is nominal. No major events tracked in the last 24 hours." icon={Inbox} />
                 </div>
               </div>
            </div>
         )}
      </div>

    </div>
  );
};
