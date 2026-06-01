
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { DashboardOverview } from './DashboardOverview';
import { TableModule } from './TableModule';
import { CommandPalette } from './CommandPalette';
import { BillingModule } from './BillingModule';
import { PharmacyModule } from './PharmacyModule';
import { LabReportsModule } from './LabReportsModule';
import { PatientEditModal } from './PatientModals';
import { GenerateInvoiceModal, InvoiceModal } from './BillingModals';
import { AIAssistant } from './AIAssistant';
import { PatientFlowKanban } from './PatientFlowKanban';
import { ProfileModule } from './ProfileModule';
import { SettingsModule } from './SettingsModule';
import { EmptyState } from './EmptyState';
import { DoctorsModule } from './DoctorsModule';
import { AppointmentsModule } from './AppointmentsModule';
import { MessagesModule } from './MessagesModule';
import { RolesModule } from './RolesModule';
import { NotificationsModule } from './NotificationsModule';
import { BirthdayModule } from './BirthdayModule';
import { StaffHRModule } from './StaffHRModule';
import { InventoryModule } from './InventoryModule';
import { AmbulanceModule } from './AmbulanceModule';
import { ReportsModule } from './ReportsModule';
import { AIPortalModule } from './AIPortalModule';
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
  Globe,
  Activity,
  AlertTriangle,
  Zap,
  Box,
  Layout,
  TrendingUp,
  Calendar,
  MessageSquare,
  Siren,
  Users,
  Gift
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { CommunicationHubLayer } from '../shared/communications/CommunicationHubLayer';

const AUDIENCE_ICONS: any = {
  all: Globe,
  doctor: Stethoscope,
  reception: Briefcase,
  security: Shield,
  ambulance: AmbulanceIcon
};

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

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
    setIsPatientEditModalOpen,
    sentWishes
  } = useStore();

  const incomingGreetings =
    sentWishes?.filter((w) => w.wishType === 'Dashboard' && w.dashboardSource === 'Admin Dashboard') || [];

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

  useEffect(() => {
    const handleNavigation = (e: Event) => {
       const tab = (e as CustomEvent).detail;
       if (tab) setActiveTab(tab);
    };
    document.addEventListener('NAVIGATE_TAB', handleNavigation);
    return () => document.removeEventListener('NAVIGATE_TAB', handleNavigation);
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
      case 'doctors':
        return <DoctorsModule />;
      case 'patients':
        return <PatientFlowKanban />;
      case 'appointments':
        return <AppointmentsModule />;
      case 'lab-reports':
        return <LabReportsModule />;
      case 'pharmacy':
        return <PharmacyModule />;
      case 'billing':
        return <BillingModule subTab="invoices" />;
      case 'messages':
        return <MessagesModule onToast={addToast} />;
      case 'birthdays':
        return <BirthdayModule dashboardTheme="admin" />;
      case 'staff-hr':
        return <StaffHRModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'ambulance-service':
        return <AmbulanceModule />;
      case 'reports':
        return <ReportsModule />;
      case 'ai-assistant-page':
        return <AIPortalModule />;
      case 'notifications':
        return <NotificationsModule />;
      case 'roles':
        return <RolesModule />;
      case 'settings':
        return <SettingsModule />;
      case 'profile':
        return <ProfileModule />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050816] overflow-hidden font-sans selection:bg-cyan-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative w-full overflow-x-hidden">
        <TopNavbar
          onLogout={handleLogout}
          onSearchClick={() => setIsSearchOpen(true)}
          onOpenCommunication={() => setActiveTab('messages')}
        />
        
        {/* Consistent Hero Header for Context */}
        {activeTab !== 'dashboard' && (
           <div className="px-6 pt-6 pb-2">
               <h1 className="text-xl font-black text-white tracking-widest uppercase">
                 {activeTab.replace('-', ' ')}
               </h1>
               <div className="h-0.5 w-12 bg-purple-500 mt-2 rounded-full" />
           </div>
        )}

        {incomingGreetings.length > 0 && (
          <div className="px-6 pt-4">
            <div className="space-y-3">
              {incomingGreetings.map((g, idx) => (
                <motion.div
                  key={`${g.id}-${idx}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex gap-3"
                >
                  <Gift className="text-purple-300 shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-purple-300 font-bold uppercase tracking-wider">Birthday · {g.senderName}</p>
                    <p className="text-sm text-white mt-1">{g.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 max-w-full mx-auto pb-32 w-full">
          {renderContent()}
        </div>

        {/* HUD Decorations */}
        <div className="fixed bottom-0 right-0 p-6 pt-20 bg-gradient-to-t from-[#050816] to-transparent pointer-events-none z-10 w-full flex justify-end">
           <div className="flex items-center gap-6 text-[9px] font-black tracking-widest uppercase text-white/20">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_Infinity]" />
                 <span>CORE SECURE</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-500/50">
                 <div className="w-1.5 h-1.5 rounded-full bg-current animate-[pulse_1.5s_ease-in-out_Infinity]" />
                 <span>AEGIS AI ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-[pulse_3s_ease-in-out_Infinity]" />
                 <span>UDP: 32MS</span>
              </div>
           </div>
        </div>

        <AIAssistant />
        <CommunicationHubLayer accent="#FF4444" onToast={addToast} />
      </main>

      {/* Overlays */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AnimatePresence>
        {isBillingModalOpen && <GenerateInvoiceModal onClose={() => setIsBillingModalOpen(false)} />}
        {selectedInvoice && <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
        {isPatientEditModalOpen && <PatientEditModal onClose={() => setIsPatientEditModalOpen(false)} />}
      </AnimatePresence>

      {/* Toast System */}
      <div className="fixed top-24 right-6 z-[200] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={cn(
                "p-4 pr-12 rounded-xl border backdrop-blur-3xl shadow-2xl relative min-w-[280px] overflow-hidden group",
                toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                toast.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 
                'bg-purple-500/10 border-purple-500/20'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg border",
                  toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' :
                  toast.type === 'error' ? 'bg-red-500/20 text-red-500 border-red-500/20' :
                  'bg-purple-500/20 text-purple-400 border-purple-500/20'
                )}>
                  {toast.type === 'success' ? <CheckCircle2 size={16} /> : 
                   toast.type === 'error' ? <AlertCircle size={16} /> : <Info size={16} />}
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">{toast.type} Alert</p>
                  <p className="text-[11px] font-bold text-white uppercase tracking-wider">{toast.message}</p>
                </div>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-white/20 hover:text-white"
              >
                <X size={14} />
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
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none z-[-1]" />
    </div>
  );
};
