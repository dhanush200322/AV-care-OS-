import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, CheckCircle2, AlertCircle, Info, X, LayoutDashboard, Video, AlertTriangle, Siren, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { useSecurityStore } from '../../store/securityStore';
import { SecuritySidebar } from './SecuritySidebar';
import { SecurityTopNavbar } from './SecurityTopNavbar';
import { SecurityCommandPalette } from './SecurityCommandPalette';
import { SecurityAIAssistant } from './SecurityAIAssistant';
import { SecurityDashboardOverview } from './SecurityDashboardOverview';
import { VisitorTrackingModule } from './modules/VisitorTrackingModule';
import { AccessLogsModule } from './modules/AccessLogsModule';
import { CCTVMonitoringModule } from './modules/CCTVMonitoringModule';
import { IncidentCenterModule } from './modules/IncidentCenterModule';
import { RestrictedZonesModule } from './modules/RestrictedZonesModule';
import { ParkingManagementModule } from './modules/ParkingManagementModule';
import { SecurityAlertsModule } from './modules/SecurityAlertsModule';
import { EmergencyResponseModule } from './modules/EmergencyResponseModule';
import { SecurityReportsModule } from './modules/SecurityReportsModule';
import { SecuritySettingsModule } from './modules/SecuritySettingsModule';
import { SecurityMessagesModule } from './modules/SecurityMessagesModule';

type Toast = { id: string; type: 'success' | 'error' | 'info'; message: string };

const MOBILE_NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'CMD' },
  { id: 'cctv', icon: Video, label: 'CCTV' },
  { id: 'incidents', icon: AlertTriangle, label: 'INC' },
  { id: 'visitors', icon: Users, label: 'VIS' },
  { id: 'emergency', icon: Siren, label: 'SOS' },
];

export const SecurityDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const { broadcasts, sentWishes, isEmergencyMode } = useStore();
  const { simulateRealtimeTick, alerts } = useSecurityStore();

  const activeBroadcasts = broadcasts?.filter((b) => b.audience === 'all' || b.audience === 'security') || [];
  const incomingGreetings = sentWishes?.filter((w) => w.wishType === 'Dashboard' && w.dashboardSource === 'Security Dashboard') || [];
  const hasCritical = alerts.some((a) => a.severity === 'Critical' && !a.acknowledged);

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setIsSearchOpen(true); }
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
      case 'dashboard': return <SecurityDashboardOverview />;
      case 'visitors': return <VisitorTrackingModule {...toastProps} />;
      case 'access-logs': return <AccessLogsModule {...toastProps} />;
      case 'cctv': return <CCTVMonitoringModule {...toastProps} />;
      case 'incidents': return <IncidentCenterModule {...toastProps} />;
      case 'restricted': return <RestrictedZonesModule {...toastProps} />;
      case 'parking': return <ParkingManagementModule {...toastProps} />;
      case 'alerts': return <SecurityAlertsModule {...toastProps} />;
      case 'emergency': return <EmergencyResponseModule {...toastProps} />;
      case 'messages': return <SecurityMessagesModule {...toastProps} />;
      case 'reports': return <SecurityReportsModule />;
      case 'settings': return <SecuritySettingsModule {...toastProps} />;
      default: return <SecurityDashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-white security-dashboard" style={{ backgroundColor: '#050D14' }}>
      <div className="hidden lg:block">
        <SecuritySidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <SecurityTopNavbar onSearchClick={() => setIsSearchOpen(true)} onAIToggle={() => setAiOpen((o) => !o)} scrolled={scrolled} />

        {(isEmergencyMode || hasCritical) && (
          <div className="mx-4 mt-2 px-4 py-2 rounded-xl bg-[#FF4444]/20 border border-[#FF4444]/50 flex items-center gap-3 animate-pulse">
            <Siren className="text-[#FF4444]" size={18} />
            <p className="text-xs font-bold text-[#FF4444] uppercase font-mono tracking-wider">Mission-critical alert — review incident center</p>
          </div>
        )}

        <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24 lg:pb-8">
          {incomingGreetings.length > 0 && (
            <div className="space-y-3 mb-6">{incomingGreetings.map((g, i) => (
              <div key={i} className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30"><p className="text-xs text-purple-300">{g.content}</p></div>
            ))}</div>
          )}
          {activeBroadcasts.length > 0 && (
            <div className="space-y-3 mb-6">{activeBroadcasts.map((b) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-[#1E6FFF]/10 border border-[#00C2E0]/30 flex gap-4">
                <Radio className="text-[#00E5FF] shrink-0 animate-pulse" size={20} />
                <div><h4 className="text-sm font-bold text-white font-mono">{b.title}</h4><p className="text-xs text-[#7F95B2] mt-1">{b.message}</p></div>
              </motion.div>
            ))}</div>
          )}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto py-4">
            {renderContent()}
          </motion.div>
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around p-2 bg-[#0A1824]/95 backdrop-blur-xl border-t border-[#00C2E0]/20 safe-area-pb">
          {MOBILE_NAV.map((item) => (
            <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={cn('flex flex-col items-center gap-1 p-2 rounded-xl min-w-[56px] min-h-[48px] font-mono', activeTab === item.id ? 'text-[#00E5FF]' : 'text-[#7F95B2]')}>
              <item.icon size={20} />
              <span className="text-[9px] font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <SecurityCommandPalette open={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={setActiveTab} />
      <SecurityAIAssistant forceOpen={aiOpen} onForceOpenChange={setAiOpen} />

      <div className="fixed top-24 right-6 z-[250] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={cn('pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl min-w-[280px] font-mono text-sm',
              t.type === 'success' && 'bg-[#00C2E0]/20 border-[#00E5FF]/40 text-[#00E5FF]',
              t.type === 'error' && 'bg-[#FF4444]/20 border-[#FF4444]/40 text-[#FF4444]',
              t.type === 'info' && 'bg-[#1E6FFF]/20 border-[#00C2E0]/40 text-[#7F95B2]')}>
              {t.type === 'success' && <CheckCircle2 size={18} />}
              {t.type === 'error' && <AlertCircle size={18} />}
              {t.type === 'info' && <Info size={18} />}
              <span className="flex-1">{t.message}</span>
              <button type="button" onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}><X size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed top-[-15%] right-[-10%] w-[45%] h-[45%] bg-[#1E6FFF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[35%] h-[35%] bg-[#FF4444]/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};
