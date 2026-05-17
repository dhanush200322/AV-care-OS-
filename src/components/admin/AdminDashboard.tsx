
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { DashboardOverview } from './DashboardOverview';
import { TableModule } from './TableModule';
import { CommandPalette } from './CommandPalette';
import { PATIENTS_DATA, STAFF_DATA, BRANCHES_DATA, BILLING_DATA, PHARMACY_DATA, LAB_REPORTS_DATA } from '../../constants/mockData';
import { BillingModule } from './BillingModule';
import { PharmacyModule } from './PharmacyModule';
import { LabReportsModule } from './LabReportsModule';
import { PatientEditModal } from './PatientModals';
import { GenerateInvoiceModal, InvoiceModal } from './BillingModals';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  Radio, 
  ArrowRight,
  Shield,
  Stethoscope,
  Briefcase,
  Ambulance as AmbulanceIcon,
  Globe
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

const AUDIENCE_ICONS: any = {
  all: Globe,
  doctor: Stethoscope,
  reception: Briefcase,
  security: Shield,
  ambulance: AmbulanceIcon
};

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  
  // New Broadcast States
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'doctor' | 'reception' | 'security' | 'ambulance'>('all');

  const { 
    broadcasts, 
    addBroadcast, 
    isBillingModalOpen, 
    setIsBillingModalOpen,
    selectedInvoice,
    setSelectedInvoice,
    patients,
    selectedPatient,
    setSelectedPatient,
    isPatientEditModalOpen,
    setIsPatientEditModalOpen
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const handleTransmit = () => {
    if (!broadcastTitle || !broadcastMsg) {
      addToast('error', 'Please fill all broadcast protocol fields.');
      return;
    }
    
    addBroadcast({
      title: broadcastTitle,
      message: broadcastMsg,
      audience: broadcastAudience
    });

    addToast('success', `Broadcast waves successfully transmitted to ${broadcastAudience} units.`);
    setBroadcastTitle('');
    setBroadcastMsg('');
  };

  const renderContent = () => {
    if (activeTab.startsWith('billing-')) {
       const sub = activeTab.split('billing-')[1];
       return <BillingModule subTab={sub} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'patients':
        return (
          <TableModule 
            title="Patient Registry" 
            subtitle="Centralized biometric database and medical history archives." 
            data={patients}
            entityName="Patient"
            columns={[
              { key: 'id', label: 'UUID' },
              { key: 'name', label: 'Full Name' },
              { key: 'age', label: 'Age' },
              { key: 'condition', label: 'Condition', render: (val) => (
                <span className={cn(
                  "px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                  val === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                  val === 'Stable' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                )}>
                  {val}
                </span>
              )},
              { key: 'ward', label: 'Placement' },
              { key: 'status', label: 'Auth Status' },
            ]}
            onAddClick={() => addToast('info', 'Initializing new patient onboarding protocol...')}
            onEditClick={(patient) => {
              setSelectedPatient(patient);
              setIsPatientEditModalOpen(true);
            }}
          />
        );
      case 'staff':
        return (
          <TableModule 
            title="Staff Roster" 
            subtitle="Deployment status and performance analytics for medical personnel." 
            data={STAFF_DATA}
            entityName="Staff"
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Officer' },
              { key: 'role', label: 'Designation' },
              { key: 'department', label: 'Unit' },
              { key: 'status', label: 'Duty State', render: (val) => (
                <div className="flex items-center gap-2">
                   <div className={cn("w-1.5 h-1.5 rounded-full", val === 'On Duty' ? 'bg-emerald-500' : 'bg-red-500')} />
                   <span className="uppercase tracking-widest text-[9px] font-bold">{val}</span>
                </div>
              )},
              { key: 'joinDate', label: 'Commission' },
            ]}
          />
        );
      case 'billing':
        return <BillingModule subTab="invoices" />;
      case 'pharmacy':
        return <PharmacyModule />;
      case 'lab-reports':
        return <LabReportsModule />;
      case 'branches':
         return (
            <TableModule 
              title="Facility Network" 
              subtitle="Real-time multi-branch operational control and logistics." 
              data={BRANCHES_DATA}
              entityName="Branch"
              columns={[
                { key: 'name', label: 'Node Name' },
                { key: 'location', label: 'Sector' },
                { key: 'doctors', label: 'Personnel' },
                { key: 'patients', label: 'Active Load' },
                { key: 'status', label: 'Node Pulse' },
              ]}
            />
         );
      case 'broadcast':
         return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-2">
                  <span>Admin</span>
                  <Radio size={10} className="text-purple-500" />
                  <span className="text-purple-400">Broadcast</span>
               </div>
               <header>
                  <h1 className="text-3xl font-light tracking-tight text-white mb-2">
                    Aegis <span className="font-bold text-purple-500">Broadcaster</span>
                  </h1>
                  <p className="text-white/40 text-sm tracking-widest font-light">Role-based encrypted communication across all system terminals.</p>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-10 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl space-y-6 shadow-2xl">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Target Audience</label>
                        <div className="grid grid-cols-5 gap-2">
                          {['all', 'doctor', 'reception', 'security', 'ambulance'].map((role) => {
                            const Icon = AUDIENCE_ICONS[role];
                            return (
                              <button
                                key={role}
                                onClick={() => setBroadcastAudience(role as any)}
                                className={cn(
                                  "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all group",
                                  broadcastAudience === role 
                                    ? "bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/25" 
                                    : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:border-white/10"
                                )}
                              >
                                <Icon size={16} className={cn("transition-transform group-hover:scale-110", broadcastAudience === role ? "text-white" : "text-white/20")} />
                                <span className={cn("text-[8px] font-black uppercase tracking-widest", broadcastAudience === role ? "text-white" : "text-white/20")}>
                                  {role}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Protocol Title</label>
                        <input 
                          type="text" 
                          placeholder="URGENT: SYSTEM MAINTENANCE" 
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 text-sm text-white focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-white/10" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Message Payload</label>
                        <textarea 
                          placeholder="Type your broadcast message here..." 
                          value={broadcastMsg}
                          onChange={(e) => setBroadcastMsg(e.target.value)}
                          rows={4} 
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 text-sm text-white focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-white/10" 
                        />
                     </div>
                     <button 
                        onClick={handleTransmit}
                        className="w-full py-5 rounded-2xl bg-purple-500 text-white font-black text-xs tracking-[0.5em] uppercase shadow-2xl shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                     >
                        TRANSMIT ENCRYPTED WAVES
                        <ArrowRight size={16} />
                     </button>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 ml-2 flex items-center justify-between">
                        <span>Transmission Log</span>
                        <span className="text-purple-500">{broadcasts.length} Active</span>
                     </h3>
                     <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                        {broadcasts.map((b) => (
                           <motion.div 
                              key={b.id} 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3 group hover:bg-white/5 transition-colors relative overflow-hidden"
                           >
                              <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Radio size={40} className="text-purple-500" />
                              </div>
                              <div className="flex justify-between items-center relative z-10">
                                 <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">Target: {b.audience}</span>
                                 <span className="text-[9px] font-bold uppercase text-white/20">{new Date(b.createdAt).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-xs font-bold text-white uppercase tracking-wider relative z-10">{b.title}</p>
                              <p className="text-[10px] text-white/40 leading-relaxed uppercase relative z-10">{b.message}</p>
                           </motion.div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         );
      default:
        return (
          <div className="flex items-center justify-center h-[60vh] opacity-20">
            <p className="text-sm font-black uppercase tracking-[0.5em]">Module Under Maintenance</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
        <TopNavbar onLogout={onLogout} onSearchClick={() => setIsSearchOpen(true)} />
        
        <div className="p-8 max-w-7xl w-full mx-auto pb-32">
          {renderContent()}
        </div>

        {/* HUD Decorations */}
        <div className="fixed bottom-0 right-0 p-8 pt-20 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10 w-full flex justify-end">
           <div className="flex items-center gap-8 text-[9px] font-black tracking-widest uppercase text-white/10">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span>CORE STABLE</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                 <span>ENCRYPTION ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                 <span>LATENCY: 42MS</span>
              </div>
           </div>
        </div>
      </main>

      {/* Overlays */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AnimatePresence>
        {isBillingModalOpen && <GenerateInvoiceModal onClose={() => setIsBillingModalOpen(false)} />}
        {selectedInvoice && <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
        {isPatientEditModalOpen && <PatientEditModal onClose={() => setIsPatientEditModalOpen(false)} />}
      </AnimatePresence>

      {/* Toast System */}
      <div className="fixed top-24 right-8 z-[200] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={cn(
                "p-4 pr-12 rounded-2xl border backdrop-blur-3xl shadow-2xl relative min-w-[300px] overflow-hidden group",
                toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                toast.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 
                'bg-purple-500/10 border-purple-500/20'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl",
                  toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                  toast.type === 'error' ? 'bg-red-500/20 text-red-500' :
                  'bg-purple-500/20 text-purple-400'
                )}>
                  {toast.type === 'success' ? <CheckCircle2 size={16} /> : 
                   toast.type === 'error' ? <AlertCircle size={16} /> : <Info size={16} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">{toast.type} Alert</p>
                  <p className="text-xs font-bold text-white uppercase tracking-tight">{toast.message}</p>
                </div>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-white/20 hover:text-white"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full">
                 <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-current opacity-30"
                 />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Global Glow */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};
