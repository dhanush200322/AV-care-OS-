import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, CheckCircle2, AlertCircle, Info, X, LayoutDashboard, UserPlus, ListOrdered, CreditCard, Siren } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { useReceptionStore } from '../../store/receptionStore';
import { ReceptionSidebar } from './ReceptionSidebar';
import { ReceptionTopNavbar } from './ReceptionTopNavbar';
import { ReceptionCommandPalette } from './ReceptionCommandPalette';
import { ReceptionAIAssistant } from './ReceptionAIAssistant';
import { ReceptionDashboardOverview } from './ReceptionDashboardOverview';
import { PatientRegistrationModule } from './modules/PatientRegistrationModule';
import { ReceptionAppointmentsModule } from './modules/ReceptionAppointmentsModule';
import { QueueTokenModule } from './modules/QueueTokenModule';
import { LiveTrackerModule } from './modules/LiveTrackerModule';
import { BillingCounterModule } from './modules/BillingCounterModule';
import { WaitingHallModule } from './modules/WaitingHallModule';
import { NotificationCenterModule } from './modules/NotificationCenterModule';
import { HelpDeskModule } from './modules/HelpDeskModule';
import { ReceptionMessagesModule } from './modules/ReceptionMessagesModule';
import { ReceptionReportsModule } from './modules/ReceptionReportsModule';
import { ReceptionSettingsModule } from './modules/ReceptionSettingsModule';

type Toast = { id: string; type: 'success' | 'error' | 'info'; message: string };

const MOBILE_NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'registration', icon: UserPlus, label: 'Register' },
  { id: 'queue', icon: ListOrdered, label: 'Queue' },
  { id: 'billing', icon: CreditCard, label: 'Bill' },
  { id: 'helpdesk', icon: Siren, label: 'Help' },
];

export const ReceptionDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const { broadcasts, sentWishes, isEmergencyMode } = useStore();
  const { simulateRealtimeTick } = useReceptionStore();

  const activeBroadcasts = broadcasts?.filter((b) => b.audience === 'all' || b.audience === 'reception') || [];
  const incomingGreetings =
    sentWishes?.filter((w) => w.wishType === 'Dashboard' && w.dashboardSource === 'Reception Dashboard') || [];

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => simulateRealtimeTick(), 30000);
    return () => clearInterval(interval);
  }, [simulateRealtimeTick]);

  const renderContent = () => {
    const toastProps = { onToast: addToast };
    switch (activeTab) {
      case 'dashboard':
        return <ReceptionDashboardOverview />;
      case 'registration':
        return <PatientRegistrationModule {...toastProps} />;
      case 'appointments':
        return <ReceptionAppointmentsModule {...toastProps} />;
      case 'queue':
        return <QueueTokenModule {...toastProps} />;
      case 'tracker':
        return <LiveTrackerModule {...toastProps} />;
      case 'billing':
        return <BillingCounterModule {...toastProps} />;
      case 'waiting-hall':
        return <WaitingHallModule {...toastProps} />;
      case 'notifications':
        return <NotificationCenterModule {...toastProps} />;
      case 'helpdesk':
        return <HelpDeskModule {...toastProps} />;
      case 'messages':
        return <ReceptionMessagesModule {...toastProps} />;
      case 'reports':
        return <ReceptionReportsModule />;
      case 'settings':
        return <ReceptionSettingsModule {...toastProps} />;
      default:
        return <ReceptionDashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-white reception-dashboard" style={{ backgroundColor: '#071A1D' }}>
      <div className="hidden lg:block">
        <ReceptionSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <ReceptionTopNavbar
          onSearchClick={() => setIsSearchOpen(true)}
          onAIToggle={() => setAiOpen((o) => !o)}
          onQuickRegister={() => setActiveTab('registration')}
          scrolled={scrolled}
        />

        <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24 lg:pb-8">
          {isEmergencyMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-4 rounded-2xl bg-[#FF4444]/15 border border-[#FF4444]/40 flex items-center gap-3">
              <Siren className="text-[#FF4444] animate-pulse" size={20} />
              <p className="text-sm font-bold text-[#FF4444] uppercase">Emergency Front Desk Protocol Active</p>
            </motion.div>
          )}

          {incomingGreetings.length > 0 && (
            <div className="space-y-3 mb-6">
              {incomingGreetings.map((g, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                  <p className="text-xs text-purple-300 font-bold">Greeting · {g.senderName}</p>
                  <p className="text-sm text-white mt-1">{g.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeBroadcasts.length > 0 && (
            <div className="space-y-3 mb-6">
              {activeBroadcasts.map((b) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-[#00C2A8]/10 border border-[#00C2A8]/30 flex gap-4">
                  <Radio className="text-[#00FFD5] shrink-0 animate-pulse" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-white">{b.title}</h4>
                    <p className="text-xs text-[#89A9B0] mt-1">{b.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto py-4">
            {renderContent()}
          </motion.div>
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around p-2 bg-[#0D262B]/95 backdrop-blur-xl border-t border-[#00C2A8]/20 safe-area-pb">
          {MOBILE_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn('flex flex-col items-center gap-1 p-2 rounded-xl min-w-[56px] min-h-[48px]', activeTab === item.id ? 'text-[#00FFD5]' : 'text-[#89A9B0]')}
            >
              <item.icon size={20} />
              <span className="text-[9px] font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <ReceptionCommandPalette open={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={setActiveTab} />
      <ReceptionAIAssistant forceOpen={aiOpen} onForceOpenChange={setAiOpen} />

      <div className="fixed top-24 right-6 z-[250] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={cn(
                'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl min-w-[280px]',
                t.type === 'success' && 'bg-[#00C2A8]/20 border-[#00FFD5]/40 text-[#00FFD5]',
                t.type === 'error' && 'bg-[#FF4444]/20 border-[#FF4444]/40 text-[#FF4444]',
                t.type === 'info' && 'bg-[#00C2E0]/20 border-[#00C2E0]/40 text-[#00C2E0]'
              )}
            >
              {t.type === 'success' && <CheckCircle2 size={18} />}
              {t.type === 'error' && <AlertCircle size={18} />}
              {t.type === 'info' && <Info size={18} />}
              <span className="text-sm flex-1">{t.message}</span>
              <button type="button" onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}><X size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed top-[-15%] right-[-10%] w-[45%] h-[45%] bg-[#00C2A8]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[35%] h-[35%] bg-[#00C2E0]/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};
