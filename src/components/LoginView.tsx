import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { SceneModels } from './SceneModels';
import { User, Lock, Mail, ChevronLeft, LogIn, UserPlus, Eye, EyeOff, ShieldCheck, Hexagon, Activity, Siren } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface LoginViewProps {
  role: Role;
  onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ role, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showRoleMismatchModal, setShowRoleMismatchModal] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (role?.id) {
      localStorage.setItem('intended_role', role.id);
    }
  }, [role]);
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem("mock_signed_out");
      const resolvedRole = role.id === 'reception' ? 'receptionist' : role.id;
      
      const dummyUser = {
        id: `mock-google-user-${Date.now()}`,
        email: `google-${resolvedRole}@avcare.os`,
        user_metadata: { 
          full_name: `Google ${role.title} Executive` 
        },
        aud: "authenticated",
        role: "authenticated"
      };

      const dummySession = {
        access_token: "dummy-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "dummy-refresh",
        user: dummyUser
      };

      localStorage.setItem('sb-bifxppsanaalorhvmjte-auth-token', JSON.stringify(dummySession));
      localStorage.setItem('mock_authed_user', JSON.stringify(dummyUser));
      localStorage.setItem('intended_role', resolvedRole);

      // Trigger standard supabase login simulation
      await supabase.auth.signInWithPassword({ email: dummyUser.email, password: "oauth" });

      // Navigate to the correct portal smoothly
      const dashboardPath = `/${role.id === 'receptionist' || role.id === 'reception' ? 'reception' : role.id}/dashboard`;
      navigate(dashboardPath, { replace: true });
    } catch (err: any) {
      setError(err.message || "OAuth initialization failed");
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const emailLower = email.trim().toLowerCase();
      const resolvedRole = role.id === 'reception' ? 'receptionist' : role.id;
      
      if (isLogin) {
        localStorage.removeItem("mock_signed_out");
        
        const dummyUser = {
          id: `mock-user-${Date.now()}`,
          email: emailLower || `staff-${resolvedRole}@avcare.os`,
          user_metadata: { 
            full_name: fullName || (emailLower ? emailLower.split('@')[0].toUpperCase() : `${role.title} Operator`) 
          },
          aud: "authenticated",
          role: "authenticated"
        };

        const dummySession = {
          access_token: "dummy-token",
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: "dummy-refresh",
          user: dummyUser
        };

        localStorage.setItem('sb-bifxppsanaalorhvmjte-auth-token', JSON.stringify(dummySession));
        localStorage.setItem('mock_authed_user', JSON.stringify(dummyUser));
        localStorage.setItem('intended_role', resolvedRole);

        // Save users and profiles database mock row inside localStorage for store CRUD references
        const users = JSON.parse(localStorage.getItem("mock_db_users") || "[]");
        if (!users.some((u: any) => u.email === dummyUser.email)) {
          users.push({ id: dummyUser.id, email: dummyUser.email, plan: "pro" });
          localStorage.setItem("mock_db_users", JSON.stringify(users));
        }

        const profiles = JSON.parse(localStorage.getItem("mock_db_profiles") || "[]");
        if (!profiles.some((p: any) => p.email === dummyUser.email)) {
          profiles.push({
            id: dummyUser.id,
            role: resolvedRole,
            full_name: dummyUser.user_metadata.full_name,
            email: dummyUser.email,
            created_at: new Date().toISOString()
          });
          localStorage.setItem("mock_db_profiles", JSON.stringify(profiles));
        }

        // Sing in to client side API mock as well
        await supabase.auth.signInWithPassword({ email: dummyUser.email, password });

        // Navigate to the correct portal smoothly
        const dashboardPath = `/${role.id === 'receptionist' || role.id === 'reception' ? 'reception' : role.id}/dashboard`;
        navigate(dashboardPath, { replace: true });
      } else {
        if (password !== confirmPassword) {
          throw new Error("Tokens do not match");
        }

        const profiles = JSON.parse(localStorage.getItem("mock_db_profiles") || "[]");
        const users = JSON.parse(localStorage.getItem("mock_db_users") || "[]");

        if (profiles.some((p: any) => p.email === emailLower)) {
          throw new Error("Email already exists in neural registry. Please login.");
        }

        const newId = `mock-user-${Date.now()}`;
        const newProfile = {
          id: newId,
          role: resolvedRole,
          full_name: fullName || emailLower.split('@')[0].toUpperCase(),
          email: emailLower,
          created_at: new Date().toISOString()
        };

        profiles.push(newProfile);
        users.push({ id: newId, email: emailLower, plan: "pro" });

        localStorage.setItem("mock_db_profiles", JSON.stringify(profiles));
        localStorage.setItem("mock_db_users", JSON.stringify(users));

        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
        setSuccessMessage("Your account has been created locally. Please sign in now.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0, x: 20, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const isSpecial = role.id === 'doctor' || role.id === 'receptionist' || role.id === 'reception' || role.id === 'security' || role.id === 'ambulance';

  return (
    <div id="login-world" className="relative w-full h-screen flex overflow-hidden bg-[#050505]">
      {/* Visual side for special roles, or Left side traditionally */}
      <motion.div 
        initial={isSpecial ? { x: '-100vw', scale: 0.9 } : { opacity: 0 }}
        animate={isSpecial ? { x: 0, scale: 1 } : { opacity: 1 }}
        transition={isSpecial ? { 
          x: { duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.2 },
          scale: { duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.2 }
        } : { duration: 0.8 }}
        className={`relative ${isSpecial ? 'w-[50%] order-1 bg-[#020617]' : 'w-[60%] order-1 bg-gradient-to-br from-[#050508] to-[#1e0505]'} h-full flex items-center justify-center`}
        style={role.id === 'security' || role.id === 'receptionist' || role.id === 'reception' || role.id === 'ambulance' ? { backgroundColor: '#0B0F1A' } : undefined}
      >
        <div className="absolute inset-0 z-0">
          <SceneModels roleId={role.id} color={role.color} />
        </div>

        {/* Ambient Ring / Hologram Foundation for Special Roles */}
        {isSpecial && (
          <div className={`absolute w-[600px] h-[600px] rounded-full border ${role.id === 'receptionist' || role.id === 'reception' || role.id === 'security' || role.id === 'ambulance' ? 'border-cyan-500/10' : 'border-green-500/10'} blur-[2px] opacity-10 animate-[pulse_8s_infinite]`} />
        )}
        
        {/* Radial glow behind model */}
        <div 
          className="absolute w-[500px] h-[500px] blur-[150px] rounded-full opacity-20 pointer-events-none"
          style={{ backgroundColor: role.color }}
        />

        {/* HUD Elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className={`absolute bottom-12 flex flex-col gap-2 font-mono text-[9px] text-white tracking-[0.4em] ${isSpecial ? 'left-12 text-left' : 'left-12'}`}
        >
          <span>CORE_COORD_X: 42.083</span>
          <span>CORE_COORD_Y: 19.452</span>
          <span>{role.id === 'security' ? 'SECURITY_ENFORCEMENT: ACTIVE' : (role.id === 'ambulance' ? 'EMERGENCY_DISPATCH: LINKED' : 'SYNC_STATUS: ENHANCED')}</span>
        </motion.div>
      </motion.div>

      {/* AUTH CARD SIDE (Right for Special Roles) */}
      <motion.div 
        initial={isSpecial ? { x: '100vw' } : { opacity: 0 }}
        animate={isSpecial ? { x: 0 } : { opacity: 1 }}
        transition={isSpecial ? { 
          duration: 1.0, 
          ease: [0.33, 1, 0.68, 1], 
          delay: 0.35 
        } : { duration: 0.8 }}
        className={`relative ${isSpecial ? 'w-[50%] order-2 bg-gradient-to-tr from-[#020617] to-[#042f2e]' : 'w-[40%] order-2 pr-12'} h-full flex items-center justify-center z-10`}
        style={role.id === 'security' ? { background: 'linear-gradient(to top right, #0B0F1A, #052e16)' } : (role.id === 'ambulance' ? { background: 'linear-gradient(to top right, #0B0F1A, #2e0505)' } : undefined)}
      >
        
        {/* Glass Effect Overlay for Special Roles */}
        {isSpecial && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />
        )}
        
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-12 flex justify-between items-center pointer-events-none">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className={`flex items-center gap-2 text-white/40 hover:text-white transition-colors pointer-events-auto group flex-row`}
          >
            <ChevronLeft size={16} className={`transition-transform group-hover:-translate-x-1`} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Return to Selection</span>
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-right"
          >
            <div className="text-[12px] font-black tracking-[0.6em] uppercase mb-1 text-white">{role.id === 'ambulance' ? 'AMBULANCE CORE' : 'NEURAL CORE'}</div>
            <div className="text-[9px] text-white/30 tracking-[0.3em] uppercase">{role.title} Access Portal</div>
          </motion.div>
        </div>

        {/* AUTH CARD */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[420px]"
        >
          <div 
            className={`backdrop-blur-[30px] ${isSpecial ? 'bg-white/[0.03] border border-white/10 shadow-2xl' : 'bg-white/[0.04] border-white/[0.08] shadow-2xl'} rounded-[32px] p-12 relative overflow-hidden`}
          >
            {/* Header info */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2.5 rounded-xl bg-white/5 border-white/10" style={{ color: role.color }}>
                  {role.id === 'security' ? <ShieldCheck size={24} className="animate-pulse" /> : (role.id === 'ambulance' ? <Activity size={24} className="animate-pulse" /> : <Hexagon size={24} className="animate-pulse" />)}
                </div>
                <h3 className="text-2xl font-light tracking-[0.15em] text-white uppercase">
                  {role.id === 'security' ? (isLogin ? 'Security Access Control' : 'Security Init') : (role.id === 'ambulance' ? (isLogin ? 'Emergency Access' : 'Register Vehicle') : (role.id === 'receptionist' || role.id === 'reception' ? (isLogin ? 'Reception Access' : 'Register Reception') : (isLogin ? 'Execute Access' : 'Neural Init')))}
                </h3>
              </div>
              <p className="text-[11px] text-white/40 tracking-widest leading-relaxed font-light">
                {role.id === 'security' ? 'Surveillance system authentication. Secure link established.' : (role.id === 'ambulance' ? 'Ambulance response system. Secure link established.' : (role.id === 'receptionist' || role.id === 'reception' ? 'Real-time hospital data management system.' : `Secure link established. Synchronizing with the ${role.title.toLowerCase()} sector core.`))}
              </p>
            </div>

            {/* Login / Toggle Tabs */}
            <div className="flex gap-6 mb-8 border-b border-white/5 pb-4">
              <button 
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`text-[9px] font-bold tracking-[0.4em] uppercase transition-all ${isLogin ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
              >
                Identification
              </button>
              <button 
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={`text-[9px] font-bold tracking-[0.4em] uppercase transition-all ${!isLogin ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
              >
                Create Account
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleAuth}>
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-mono tracking-widest text-center">
                  ERROR_CODE: {error.toUpperCase()}
                </div>
              )}
              {successMessage && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono tracking-widest text-center">
                  MESSAGE: {successMessage.toUpperCase()}
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'register'}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                    {!isLogin && (
                      <div className="relative group">
                        <input 
                          type="text" 
                          placeholder="FULL NAME"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required={!isLogin}
                          className="w-full bg-white/[0.03] border-white/[0.05] text-white placeholder:text-white/10 border rounded-xl py-3.5 px-4 text-[11px] font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                        />
                      </div>
                    )}
                  
                  <div className="relative group">
                    <input 
                      type="email" 
                      placeholder={role.id === 'security' ? "SECURITY_ID / EMAIL" : (role.id === 'ambulance' ? "DRIVER_ID / EMAIL" : (role.id === 'receptionist' || role.id === 'reception' ? "RECEPTION_ID / EMAIL" : "CORE_IDENTIFIER"))}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/[0.03] border-white/[0.05] text-white placeholder:text-white/10 border rounded-xl py-3.5 px-4 text-[11px] font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                    />
                  </div>

                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="ACCESS_TOKEN"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white/[0.03] border-white/[0.05] text-white placeholder:text-white/10 border rounded-xl py-3.5 px-4 pr-12 text-[11px] font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {!isLogin && (
                    <div className="relative group">
                      <input 
                        type="password" 
                        placeholder="CONFIRM_TOKEN"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={!isLogin}
                        className="w-full bg-white/[0.03] border-white/[0.05] text-white placeholder:text-white/10 border rounded-xl py-3.5 px-4 text-[11px] font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-4 mt-4 rounded-xl font-black text-[10px] tracking-[0.4em] uppercase text-white relative overflow-hidden transition-all duration-300 shadow-lg group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ 
                  background: `linear-gradient(135deg, ${role.color}, ${role.id === 'receptionist' || role.id === 'reception' || role.id === 'security' || role.id === 'ambulance' ? '#4F46E5' : (role.id === 'doctor' ? '#16a34a' : '#1e1b4b')})`,
                  boxShadow: `0 10px 30px -10px ${role.color}66`
                }}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] animate-[shimmer_2s_infinite]" />
                </div>
                <span className="relative z-10">
                  {loading ? 'Processing...' : (isLogin ? (role.id === 'security' ? 'Unlock System' : (role.id === 'ambulance' ? 'Start Response' : 'Execute Access')) : 'Initialize Protocol')}
                </span>
              </motion.button>
            </form>

            {error && (
              <div id="auth-error-under-form" className="mt-4 p-2.5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] text-center font-mono tracking-wider">
                AUTH_ERROR: {error}
              </div>
            )}

            <div className="mt-8">
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-white/90 hover:text-white text-[9px] font-black tracking-[0.3em] uppercase flex items-center justify-center gap-3.5 transition-all duration-300 border border-white/10 hover:border-white/20 shadow-md hover:shadow-[0_0_25px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)] disabled:opacity-50 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -skew-x-[30deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                <svg className="w-4.5 h-4.5 drop-shadow-[0_0_2px_rgba(255,255,255,0.1)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>


      {/* Ambient background particles for the entire screen (very few) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/10 rounded-full animate-pulse delay-300" />
      </div>
    </div>
  );
};
