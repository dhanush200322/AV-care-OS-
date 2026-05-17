import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Background } from './components/Background';
import { Carousel } from './components/Carousel';
import { EnterButton } from './components/EnterButton';
import { LoginView } from './components/LoginView';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Role, ROLES } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Power } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { ReceptionDashboard } from './components/reception/ReceptionDashboard';
import { SecurityDashboard } from './components/security/SecurityDashboard';
import { AmbulanceDashboard } from './components/ambulance/AmbulanceDashboard';
import { useStore } from './store/useStore';

function AppContent() {
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES[1]); // Default to Doctor
  const [hoveredRole, setHoveredRole] = useState<Role | null>(null);
  const [rememberRole, setRememberRole] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const { broadcasts, notifications } = useStore();
  const navigate = useNavigate();

  const userRole = userProfile?.role || (session?.user?.email === 'ro224313@gmail.com' ? 'admin' : undefined);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setUserProfile(data);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        await fetchProfile(session.user.id);
      }
      setSessionLoading(false);
    };
    
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const backgroundRole = hoveredRole || selectedRole;

  if (sessionLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div id="app-root" className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden text-slate-100 font-sans bg-slate-950">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <div className="relative w-full min-h-screen flex flex-col items-center justify-between">
              <Background selectedRole={backgroundRole} isPreview={!!hoveredRole} />
              <header className="relative z-10 w-full pt-16 text-center pointer-events-none">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-2">
                  <h1 className="text-white text-5xl md:text-7xl font-extralight tracking-[0.4em] mb-2" style={{ textShadow: '0 0 30px rgba(6, 182, 212, 0.4)' }}>AV CARE OS</h1>
                  <p className="text-cyan-400/50 text-[10px] md:text-xs uppercase tracking-[0.6em] font-medium">Intelligent Hospital Operating System</p>
                </motion.div>
              </header>
              <main className="relative z-10 w-full flex-1 flex items-center justify-center">
                <Carousel onRoleSelect={setSelectedRole} onRoleHover={setHoveredRole} />
              </main>
              <footer className="relative z-10 w-full pb-16 px-6 flex flex-col items-center gap-8">
                <div id="remember-toggle" className="flex items-center gap-3 cursor-pointer group select-none" onClick={() => setRememberRole(!rememberRole)}>
                  <div className={`w-10 h-5 rounded-full border transition-all duration-300 relative ${rememberRole ? 'bg-cyan-500/20 border-cyan-500' : 'bg-slate-900 border-white/20'}`}>
                    <motion.div animate={{ x: rememberRole ? 20 : 0 }} className={`absolute inset-y-[2px] left-[2px] w-4 h-4 rounded-full transition-colors ${rememberRole ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-slate-500'}`} />
                  </div>
                  <span className={`text-xs font-semibold tracking-widest uppercase transition-colors ${rememberRole ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>Remember selected role</span>
                </div>
                <div onClick={() => navigate('/auth')}>
                  <EnterButton selectedRole={selectedRole} />
                </div>
                <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-8 w-64 opacity-40">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-400">
                    <Power size={12} className="text-cyan-400" />
                    <span>TERMINAL STATUS: READY</span>
                  </div>
                  <div className="text-[10px] text-slate-500">© 2026 AV CARE TECH SYSTEMS</div>
                </div>
              </footer>
            </div>
          } />

          <Route path="/auth" element={
            <div className="w-full h-screen">
              <Background selectedRole={backgroundRole} isPreview={false} />
              <LoginView role={selectedRole} onBack={() => navigate('/')} />
            </div>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute userRole={userRole} allowedRoles={['admin']} isLoading={sessionLoading}>
              <AdminDashboard onLogout={handleSignOut} />
            </ProtectedRoute>
          } />

          <Route path="/doctor/dashboard" element={
            <ProtectedRoute userRole={userRole} allowedRoles={['doctor']} isLoading={sessionLoading}>
              <DoctorDashboard onLogout={handleSignOut} />
            </ProtectedRoute>
          } />

          <Route path="/reception/dashboard" element={
            <ProtectedRoute userRole={userRole} allowedRoles={['reception']} isLoading={sessionLoading}>
              <ReceptionDashboard onLogout={handleSignOut} />
            </ProtectedRoute>
          } />

          <Route path="/security/dashboard" element={
            <ProtectedRoute userRole={userRole} allowedRoles={['security']} isLoading={sessionLoading}>
              <SecurityDashboard onLogout={handleSignOut} />
            </ProtectedRoute>
          } />

          <Route path="/ambulance/dashboard" element={
            <ProtectedRoute userRole={userRole} allowedRoles={['ambulance']} isLoading={sessionLoading}>
              <AmbulanceDashboard onLogout={handleSignOut} />
            </ProtectedRoute>
          } />

          {/* Catch all/fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

