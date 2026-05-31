import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { SceneModels } from './SceneModels';
import { ChevronLeft, Hexagon, Activity, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { normalizePortalRole, PortalRole } from '../lib/authService';
import { supabase } from '../supabaseClient';

interface LoginViewProps {
  role: Role;
  onBack: () => void;
  /** Dedicated register route opens in signup mode */
  initialMode?: 'login' | 'register';
}

function resolvePortalRole(role: Role): PortalRole | null {
  const id = role.id === 'reception' ? 'receptionist' : role.id;
  return normalizePortalRole(id);
}

function GoogleLogo() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export const LoginView: React.FC<LoginViewProps> = ({ role, onBack, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  React.useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const portalRole = resolvePortalRole(role);

  const handleGoogleLogin = async () => {
    if (!portalRole) {
      setError('Invalid portal role.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/${rolePath}/login`,
        },
      });
      if (error) {
        setError(error.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalRole) {
      setError('Invalid portal role.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const emailLower = email.trim().toLowerCase();

      if (isLogin) {
        const result = await signIn(emailLower, password, portalRole);
        if (!result.success) {
          setError(result.message);
          return;
        }
        if (result.dashboardPath) {
          navigate(result.dashboardPath, { replace: true });
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }

        const result = await signUp({
          email: emailLower,
          password,
          fullName: fullName.trim(),
          selectedRole: portalRole,
        });

        if (!result.success) {
          setError(result.message);
          return;
        }

        setSuccessMessage(result.message);
        if (!result.needsEmailConfirmation) {
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('[ERROR] Failure Reason:', message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const isSpecial =
    role.id === 'doctor' ||
    role.id === 'receptionist' ||
    role.id === 'reception' ||
    role.id === 'security' ||
    role.id === 'ambulance';

  const rolePath = role.id === 'receptionist' || role.id === 'reception' ? 'receptionist' : role.id;

  return (
    <div id="login-world" className="relative w-full h-screen flex overflow-hidden bg-[#050505]">
      <motion.div
        initial={isSpecial ? { x: '-100vw', scale: 0.9 } : { opacity: 0 }}
        animate={isSpecial ? { x: 0, scale: 1 } : { opacity: 1 }}
        transition={
          isSpecial
            ? {
                x: { duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.2 },
                scale: { duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.2 },
              }
            : { duration: 0.8 }
        }
        className={`relative ${isSpecial ? 'w-[50%] order-1 bg-[#020617]' : 'w-[60%] order-1 bg-gradient-to-br from-[#050508] to-[#1e0505]'} h-full flex items-center justify-center`}
        style={
          role.id === 'security' || role.id === 'receptionist' || role.id === 'reception' || role.id === 'ambulance'
            ? { backgroundColor: '#0B0F1A' }
            : undefined
        }
      >
        <div className="absolute inset-0 z-0">
          <SceneModels roleId={role.id} color={role.color} />
        </div>
        {isSpecial && (
          <div
            className={`absolute w-[600px] h-[600px] rounded-full border ${role.id === 'receptionist' || role.id === 'reception' || role.id === 'security' || role.id === 'ambulance' ? 'border-cyan-500/10' : 'border-green-500/10'} blur-[2px] opacity-10 animate-[pulse_8s_infinite]`}
          />
        )}
        <div
          className="absolute w-[500px] h-[500px] blur-[150px] rounded-full opacity-20 pointer-events-none"
          style={{ backgroundColor: role.color }}
        />
      </motion.div>

      <motion.div
        initial={isSpecial ? { x: '100vw' } : { opacity: 0 }}
        animate={isSpecial ? { x: 0 } : { opacity: 1 }}
        transition={
          isSpecial ? { duration: 1.0, ease: [0.33, 1, 0.68, 1], delay: 0.35 } : { duration: 0.8 }
        }
        className={`relative ${isSpecial ? 'w-[50%] order-2 bg-gradient-to-tr from-[#020617] to-[#042f2e]' : 'w-[40%] order-2 pr-12'} h-full flex items-center justify-center z-10`}
      >
        {isSpecial && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />}

        <div className="absolute top-0 left-0 right-0 p-12 flex justify-between items-center pointer-events-none">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors pointer-events-auto group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Return to Selection</span>
          </motion.button>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-right">
            <div className="text-[12px] font-black tracking-[0.6em] uppercase mb-1 text-white">
              {role.id === 'ambulance' ? 'AMBULANCE CORE' : 'NEURAL CORE'}
            </div>
            <div className="text-[9px] text-white/30 tracking-[0.3em] uppercase">{role.title} Access Portal</div>
          </motion.div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-[420px]">
          <div
            className={`backdrop-blur-[30px] ${isSpecial ? 'bg-white/[0.03] border border-white/10 shadow-2xl' : 'bg-white/[0.04] border-white/[0.08] shadow-2xl'} rounded-[32px] p-12 relative overflow-hidden`}
          >
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2.5 rounded-xl bg-white/5 border-white/10" style={{ color: role.color }}>
                  {role.id === 'security' ? (
                    <ShieldCheck size={24} className="animate-pulse" />
                  ) : role.id === 'ambulance' ? (
                    <Activity size={24} className="animate-pulse" />
                  ) : (
                    <Hexagon size={24} className="animate-pulse" />
                  )}
                </div>
                <h3 className="text-2xl font-light tracking-[0.15em] text-white uppercase">
                  {isLogin ? `${role.title} Login` : `${role.title} Register`}
                </h3>
              </div>
              <p className="text-[11px] text-white/40 tracking-widest leading-relaxed font-light">
                Secure Supabase authentication for the {role.title.toLowerCase()} portal.
              </p>
            </div>

            <div className="flex gap-6 mb-8 border-b border-white/5 pb-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                  setSuccessMessage(null);
                  navigate(`/${rolePath}/login`);
                }}
                className={`text-[9px] font-bold tracking-[0.4em] uppercase transition-all ${isLogin ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                  setSuccessMessage(null);
                  navigate(`/${rolePath}/register`);
                }}
                className={`text-[9px] font-bold tracking-[0.4em] uppercase transition-all ${!isLogin ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
              >
                Register
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleAuth}>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="px-3 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-[11px] text-center leading-snug"
                    role="alert"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              {successMessage && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono tracking-widest text-center">
                  {successMessage}
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
                    <input
                      type="text"
                      placeholder="FULL NAME"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-white/[0.03] border-white/[0.05] text-white placeholder:text-white/10 border rounded-xl py-3.5 px-4 text-[11px] font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                    />
                  )}
                  <input
                    type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border-white/[0.05] text-white placeholder:text-white/10 border rounded-xl py-3.5 px-4 text-[11px] font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="PASSWORD"
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
                    <input
                      type="password"
                      placeholder="CONFIRM PASSWORD"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-white/[0.03] border-white/[0.05] text-white placeholder:text-white/10 border rounded-xl py-3.5 px-4 text-[11px] font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-4 mt-4 rounded-xl font-black text-[10px] tracking-[0.4em] uppercase text-white relative overflow-hidden transition-all duration-300 shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${role.color}, #1e1b4b)`,
                  boxShadow: `0 10px 30px -10px ${role.color}66`,
                }}
              >
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              </motion.button>
            </form>

            {isLogin && (
              <div className="mt-8">
                <motion.button
                  type="button"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, y: -1 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  onClick={handleGoogleLogin}
                  className="w-full py-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-white/90 hover:text-white text-[9px] font-black tracking-[0.3em] uppercase flex items-center justify-center gap-3.5 transition-all duration-300 border border-white/10 hover:border-white/20 shadow-md hover:shadow-[0_0_25px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)] disabled:opacity-50 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -skew-x-[30deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                  <GoogleLogo />
                  <span>Continue with Google</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
