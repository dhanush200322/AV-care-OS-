import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, 
  Smartphone, 
  Mail, 
  Settings, 
  Clock, 
  FileSpreadsheet, 
  PlusCircle, 
  Printer, 
  Calendar, 
  Filter, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Send, 
  Image, 
  Share2, 
  Download, 
  UserPlus, 
  Info,
  CalendarDays,
  FileText,
  Building,
  CheckCircle2,
  Trash2,
  ListFilter,
  Monitor,
  Layout,
  Tv
} from 'lucide-react';
import { useStore, BirthdayPerson, BirthdayTemplate, SentWish, WishingDashboard } from '../../store/useStore';
import { cn } from '../../lib/utils';

// Banner styling themes for hospital branding options
const BANNER_THEMES = [
  { id: 'banner-purple', name: 'Ambient Cosmos (Purple)', class: 'bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-800', preview: '🟣' },
  { id: 'banner-emerald', name: 'Clinical Healing (Emerald)', class: 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-500', preview: '🟢' },
  { id: 'banner-cyan', name: 'Cyber Oxygen (Cyan)', class: 'bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600', preview: '🔵' },
  { id: 'banner-amber', name: 'Golden Recovery (Amber)', class: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-800', preview: '🟡' },
];

export const BirthdayModule: React.FC = () => {
  const { 
    birthdaySettings, 
    birthdayTemplates, 
    sentWishes, 
    birthdayPeople, 
    wishingDashboards,
    updateBirthdaySettings, 
    addSentWish, 
    updateBirthdayTemplate, 
    addBirthdayPerson,
    addWishingDashboard
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'records' | 'dashboards' | 'settings' | 'history'>('records');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Admin' | 'Doctor' | 'Reception' | 'Security' | 'Ambulance'>('All');
  const [filterMonth, setFilterMonth] = useState<number>(0); // 0 means All Months
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom states for manual sending action modal
  const [selectedRecipient, setSelectedRecipient] = useState<BirthdayPerson | null>(null);
  const [sendingChannel, setSendingChannel] = useState<'SMS' | 'Email' | 'WhatsApp' | 'Dashboard'>('WhatsApp');
  const [selectedDashboardBoard, setSelectedDashboardBoard] = useState<string>('Doctor Dashboard');
  const [senderSignatureName, setSenderSignatureName] = useState<string>('Clinical Admin Head');
  const [customizedMessageText, setCustomizedMessageText] = useState('');
  const [isSendingSimulated, setIsSendingSimulated] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  // Custom states for Add New Record modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecordName, setNewRecordName] = useState('');
  const [newRecordRole, setNewRecordRole] = useState('');
  const [newRecordCategory, setNewRecordCategory] = useState<'Admin' | 'Doctor' | 'Reception' | 'Security' | 'Ambulance'>('Admin');
  const [newRecordAge, setNewRecordAge] = useState<number>(30);
  const [newRecordBirthday, setNewRecordBirthday] = useState('1996-05-20');
  const [newRecordPhone, setNewRecordPhone] = useState('+91 ');
  const [newRecordEmail, setNewRecordEmail] = useState('');
  const [newRecordAvatar, setNewRecordAvatar] = useState('👩');

  // Custom wishing display dashboard console states
  const [newDbName, setNewDbName] = useState('');
  const [newDbLocation, setNewDbLocation] = useState('');
  const [selectedBoardCelebrantId, setSelectedBoardCelebrantId] = useState<string>('bp-1');

  // Print view modal
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  // Helper template replacement
  const resolveTemplate = (templateContent: string, personName: string) => {
    return templateContent
      .replace(/\{\{name\}\}/g, personName)
      .replace(/\{\{hospital_name\}\}/g, birthdaySettings.hospitalName);
  };

  // Birthday checks
  const todayBirthdays = useMemo(() => {
    return birthdayPeople.filter(p => p.month === 5 && p.day === 20); // Static date simulation of May 20, 2026
  }, [birthdayPeople]);

  const upcomingBirthdays = useMemo(() => {
    // Return birthdays that are not today (i.e. May 21 through end of June)
    return birthdayPeople.filter(p => !(p.month === 5 && p.day === 20));
  }, [birthdayPeople]);

  // Combined stats
  const statsOverview = useMemo(() => {
    return {
      todayCount: todayBirthdays.length,
      upcomingCount: upcomingBirthdays.length,
      totalSent: sentWishes.length,
      autoEnabled: birthdaySettings.autoWishesEnabled
    };
  }, [todayBirthdays, upcomingBirthdays, sentWishes, birthdaySettings]);

  // Filtering records based on user search triggers & options
  const filteredPeople = useMemo(() => {
    return birthdayPeople.filter(person => {
      const matchCategory = filterCategory === 'All' || person.category === filterCategory;
      const matchMonth = filterMonth === 0 || person.month === filterMonth;
      const matchSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          person.phone.includes(searchQuery) ||
                          person.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchMonth && matchSearch;
    });
  }, [birthdayPeople, filterCategory, filterMonth, searchQuery]);

  // Trigger simulated template customization on selection
  const handleOpenSendWizard = (person: BirthdayPerson) => {
    setSelectedRecipient(person);
    // Bind to default templates based on channel preference
    const matchedTemplate = birthdayTemplates.find(t => t.type === birthdaySettings.wishType) || birthdayTemplates[0];
    setCustomizedMessageText(resolveTemplate(matchedTemplate.content, person.name));
    setSendingChannel(birthdaySettings.wishType);
    setSimulationComplete(false);
    setIsSendingSimulated(false);
  };

  // Simulate Wish Dispatch with beautiful interactive HUD feedback
  const handleDispatchWish = () => {
    if (!selectedRecipient) return;
    setIsSendingSimulated(true);

    setTimeout(() => {
      // Add wish to Zustand Store
      addSentWish({
        recipientName: selectedRecipient.name,
        role: selectedRecipient.category,
        wishType: sendingChannel,
        content: customizedMessageText,
        senderName: senderSignatureName,
        dashboardSource: selectedDashboardBoard,
        timeSent: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setIsSendingSimulated(false);
      setSimulationComplete(true);
      setTimeout(() => {
        setSelectedRecipient(null);
      }, 1500);
    }, 1800);
  };

  // Add new birthday person record
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordName || !newRecordRole || !newRecordBirthday) return;

    addBirthdayPerson({
      name: newRecordName,
      role: newRecordRole,
      category: newRecordCategory,
      age: Number(newRecordAge),
      birthdayDate: newRecordBirthday,
      avatar: newRecordAvatar,
      phone: newRecordPhone,
      email: newRecordEmail
    });

    // Reset states
    setNewRecordName('');
    setNewRecordRole('');
    setNewRecordPhone('+91 ');
    setNewRecordEmail('');
    setIsAddModalOpen(false);
  };

  // Export functions
  const exportToCSV = () => {
    const headers = 'ID,Name,Category,Role,Age,Birthday,Phone,Email\n';
    const rows = birthdayPeople.map(p => 
      `"${p.id}","${p.name}","${p.category}","${p.role}",${p.age},"${p.birthdayDate}","${p.phone}","${p.email}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Hospital_Birthdays_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get active banner background implementation
  const activeThemeClass = useMemo(() => {
    const t = BANNER_THEMES.find(theme => theme.id === birthdaySettings.selectedBanner);
    return t ? t.class : BANNER_THEMES[0].class;
  }, [birthdaySettings.selectedBanner]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* MODULE MAIN STATE HEAD COUNTER ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: "Today's Birthdays", 
            value: statsOverview.todayCount, 
            desc: "Active celebration points today", 
            icon: Gift, 
            color: "from-fuchsia-500/20 to-purple-500/10 text-fuchsia-400 border-fuchsia-500/20 animate-pulse" 
          },
          { 
            title: "Upcoming (Next 30 Days)", 
            value: statsOverview.upcomingCount, 
            desc: "Future medical & staff alerts", 
            icon: CalendarDays, 
            color: "from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20" 
          },
          { 
            title: "Dispatched Wishes", 
            value: statsOverview.totalSent, 
            desc: "Historical delivery success logs", 
            icon: CheckCircle2, 
            color: "from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20" 
          },
          { 
            title: "Automated Rules engine", 
            value: statsOverview.autoEnabled ? "ONLINE" : "OFFLINE", 
            desc: `Scheduled at ${birthdaySettings.sendingTime}`, 
            icon: Settings, 
            color: statsOverview.autoEnabled 
              ? "from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30" 
              : "from-rose-500/10 to-slate-500/10 text-slate-400 border-white/5" 
          }
        ].map((s, idx) => (
          <div 
            key={idx} 
            className={cn(
              "p-5 rounded-2xl border bg-[#0f1225]/80 backdrop-blur-xl flex items-start gap-4 transition-all duration-300 hover:border-white/15",
              s.color
            )}
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex-shrink-0">
              <s.icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-3xl font-black tracking-tight text-white block leading-tight">{s.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 block mt-1">{s.title}</span>
              <span className="text-[9px] text-white/40 block mt-0.5">{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SUB MENU SELECTOR BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-2">
        <div className="flex items-center gap-1.5 bg-[#0f1225] p-1.5 rounded-xl border border-white/5">
          {[
            { id: 'records', label: 'Birthday Records', icon: Calendar },
            { id: 'dashboards', label: 'Celebration Boards', icon: Layout },
            { id: 'settings', label: 'Auto-Send Rules & Templates', icon: Settings },
            { id: 'history', label: 'Dispatched Wishes Log', icon: FileText }
          ].map(tab => {
            const isTabActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-300",
                  isTabActive 
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-950/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2">
          {activeSubTab === 'records' && (
            <>
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all duration-300"
              >
                <Download size={14} /> CSV Report
              </button>
              <button 
                onClick={() => setIsPrintPreviewOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all duration-300"
              >
                <Printer size={14} /> Print Audit List
              </button>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-950/20 transition-all duration-300"
              >
                <PlusCircle size={14} /> Register Birthday
              </button>
            </>
          )}
        </div>
      </div>

      {/* CORE CONTENT RENDERER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {activeSubTab === 'records' && (
            <div className="space-y-6">
              
              {/* SEARCH & FILTERS CONTROLS ROW */}
              <div className="p-4 bg-[#090b1c] border border-white/5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, role, contact or status..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/5">
                    {(['All', 'Admin', 'Doctor', 'Reception', 'Security', 'Ambulance'] as const).map(cat => {
                      const isCatActive = filterCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                            isCatActive 
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                              : "text-slate-400 hover:text-white"
                          )}
                        >
                          {cat === 'All' ? 'All Roles' : cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Month Select Picker */}
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 bg-slate-950 border border-white/5 rounded-xl">
                    <ListFilter size={12} className="text-slate-400" />
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(Number(e.target.value))}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-300 focus:outline-none cursor-pointer py-1"
                    >
                      <option value={0}>All Months</option>
                      <option value={1}>January</option>
                      <option value={2}>February</option>
                      <option value={3}>March</option>
                      <option value={4}>April</option>
                      <option value={5}>May</option>
                      <option value={6}>June</option>
                      <option value={7}>July</option>
                      <option value={8}>August</option>
                      <option value={9}>September</option>
                      <option value={10}>October</option>
                      <option value={11}>November</option>
                      <option value={12}>December</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* ACTIVE EVENT HIGHLIGHT BANNER */}
              {todayBirthdays.length > 0 && (
                <div className={cn("p-6 rounded-3xl border border-white/10 relative overflow-hidden text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl z-10", activeThemeClass)}>
                  <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/20 text-[9px] font-black uppercase tracking-widest">
                      <Sparkles size={11} className="animate-spin" /> TODAY'S CELEBRATIONS ACTIVE
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight leading-none">Wishes Ready to Dispatched</h2>
                    <p className="text-xs text-white/80 max-w-lg">
                      Today is a special milestone for <strong className="underline text-yellow-300">{todayBirthdays.map(p => p.name).join(', ')}</strong>. The automated queue has prepared standard messages to go out! You can also click below to manually customize or test messages.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 relative z-10">
                    {todayBirthdays.map(person => (
                      <button
                        key={person.id}
                        onClick={() => handleOpenSendWizard(person)}
                        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-2xl backdrop-blur-md text-left transition-all max-w-[220px] truncate"
                      >
                        <span className="text-2xl">{person.avatar}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white tracking-wide truncate leading-tight">{person.name}</p>
                          <p className="text-[9px] font-extrabold text-white/60 tracking-wider uppercase truncate mt-0.5">{person.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Backdrop shapes */}
                  <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2" />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full blur-3xl opacity-30 pointer-events-none" />
                </div>
              )}

              {/* LIST GRID OF BIRTHDAYS */}
              <div className="p-6 bg-[#090b1c]/70 border border-white/5 rounded-3xl">
                <h3 className="text-sm font-black tracking-widest text-white uppercase mb-4 flex items-center gap-2">
                  <CalendarDays size={16} className="text-purple-400" />
                  <span>Interactive Birthday Records Profile ({filteredPeople.length})</span>
                </h3>

                {filteredPeople.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="p-4 rounded-full bg-slate-900 border border-white/5 text-slate-500 w-fit mx-auto mb-4 scale-110">
                      <Info size={24} />
                    </div>
                    <h4 className="text-md font-bold text-slate-300 uppercase tracking-widest">No match found</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2">No patients, doctors, or staff members fit the current category, month or search conditions.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPeople.map(person => {
                      const isToday = person.month === 5 && person.day === 20;
                      const matchedWish = sentWishes.find(w => w.recipientName.toLowerCase() === person.name.toLowerCase());
                      const hasBeenWished = !!matchedWish;

                      return (
                        <div 
                          key={person.id}
                          className={cn(
                            "p-5 rounded-2xl border bg-slate-950/60 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group hover:border-white/10",
                            isToday 
                              ? "border-fuchsia-500/30 bg-fuchsia-500/[0.02] shadow-xl shadow-fuchsia-950/5 hover:border-fuchsia-500/50" 
                              : "border-white/5"
                          )}
                        >
                          <div className="flex items-start gap-3.5 relative z-10 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                              {person.avatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="text-sm font-bold text-white truncate leading-tight">{person.name}</h4>
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border flex-shrink-0",
                                  person.category === 'Doctor' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                  person.category === 'Admin' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                                  person.category === 'Reception' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" :
                                  person.category === 'Security' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                  "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                )}>
                                  {person.category}
                                </span>
                              </div>
                              <p className="text-[10px] text-white/40 font-black tracking-widest uppercase truncate">{person.role}</p>
                              
                              <div className="mt-3 space-y-1.5 border-t border-white/5 pt-2.5">
                                <div className="flex items-center justify-between text-[11px] font-medium">
                                  <span className="text-white/40">Birthday Date:</span>
                                  <span className="text-white/80 font-semibold uppercase font-mono">{person.birthdayDate}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-medium">
                                  <span className="text-white/40">Current Age:</span>
                                  <span className="text-white/80 font-bold">{person.age} Yrs</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-medium">
                                  <span className="text-white/40">Contact Channel:</span>
                                  <span className="text-[10px] text-cyan-400 truncate max-w-[130px] font-mono">{person.phone}</span>
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-white/5">
                                {hasBeenWished ? (
                                  <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-1">
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">
                                      <CheckCircle2 size={11} /> GREETING TRANSMITTED
                                    </span>
                                    <p className="text-[8px] text-light text-slate-400 uppercase tracking-wide truncate">
                                      Sender: <span className="font-bold text-white">{matchedWish.senderName}</span> ({matchedWish.wishType})
                                    </p>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleOpenSendWizard(person)}
                                    className="w-full py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500 hover:to-cyan-500 text-purple-300 hover:text-white border border-purple-500/20 group-hover:border-purple-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5"
                                  >
                                    <Send size={10} /> Customize & Dispatch
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {isToday && (
                            <div className="absolute top-0 right-0 h-10 w-10 overflow-hidden pointer-events-none">
                              <div className="absolute top-2 right-[-20px] bg-fuchsia-500 text-white font-black text-[7px] py-1 px-5 uppercase tracking-wider rotate-45 text-center shadow-md">
                                Today
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeSubTab === 'dashboards' && (
            <div className="space-y-6">
              {/* Virtual Display Management & Active Celebrant Overview Headers */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 
                 {/* Virtual Wishing Terminals Manager */}
                 <div className="p-6 rounded-2xl bg-[#090b1c] border border-white/5 space-y-4">
                   <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                     <Monitor className="w-5 h-5 text-purple-400" />
                     <h3 className="text-xs font-black uppercase text-white tracking-widest leading-none">Wishes Dashboard Console</h3>
                   </div>
                   
                   <p className="text-[10px] text-white/40 uppercase tracking-wider leading-relaxed">
                     Register virtual celebration kiosks mounted across different hospital divisions from which staff and visitors can cast birthday wishes.
                   </p>

                   {/* Active wishing dashboards list */}
                   <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                     {wishingDashboards.map(db => (
                       <div key={db.id} className="p-3 bg-slate-950/80 border border-white/5 rounded-xl flex items-center justify-between">
                         <div className="min-w-0">
                           <h4 className="text-xs font-bold text-slate-200">{db.name}</h4>
                           <span className="text-[9px] text-white/35 font-semibold block mt-0.5">{db.location}</span>
                         </div>
                         <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/20 border border-cyan-500/10 px-2 py-0.5 rounded uppercase">Live Connection</span>
                       </div>
                     ))}
                   </div>

                   {/* Add wishing dashboard form */}
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     if (!newDbName || !newDbLocation) return;
                     addWishingDashboard({ name: newDbName, location: newDbLocation });
                     setNewDbName('');
                     setNewDbLocation('');
                   }} className="pt-3 border-t border-white/5 space-y-3">
                     <h4 className="text-[9px] font-black text-white/60 uppercase tracking-widest">+ Add New Terminal Board</h4>
                     <div className="grid grid-cols-1 gap-2.5">
                       <input
                         type="text"
                         value={newDbName}
                         onChange={(e) => setNewDbName(e.target.value)}
                         placeholder="Terminal Name, e.g. Doctors Hub"
                         className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-semibold text-white focus:outline-none focus:border-purple-500 font-mono uppercase"
                       />
                       <input
                         type="text"
                         value={newDbLocation}
                         onChange={(e) => setNewDbLocation(e.target.value)}
                         placeholder="Location, e.g. ICU Corridor Desk"
                         className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-semibold text-white focus:outline-none focus:border-purple-500 font-mono uppercase"
                       />
                       <button
                         type="submit"
                         className="w-full py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shrink-0 transition-all duration-300 cursor-pointer"
                       >
                         Mount Virtual Board Terminal
                       </button>
                     </div>
                   </form>
                 </div>

                 {/* Interactive Personal Celebration Board Preview */}
                 <div className="lg:col-span-2 p-6 rounded-2xl bg-[#090b1c]/90 border border-purple-500/10 space-y-4">
                   <div className="flex items-center justify-between border-b border-white/5 pb-2">
                     <div className="flex items-center gap-2">
                       <Tv className="w-5 h-5 text-fuchsia-400 animate-pulse" />
                       <h3 className="text-xs font-black uppercase text-white tracking-widest">Active Celebrant Portal</h3>
                     </div>
                     {/* Select a celebrant today */}
                     <select
                       value={selectedBoardCelebrantId}
                       onChange={(e) => setSelectedBoardCelebrantId(e.target.value)}
                       className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold text-fuchsia-400 uppercase focus:outline-none truncate max-w-xs font-mono"
                     >
                       {birthdayPeople.map(p => (
                         <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                       ))}
                     </select>
                   </div>

                   {(() => {
                     const selectedCelebrant = birthdayPeople.find(p => p.id === selectedBoardCelebrantId);
                     if (!selectedCelebrant) return <p className="text-slate-500 text-xs text-center py-6 leading-none">No person selected.</p>;
                     
                     // Filter wishes sent to this celebrant
                     const personalWishes = sentWishes.filter(
                       w => w.recipientName.toLowerCase() === selectedCelebrant.name.toLowerCase()
                     );

                     return (
                       <div className="space-y-4">
                         
                         {/* Personal Celebration Board Mock Header Banner */}
                         <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border border-purple-500/20 shadow-inner relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
                           <div className="flex items-center gap-4 z-10 w-full min-w-0">
                             <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/25 text-4xl rounded-xl flex items-center justify-center animate-[bounce_2s_infinite] flex-shrink-0">
                               {selectedCelebrant.avatar}
                             </div>
                             <div className="min-w-0 flex-1">
                               <div className="flex items-center gap-1.5 flex-wrap">
                                 <h4 className="text-md font-black text-white leading-none whitespace-nowrap">{selectedCelebrant.name}</h4>
                                 <span className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase bg-fuchsia-500 text-white border border-fuchsia-400">
                                   Birthday Today 🎂
                                 </span>
                               </div>
                               <p className="text-[10px] text-white/50 tracking-widest font-black uppercase leading-tight mt-1.5 truncate">{selectedCelebrant.role}</p>
                               <p className="text-[9px] text-[#ccaaff] font-mono leading-none mt-1">Glow Board Live Network Link Stable</p>
                             </div>
                           </div>

                           <div className="text-center bg-slate-950/60 px-5 py-3 rounded-xl border border-white/5 md:text-right shrink-0 z-10">
                             <span className="text-2xl font-black text-white font-mono leading-none block">{personalWishes.length}</span>
                             <span className="text-[8px] font-black uppercase text-white/40 tracking-wider block mt-1">Wishes Received Today</span>
                           </div>

                           <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent mix-blend-color-dodge pointer-events-none" />
                         </div>

                         {/* Board Live Stream Messages grid */}
                         <div className="space-y-3">
                           <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest">Real-Time Celebration Inbox Stream</h4>
                           
                           {personalWishes.length === 0 ? (
                             <div className="py-12 border border-dashed border-white/5 rounded-xl text-center space-y-2">
                               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No celebration greetings received yet.</p>
                               <p className="text-[10px] text-white/20 capitalize">Be the first to wish them via WhatsApp, SMS, Email or Dashboard channel!</p>
                             </div>
                           ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-72 overflow-y-auto pr-1">
                               {personalWishes.map((wish, idx) => (
                                 <div key={wish.id || idx} className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-2.5 flex flex-col justify-between hover:border-white/10 transition-colors">
                                   <div>
                                     <div className="flex items-center justify-between">
                                       <span className="text-[10px] font-bold text-slate-200">{wish.senderName || 'Unified Scheduler'}</span>
                                       <span className="text-[8px] font-bold text-white/30 font-mono">{wish.timeSent || '09:00 AM'}</span>
                                     </div>
                                     <p className="text-[11px] text-slate-300 italic font-medium mt-1 leading-snug">"{wish.content}"</p>
                                   </div>
                                   
                                   <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                                     <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider block">Terminal: <span className="text-cyan-400 font-mono">{wish.dashboardSource || 'System Hub'}</span></span>
                                     <span className={cn(
                                       "px-2 py-0.5 rounded text-[7px] font-black uppercase border font-mono tracking-widest",
                                       wish.wishType === 'WhatsApp' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                       wish.wishType === 'SMS' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                       wish.wishType === 'Email' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" :
                                       "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                     )}>
                                       {wish.wishType}
                                     </span>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>

                       </div>
                     );
                   })()}

                 </div>

              </div>
            </div>
          )}

          {activeSubTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* PRIMARY AND HOSPITAL COGNITIVE SETTINGS BULK */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* AUTO RULE TOGGLE BOARD */}
                <div className="p-6 bg-[#090b1c]/90 border border-white/5 rounded-3xl space-y-6">
                  <h3 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-2">
                    <Settings size={14} className="text-purple-400" />
                    <span>Automated Sending Logic & Rules Engine</span>
                  </h3>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Enable Automated Wishes</p>
                      <p className="text-[10px] text-white/40">When active, the backend dispatches scheduled templates at designated times.</p>
                    </div>
                    <button
                      onClick={() => updateBirthdaySettings({ autoWishesEnabled: !birthdaySettings.autoWishesEnabled })}
                      className={cn(
                        "relative w-12 h-6 rounded-full p-1 transition-all duration-350",
                        birthdaySettings.autoWishesEnabled ? "bg-purple-500" : "bg-slate-800"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white transition-all duration-300",
                        birthdaySettings.autoWishesEnabled ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Default Sending Channel</label>
                      <select
                        value={birthdaySettings.wishType}
                        onChange={(e) => updateBirthdaySettings({ wishType: e.target.value as any })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-100 uppercase tracking-widest focus:outline-none focus:border-purple-500"
                      >
                        <option value="WhatsApp">🟢 WhatsApp Messenger</option>
                        <option value="SMS">💬 Cellular SMS Gateway</option>
                        <option value="Email">📧 Secured SMTP Email</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Schedule Daily Dispatch Time</label>
                      <select
                        value={birthdaySettings.sendingTime}
                        onChange={(e) => updateBirthdaySettings({ sendingTime: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-100 uppercase tracking-widest focus:outline-none focus:border-purple-500"
                      >
                        <option value="08:00 AM">08:00 AM (Early Morning Call)</option>
                        <option value="09:00 AM">09:00 AM (Hospital Shift Shift Start)</option>
                        <option value="10:00 AM">10:00 AM (Clinical Nominal Slot)</option>
                        <option value="12:00 PM">12:00 PM (Noon Break Shift)</option>
                        <option value="05:00 PM">05:00 PM (Evening Summary Routine)</option>
                      </select>
                    </div>

                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Hospital Branding Name (Placeholder Variable)</label>
                    <div className="relative">
                      <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={birthdaySettings.hospitalName}
                        onChange={(e) => updateBirthdaySettings({ hospitalName: e.target.value })}
                        placeholder="Enter official hospital name..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-slate-100 uppercase tracking-wider focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <p className="text-[9px] text-white/30">Used automatically when injecting <code className="text-purple-400 font-mono">{"{{hospital_name}}"}</code> in communication templates.</p>
                  </div>

                </div>

                {/* TEMPLATE MANAGER SECTION */}
                <div className="p-6 bg-[#090b1c]/90 border border-white/5 rounded-3xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-2">
                      <FileSpreadsheet size={14} className="text-cyan-400" />
                      <span>Custom Channel Content Templates</span>
                    </h3>
                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                      Dynamic Replacements Enabled
                    </span>
                  </div>

                  <div className="space-y-4">
                    {birthdayTemplates.map(template => (
                      <div key={template.id} className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-white uppercase tracking-wider">{template.name}</p>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                            template.type === 'WhatsApp' ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" :
                            template.type === 'Email' ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-400" :
                            "bg-purple-500/10 border-purple-500/25 text-purple-400"
                          )}>
                            {template.type}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <textarea
                            value={template.content}
                            onChange={(e) => updateBirthdayTemplate(template.id, e.target.value)}
                            rows={3}
                            className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-medium"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-slate-400 bg-slate-900/40 p-2 rounded-lg">
                          <span>Live preview translation placeholder matching:</span>
                          <span className="text-slate-300 font-bold uppercase truncate max-w-[200px]">
                            {resolveTemplate(template.content, "Dr. Sarah")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

              {/* CARD PREVIEW / BANNER ASSET SELECTION */}
              <div className="space-y-6">
                
                {/* BRAND BANNERS ASSETS CHANGER */}
                <div className="p-6 bg-[#090b1c]/90 border border-white/5 rounded-3xl space-y-4">
                  <h3 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-2">
                    <Image size={14} className="text-amber-400" />
                    <span>Upload & Custom Digital Banner Presets</span>
                  </h3>
                  <p className="text-[10px] text-white/40 leading-relaxed">Choose an ambient background skin styling for push banners and dashboard visual notification layouts.</p>

                  <div className="space-y-2 pt-2">
                    {BANNER_THEMES.map(theme => {
                      const isSelected = birthdaySettings.selectedBanner === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => updateBirthdaySettings({ selectedBanner: theme.id })}
                          className={cn(
                            "w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all",
                            isSelected ? "border-purple-500 bg-purple-500/5 text-white" : "border-white/5 text-slate-400 bg-slate-950/40 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{theme.preview}</span>
                            <span className="text-xs font-black uppercase tracking-wider">{theme.name}</span>
                          </div>
                          {isSelected && <Check size={14} className="text-purple-400" />}
                        </button>
                      );
                    })}
                  </div>

                </div>

                {/* DIGITAL BIRTHDAY CARD DESIGN CANVAS */}
                <div className="p-6 bg-[#090b1c]/90 border border-white/5 rounded-3xl space-y-4">
                  <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">Live Digital banner layout</h3>
                  
                  <div className={cn("p-5 rounded-2xl border border-white/10 text-white space-y-4 relative overflow-hidden shadow-2xl", activeThemeClass)}>
                    <div className="relative z-10">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Previewing Hospital Greeting Theme</p>
                      <h4 className="text-lg font-black uppercase tracking-tight">Standard Greeting banner Frame</h4>
                    </div>

                    <div className="h-0.5 bg-white/20 w-fit" />

                    <div className="p-4 bg-slate-950/40 backdrop-blur-md rounded-xl border border-white/10 relative z-10">
                      <p className="text-xs text-slate-200 italic font-medium">
                        "{resolveTemplate(birthdayTemplates[0].content, "Alice Thompson")}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between relative z-10 text-[9px] font-extrabold uppercase tracking-widest text-white/60">
                      <span>Hospital Branding</span>
                      <span>AV Care System</span>
                    </div>

                    {/* background deco element */}
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none" />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex items-start gap-3">
                    <Info size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[9px] text-white/40 leading-relaxed">
                      Wishes automations support deep parsing and inject local records phone, email templates with minimal delay. No SMS pricing charges applied under current sandbox.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          )}

          {activeSubTab === 'history' && (
            <div className="p-6 bg-[#090b1c]/90 border border-white/5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-2">
                  <FileText size={16} className="text-cyan-400" />
                  <span>Interactive Audit Trail of Sent Wishes ({sentWishes.length})</span>
                </h3>
                
                {sentWishes.length > 0 && (
                  <button
                    onClick={() => {
                      const headers = 'Sender,Recipient,Category,DateSent,Medium,MessageBody\n';
                      const rows = sentWishes.map(w => 
                        `"AV Care System","${w.recipientName}","${w.role}","${w.dateSent}","${w.wishType}","${w.content.replace(/"/g, '""')}"`
                      ).join('\n');
                      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.setAttribute('href', url);
                      link.setAttribute('download', `Hospital_Wishes_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-300 transition-all cursor-pointer"
                  >
                    <Download size={11} /> Export wishes history
                  </button>
                )}
              </div>

              {sentWishes.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="p-4 rounded-full bg-slate-950 border border-white/5 text-slate-500 w-fit mx-auto mb-4 scale-110">
                    <Send size={24} />
                  </div>
                  <h4 className="text-md font-bold text-slate-300 uppercase tracking-widest">No sent wishes logged</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2">No custom template or automated messages have been sent out yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {sentWishes.map((wish) => (
                    <div key={wish.id} className="p-5 rounded-2xl bg-slate-950 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-slate-950/80">
                      <div className="space-y-1 w-full sm:w-auto">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-100">{wish.recipientName}</h4>
                          <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border border-white/5 bg-slate-900 text-slate-400">
                            {wish.role}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                            wish.wishType === 'WhatsApp' ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" :
                            wish.wishType === 'Email' ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-400" :
                            "bg-purple-500/10 border-purple-500/25 text-purple-400"
                          )}>
                            {wish.wishType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 pt-1">
                          "{wish.content}"
                        </p>
                      </div>

                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">{wish.dateSent}</p>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Delivered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* MODAL VIEW 1: MANUAL CUSTOM SEND DIALOG */}
      <AnimatePresence>
        {selectedRecipient && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipient(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-2">
                  <Send size={14} className="text-purple-400" />
                  <span>Customize & Dispatch Greeting Wizard</span>
                </h3>
                <button 
                  onClick={() => setSelectedRecipient(null)}
                  className="p-1 px-1.5 text-xs text-white/50 hover:text-white bg-white/5 rounded"
                >
                  X
                </button>
              </div>

              <div className="flex items-center gap-3.5 bg-slate-950 p-4 rounded-2xl border border-white/5 mb-4">
                <span className="text-4xl">{selectedRecipient.avatar}</span>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{selectedRecipient.name}</h4>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{selectedRecipient.role}</p>
                  <p className="text-[9px] text-cyan-400 mt-1 font-mono">{selectedRecipient.phone} • {selectedRecipient.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* Channel Select Selection */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Choose Dispatch Channel Medium</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'WhatsApp', label: 'WhatsApp', icon: '🟢' },
                      { id: 'SMS', label: 'Cellular SMS', icon: '💬' },
                      { id: 'Email', label: 'Secured Email', icon: '📧' },
                      { id: 'Dashboard', label: 'Dashboard Board', icon: '🖥️' }
                    ].map(ch => {
                      const isActive = sendingChannel === ch.id;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            setSendingChannel(ch.id as any);
                            const matchedTemplate = birthdayTemplates.find(t => t.type === ch.id) || birthdayTemplates[0];
                            setCustomizedMessageText(resolveTemplate(matchedTemplate.content, selectedRecipient.name));
                          }}
                          className={cn(
                            "py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all",
                            isActive ? "border-purple-500 bg-purple-500/10 text-white" : "border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <span>{ch.icon}</span>
                          <span>{ch.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                 {/* Dashboard Specific options */}
                 {sendingChannel === 'Dashboard' && (
                   <div className="space-y-4 animate-in fade-in duration-300">
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Target Dashboard Recipient Role Overview</label>
                       <div className="grid grid-cols-5 gap-2">
                         {[
                           { id: 'Admin Dashboard', label: 'Admin', icon: '👤' },
                           { id: 'Doctor Dashboard', label: 'Doctor', icon: '🩺' },
                           { id: 'Reception Dashboard', label: 'Reception', icon: '💼' },
                           { id: 'Security Dashboard', label: 'Security', icon: '🛡️' },
                           { id: 'Ambulance Dashboard', label: 'Ambulance', icon: '🚑' }
                         ].map(board => {
                           const isBoardActive = selectedDashboardBoard === board.id;
                           return (
                             <button
                               key={board.id}
                               type="button"
                               onClick={() => setSelectedDashboardBoard(board.id)}
                               className={cn(
                                 "py-2 px-1 rounded-xl border text-[9px] font-black uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all",
                                 isBoardActive ? "border-purple-500 bg-purple-500/10 text-white" : "border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                               )}
                             >
                               <span className="text-sm">{board.icon}</span>
                               <span className="text-[8px] font-black scale-90">{board.label}</span>
                             </button>
                           );
                         })}
                       </div>
                     </div>

                     <div className="space-y-1.5 font-mono">
                       <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Signature Sender Role</label>
                       <input 
                         type="text"
                         value={senderSignatureName}
                         onChange={(e) => setSenderSignatureName(e.target.value)}
                         placeholder="e.g. Dr. Satish Nair"
                         className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                       />
                     </div>
                   </div>
                 )}

                {/* Message Custom Box */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Customized Greeting Payload (Supports Emojis)</label>
                  <textarea
                    value={customizedMessageText}
                    onChange={(e) => setCustomizedMessageText(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-3.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <p className="text-[9px] text-white/30 text-right">Character count: {customizedMessageText.length}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRecipient(null)}
                    className="w-1/3 py-3 rounded-xl border border-white/10 hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                  >
                    Discard
                  </button>

                  {simulationComplete ? (
                    <div className="w-2/3 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-emerald-500/25">
                      <CheckCircle2 size={14} className="animate-bounce" /> Dispatch Successful!
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isSendingSimulated}
                      onClick={handleDispatchWish}
                      className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-950/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isSendingSimulated ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-slate-500 border-t-white animate-spin" />
                          <span>Routing packets...</span>
                        </>
                      ) : (
                        <>
                          <Send size={12} />
                          <span>Transmit Greeting Now</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL VIEW 2: REGISTER RECORD INPUT OVERLAY */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-2">
                  <UserPlus size={14} className="text-purple-400" />
                  <span>Register Custom Birthday Profile</span>
                </h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 px-1.5 text-xs text-white/50 hover:text-white bg-white/5 rounded"
                >
                  X
                </button>
              </div>

              <form onSubmit={handleSaveRecord} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newRecordName}
                      onChange={(e) => setNewRecordName(e.target.value)}
                      placeholder="e.g. Liam Sterling"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Profile Icon Avatar</label>
                    <select
                      value={newRecordAvatar}
                      onChange={(e) => setNewRecordAvatar(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="👩">👩 Female Person</option>
                      <option value="👨">👨 Male Person</option>
                      <option value="👩‍⚕️">👩‍⚕️ Female Clinical</option>
                      <option value="👨‍⚕️">👨‍⚕️ Male Clinical</option>
                      <option value="👵">👵 Elder Female</option>
                      <option value="👴">👴 Elder Male</option>
                      <option value="👮‍♂️">👮‍♂️ Security Lead</option>
                      <option value="👨‍✈️">👨‍✈️ Emergency Pilot</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Role Category</label>
                    <select
                      value={newRecordCategory}
                      onChange={(e) => setNewRecordCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Reception">Reception</option>
                      <option value="Security">Security</option>
                      <option value="Ambulance">Ambulance</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Exact Clinical Role</label>
                    <input
                      type="text"
                      required
                      value={newRecordRole}
                      onChange={(e) => setNewRecordRole(e.target.value)}
                      placeholder="e.g. Ward 3A Patient"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Age</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={newRecordAge}
                      onChange={(e) => setNewRecordAge(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Birthday Date</label>
                    <input
                      type="date"
                      required
                      value={newRecordBirthday}
                      onChange={(e) => setNewRecordBirthday(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Secured Mobile Number</label>
                    <input
                      type="text"
                      required
                      value={newRecordPhone}
                      onChange={(e) => setNewRecordPhone(e.target.value)}
                      placeholder="+91 "
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">SMTP Email Address</label>
                  <input
                    type="email"
                    required
                    value={newRecordEmail}
                    onChange={(e) => setNewRecordEmail(e.target.value)}
                    placeholder="e.g. patientname@gmail.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-1/2 py-3 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-950/25 transition-all"
                  >
                    Save Record
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL VIEW 3: PRINT READY PDF COGNITIVE PREVIEW SCREEN */}
      <AnimatePresence>
        {isPrintPreviewOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsPrintPreviewOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Printer size={16} className="text-purple-400" />
                  <span className="text-xs font-black tracking-widest text-white uppercase">Secured Print-Ready Document Layout</span>
                </div>
                <button 
                  onClick={() => setIsPrintPreviewOpen(false)}
                  className="p-1 px-1.5 text-xs text-slate-400 hover:text-white bg-white/5 rounded"
                >
                  X
                </button>
              </div>

              {/* Printable Area Wrapper */}
              <div className="bg-white text-slate-900 p-6 rounded-2xl max-h-[400px] overflow-y-auto font-sans text-left space-y-4 shadow-inner">
                
                {/* Simulated Sheet Header */}
                <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-3">
                  <div>
                    <h3 className="text-sm font-black tracking-widest uppercase text-slate-950">{birthdaySettings.hospitalName}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Clinical Birthdays & Auto Greets Register List</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-600 font-bold">DATE: {new Date().toLocaleDateString('en-US')}</p>
                    <p className="text-[9px] text-fuchsia-600 font-bold">CONFIDENTIAL DATA</p>
                  </div>
                </div>

                {/* Simulated Sheet Table */}
                <table className="w-full text-[10px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[9px] uppercase tracking-wider text-slate-500 font-extrabold bg-slate-50">
                      <th className="py-2 px-1">ID</th>
                      <th className="py-2 px-1">Recipient Name</th>
                      <th className="py-2 px-1">Category</th>
                      <th className="py-2 px-1">Clinical Role</th>
                      <th className="py-2 px-1">Age</th>
                      <th className="py-2 px-1">Birthdate</th>
                      <th className="py-2 px-1">Primary Channel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {birthdayPeople.map((p, idx) => (
                      <tr key={p.id} className="border-b border-slate-100 font-medium hover:bg-slate-50 text-slate-800">
                        <td className="py-2 px-1 font-mono text-slate-500">BP-0{idx + 1}</td>
                        <td className="py-2 px-1 font-bold">{p.name}</td>
                        <td className="py-2 px-1">{p.category}</td>
                        <td className="py-2 px-1">{p.role}</td>
                        <td className="py-2 px-1">{p.age} yrs</td>
                        <td className="py-2 px-1 font-mono text-slate-600">{p.birthdayDate}</td>
                        <td className="py-2 px-1 font-mono text-slate-600">{p.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Simulated Sheet Footer */}
                <div className="border-t border-dashed border-slate-300 pt-3 text-center text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                  Verified and synchronized with AEGIS CARE OS central database server registry list. End of report list.
                </div>

              </div>

              {/* Action options */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-[9px] text-white/40 max-w-xs leading-relaxed">
                  Tip: Copying to clipboard allows easy injection directly in Microsoft Excel, WhatsApp Group blasts, or email newsletters.
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text = birthdayPeople.map(p => `${p.name} (${p.category} - ${p.role}) Born: ${p.birthdayDate}`).join('\n');
                      navigator.clipboard.writeText(text);
                    }}
                    className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded-xl text-xs font-black uppercase text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    Copy List Text
                  </button>
                  <button
                    onClick={() => {
                      // Satisfying simulation of triggering immediate local printing flow
                      window.print();
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 rounded-xl text-xs font-black uppercase text-white transition-all cursor-pointer"
                  >
                    Print Sheet Now
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
