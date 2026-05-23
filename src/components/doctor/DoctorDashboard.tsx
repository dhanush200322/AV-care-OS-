import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, CheckCircle2, AlertCircle, Info, X, LayoutDashboard, Calendar, Users, Brain, Siren } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { useDoctorStore } from '../../store/doctorStore';
import { DoctorSidebar } from './DoctorSidebar';
import { DoctorTopNavbar } from './DoctorTopNavbar';
import { DoctorCommandPalette } from './DoctorCommandPalette';
import { DoctorAIAssistant } from './DoctorAIAssistant';
import { DoctorDashboardOverview } from './DoctorDashboardOverview';
import { DoctorAppointmentsModule } from './modules/DoctorAppointmentsModule';
import { PatientQueueModule } from './modules/PatientQueueModule';
import { ConsultationsModule } from './modules/ConsultationsModule';
import { MedicalRecordsModule } from './modules/MedicalRecordsModule';
import { AIDiagnosisModule } from './modules/AIDiagnosisModule';
import { PrescriptionsModule } from './modules/PrescriptionsModule';
import { DoctorLabReportsModule } from './modules/DoctorLabReportsModule';
import { TelemedicineModule } from './modules/TelemedicineModule';
import { EmergencyModule } from './modules/EmergencyModule';
import { DoctorMessagesModule } from './modules/DoctorMessagesModule';
import { DoctorAnalyticsModule } from './modules/DoctorAnalyticsModule';
import { DoctorSettingsModule } from './modules/DoctorSettingsModule';

type Toast = { id: string; type: 'success' | 'error' | 'info'; message: string };

const MOBILE_NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'appointments', icon: Calendar, label: 'Appts' },
  { id: 'queue', icon: Users, label: 'Queue' },
  { id: 'ai-diagnosis', icon: Brain, label: 'AI' },
  { id: 'emergency', icon: Siren, label: 'ER' },
];

export const DoctorDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const { broadcasts, sentWishes, isEmergencyMode } = useStore();
  const { simulateRealtimeTick } = useDoctorStore();

  const activeBroadcasts = broadcasts?.filter((b) => b.audience === 'all' || b.audience === 'doctor') || [];
  const incomingGreetings =
    sentWishes?.filter((w) => w.wishType === 'Dashboard' && w.dashboardSource === 'Doctor Dashboard') || [];

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, []);

  const renderContent = () => {
    const toastProps = { onToast: addToast };
    switch (activeTab) {
      case 'dashboard':
        return <DoctorDashboardOverview />;
      case 'appointments':
        return <DoctorAppointmentsModule {...toastProps} />;
      case 'queue':
        return <PatientQueueModule {...toastProps} />;
      case 'consultations':
        return <ConsultationsModule {...toastProps} />;
      case 'records':
        return <MedicalRecordsModule {...toastProps} />;
      case 'ai-diagnosis':
        return <AIDiagnosisModule {...toastProps} />;
      case 'prescriptions':
        return <PrescriptionsModule {...toastProps} />;
      case 'lab-reports':
        return <DoctorLabReportsModule {...toastProps} />;
      case 'telemedicine':
        return <TelemedicineModule {...toastProps} />;
      case 'emergency':
        return <EmergencyModule {...toastProps} />;
      case 'messages':
        return <DoctorMessagesModule {...toastProps} />;
      case 'analytics':
        return <DoctorAnalyticsModule />;
      case 'settings':
        return <DoctorSettingsModule {...toastProps} />;
      default:
        return <DoctorDashboardOverview />;
    }
  };

  return (
    <div
      className="flex h-screen w-full overflow-hidden font-sans text-white doctor-dashboard"
      style={{ backgroundColor: '#071B11' }}
    >
      <div className="hidden lg:block">
        <DoctorSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <DoctorTopNavbar
          onSearchClick={() => setIsSearchOpen(true)}
          onAIToggle={() => setAiOpen((o) => !o)}
          scrolled={scrolled}
        />

        <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24 lg:pb-8">
          <AnimatePresence>
            {isEmergencyMode && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-4 rounded-2xl bg-[#FF4444]/15 border border-[#FF4444]/40 flex items-center gap-3"
              >
                <Siren className="text-[#FF4444] animate-pulse" size={20} />
                <p className="text-sm font-bold text-[#FF4444] uppercase tracking-wider">Hospital Emergency Mode Active</p>
              </motion.div>
            )}
          </AnimatePresence>

          {incomingGreetings.length > 0 && (
            <div className="space-y-3 mb-6">
              {incomingGreetings.map((g, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30"
                >
                  <p className="text-xs text-purple-300 font-bold">Birthday · {g.senderName}</p>
                  <p className="text-sm text-white mt-1">{g.content}</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeBroadcasts.length > 0 && (
            <div className="space-y-3 mb-6">
              {activeBroadcasts.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-[#00D68F]/10 border border-[#00D68F]/30 flex gap-4"
                >
                  <Radio className="text-[#00FFA3] shrink-0 animate-pulse" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-white">{b.title}</h4>
                    <p className="text-xs text-[#8AA39B] mt-1">{b.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[1600px] mx-auto py-4"
          >
            {renderContent()}
          </motion.div>
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around p-2 bg-[#0D2818]/95 backdrop-blur-xl border-t border-[#00D68F]/20 safe-area-pb">
          {MOBILE_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl min-w-[56px] min-h-[48px]',
                activeTab === item.id ? 'text-[#00FFA3]' : 'text-[#8AA39B]'
              )}
            >
              <item.icon size={20} />
              <span className="text-[9px] font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <DoctorCommandPalette open={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={setActiveTab} />
      <DoctorAIAssistant forceOpen={aiOpen} onForceOpenChange={setAiOpen} />

      <div className="fixed top-24 right-6 z-[250] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={cn(
                'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg min-w-[280px]',
                t.type === 'success' && 'bg-[#00D68F]/20 border-[#00FFA3]/40 text-[#00FFA3]',
                t.type === 'error' && 'bg-[#FF4444]/20 border-[#FF4444]/40 text-[#FF4444]',
                t.type === 'info' && 'bg-[#00C2E0]/20 border-[#00C2E0]/40 text-[#00C2E0]'
              )}
            >
              {t.type === 'success' && <CheckCircle2 size={18} />}
              {t.type === 'error' && <AlertCircle size={18} />}
              {t.type === 'info' && <Info size={18} />}
              <span className="text-sm font-medium flex-1">{t.message}</span>
              <button type="button" onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed top-[-15%] right-[-10%] w-[45%] h-[45%] bg-[#00D68F]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[35%] h-[35%] bg-[#00C2E0]/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};
