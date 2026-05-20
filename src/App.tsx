import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Background } from './components/Background';
import { Carousel } from './components/Carousel';
import { EnterButton } from './components/EnterButton';
import { LoginView } from './components/LoginView';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Role, ROLES } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Power } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { ReceptionDashboard } from './components/reception/ReceptionDashboard';
import { SecurityDashboard } from './components/security/SecurityDashboard';
import { AmbulanceDashboard } from './components/ambulance/AmbulanceDashboard';
import Unauthorized from './pages/Unauthorized';

function AppContent() {
  const [selectedRole, setSelectedRole] = React.useState<Role>(ROLES[1]);
  const [hoveredRole, setHoveredRole] = React.useState<Role | null>(null);
  const [rememberRole, setRememberRole] = React.useState(false);
  const { profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && profile) {
       const currentPath = window.location.pathname;
       if (currentPath === '/' || currentPath === '/auth') {
          // Special cases for URL mapped roles
          let targetPath = `/${profile.role}/dashboard`;
          if (profile.role === 'patient') {
             targetPath = '/user/dashboard';
          } else if (profile.role === 'receptionist') {
             targetPath = '/reception/dashboard';
          }
          
          navigate(targetPath, { replace: true });
       }
    }
  }, [profile, loading, navigate]);

  const backgroundRole = hoveredRole || selectedRole;

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#050816] flex items-center justify-center">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div id="app-root" className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden text-slate-100 font-sans bg-[#050816] selection:bg-cyan-500/30">
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
              </footer>
            </div>
          } />

          <Route path="/auth" element={
            <div className="w-full h-screen">
              <Background selectedRole={backgroundRole} isPreview={false} />
              <LoginView role={selectedRole} onBack={() => navigate('/')} />
            </div>
          } />

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Role Protected Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard onLogout={signOut} />
            </ProtectedRoute>
          } />

          <Route path="/doctor/dashboard" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard onLogout={signOut} />
            </ProtectedRoute>
          } />

          <Route path="/reception/dashboard" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
               <ReceptionDashboard onLogout={signOut} />
            </ProtectedRoute>
          } />

          <Route path="/security/dashboard" element={
            <ProtectedRoute allowedRoles={['security']}>
               <SecurityDashboard onLogout={signOut} />
            </ProtectedRoute>
          } />

          <Route path="/ambulance/dashboard" element={
            <ProtectedRoute allowedRoles={['ambulance']}>
               <AmbulanceDashboard onLogout={signOut} />
            </ProtectedRoute>
          } />

          {/* Default fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

