import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Role } from '../types';
import { SceneModels } from './SceneModels';
import { User, Lock, Mail, ChevronLeft, LogIn, UserPlus, Eye, EyeOff, ShieldCheck, Hexagon, Activity, Siren } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

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
  const [info, setInfo] = useState<string | null>(null);
  
  const containerVariants: any = {
    hidden: { opacity: 0, x: 20, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const isSpecial = role.id === 'doctor' || role.id === 'reception' || role.id === 'security' || role.id === 'ambulance';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only handle registration via form submit. Login is handled by handleLogin.
    if (isLogin) return;
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (!email || !password) {
        setError('Email and password are required');
        alert('Email and password are required');
        return;
      }
      if (password !== confirmPassword) {
        setError('Password and confirmation do not match');
        alert('Password and confirmation do not match');
        return;
      }

      // Use supabase.auth.signUp per requirement
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      console.log('signUp response', signUpData, signUpError);
      if (signUpError) {
        setError(signUpError.message);
        alert(`Sign-up error: ${signUpError.message}`);
        return;
      }

      const user = (signUpData as any)?.user;

      if (user && user.id) {
        // Insert profile row with assigned role
        const profileRow = { id: user.id, email, role: role.id };
        const { data: insertData, error: insertError } = await supabase.from('profiles').insert(profileRow).select();
        console.log('profile insert', insertData, insertError);
        if (insertError) {
          setError(insertError.message);
          alert(`Sign-up succeeded but failed to create profile: ${insertError.message}`);
        } else {
          setInfo('Sign-up successful — profile created');
          alert('Sign-up successful — profile created');
          onBack();
        }
      } else {
        // In some Supabase settings, user is null until email confirmation.
        setInfo('Sign-up successful — please confirm your email before logging in');
        alert('Sign-up successful — please confirm your email before logging in');
      }
    } catch (err: any) {
      console.error('handleSignup error', err);
      setError(err?.message ?? String(err));
      alert(`Sign-up error: ${err?.message ?? String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Dedicated login flow implementing strict role enforcement
  const handleLogin = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      console.log('signIn response', signInData, signInError);
      if (signInError) {
        setError(signInError.message);
        return;
      }

      const user = (signInData as any)?.user;
      if (!user || !user.id) {
        setError('Authentication succeeded but no user returned');
        return;
      }

      // Fetch profile role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      console.log('fetched profile', profileData, profileError);

      if (profileError) {
        setError(profileError.message);
        // Ensure no lingering session
        await supabase.auth.signOut();
        return;
      }

      const fetchedRole = (profileData as any)?.role as string | undefined | null;
      console.log('fetched role', fetchedRole);

      // Strict role enforcement
      if (!fetchedRole || fetchedRole !== role.id) {
        alert('Access Denied: You cannot login in this role');
        await supabase.auth.signOut();
        return;
      }

      setInfo('Login successful');

      // Redirect mapping
      const redirectMap: Record<string, string> = {
        admin: '/admin',
        doctor: '/doctor',
        reception: '/reception',
        security: '/security',
        ambulance: '/ambulance',
      };

      const destination = redirectMap[fetchedRole] ?? '/';
      // perform redirect
      window.location.href = destination;
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-world" className={`relative w-full h-screen flex overflow-hidden bg-[#050505] ${isSpecial ? 'flex-row' : 'flex-row'}`}>
      {/* Visual side for special roles, or Left side traditionally */}
      <motion.div 
        initial={isSpecial ? { x: '-100vw', scale: 0.9 } : { opacity: 0 }}
        animate={isSpecial ? { x: 0, scale: 1 } : { opacity: 1 }}
        transition={isSpecial ? { 
          x: { duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.2 },
          scale: { duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.2 }
        } : { duration: 0.8 }}
        className={`relative ${isSpecial ? 'w-[50%] order-1 bg-[#020617]' : 'w-[60%] order-1 bg-gradient-to-br from-[#050508] to-[#1e0505]'} h-full flex items-center justify-center`}
        style={role.id === 'security' || role.id === 'reception' || role.id === 'ambulance' ? { backgroundColor: '#0B0F1A' } : undefined}
      >
        <div className="absolute inset-0 z-0">
          <SceneModels roleId={role.id} color={role.color} />
        </div>

        {/* Ambient Ring / Hologram Foundation for Special Roles */}
        {isSpecial && (
          <div className={`absolute w-[600px] h-[600px] rounded-full border ${role.id === 'reception' || role.id === 'security' || role.id === 'ambulance' ? 'border-cyan-500/10' : 'border-green-500/10'} blur-[2px] opacity-10 animate-[pulse_8s_infinite]`} />
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
                  {role.id === 'security' ? (isLogin ? 'Security Access Control' : 'Security Init') : (role.id === 'ambulance' ? (isLogin ? 'Emergency Access' : 'Register Vehicle') : (role.id === 'reception' ? (isLogin ? 'Reception Access' : 'Register Reception') : (isLogin ? 'Execute Access' : 'Neural Init')))}
                </h3>
              </div>
              <p className="text-[11px] text-white/40 tracking-widest leading-relaxed font-light">
                {role.id === 'security' ? 'Surveillance system authentication. Secure link established.' : (role.id === 'ambulance' ? 'Ambulance response system. Secure link established.' : (role.id === 'reception' ? 'Real-time hospital data management system.' : `Secure link established. Synchronizing with the ${role.title.toLowerCase()} sector core.`))}
              </p>
            </div>

            {/* Login / Toggle Tabs */}
            <div className="flex gap-6 mb-8 border-b border-white/5 pb-4">
              <button 
                onClick={() => setIsLogin(true)}
                className={`text-[9px] font-bold tracking-[0.4em] uppercase transition-all ${isLogin ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
              >
                Identification
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`text-[9px] font-bold tracking-[0.4em] uppercase transition-all ${!isLogin ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
              >
                Create Account
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
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
                          className="w-full bg-white/[0.03] border-white/[0.05] text-white placeholder:text-white/10 border rounded-xl py-3.5 px-4 text-[11px] font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                        />
                      </div>
                    )}
                  
                  <div className="relative group">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role.id === 'security' ? "SECURITY_ID / EMAIL" : (role.id === 'ambulance' ? "DRIVER_ID / EMAIL" : (role.id === 'reception' ? "RECEPTION_ID / EMAIL" : "CORE_IDENTIFIER"))}
                      className="w-full bg-white/[0.03] border-white/[0.05] text-white placeholder:text-white/10 border rounded-xl py-3.5 px-4 text-[11px] font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                    />
                  </div>

                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ACCESS_TOKEN"
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="CONFIRM_TOKEN"
                        className="w-full bg-white/[0.03] border-white/[0.05] text-white placeholder:text-white/10 border rounded-xl py-3.5 px-4 text-[11px] font-mono tracking-widest focus:outline-none focus:border-cyan-400 focus:bg-white/5 transition-all"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {error && <div className="text-sm text-red-400 pt-2">{error}</div>}
              {info && <div className="text-sm text-emerald-400 pt-2">{info}</div>}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type={isLogin ? 'button' : 'submit'}
                onClick={isLogin ? handleLogin : undefined}
                disabled={loading}
                className="w-full py-4 mt-4 rounded-xl font-black text-[10px] tracking-[0.4em] uppercase text-white relative overflow-hidden transition-all duration-300 shadow-lg group"
                style={{ 
                  background: `linear-gradient(135deg, ${role.color}, ${role.id === 'reception' || role.id === 'security' || role.id === 'ambulance' ? '#4F46E5' : (role.id === 'doctor' ? '#16a34a' : '#1e1b4b')})`,
                  boxShadow: `0 10px 30px -10px ${role.color}66`
                }}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] animate-[shimmer_2s_infinite]" />
                </div>
                <span className="relative z-10">{isLogin ? (role.id === 'security' ? 'Unlock System' : (role.id === 'ambulance' ? 'Start Response' : 'Execute Access')) : 'Initialize Protocol'}</span>
              </motion.button>
            </form>

            <div className="mt-8">
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  try { localStorage.setItem('pending_role', role.id); } catch {}
                  supabase.auth.signInWithOAuth({ provider: 'google' });
                }}
                className="w-full py-3.5 rounded-xl bg-white text-black text-[10px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all ring-1 ring-white/10 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
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
