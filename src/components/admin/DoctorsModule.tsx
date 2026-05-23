import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSquare2, Search, Filter, RefreshCw, Plus, Heart, Phone, Shield, X, Check, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../contexts/LanguageContext';

export const DoctorsModule: React.FC = () => {
  const { t } = useTranslation();
  const { doctors, addDoctor, refreshAllData } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Doctors Form States
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('General Medicine');
  const [status, setStatus] = useState<"On Duty" | "Off Duty" | "Emergency">('On Duty');
  const [contact, setContact] = useState('');

  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.department)))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.department === selectedSpecialty;
    const matchesStatus = selectedStatus === 'All' || doctor.status === selectedStatus;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshAllData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !contact) return;
    addDoctor({
      name,
      role,
      department,
      status,
      contact
    });
    // Reset Form
    setName('');
    setRole('');
    setContact('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
        <div className="flex-1 flex flex-col md:flex-row items-stretch gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" size={16} />
            <input 
              type="text"
              placeholder={t("Search physicians, specialties or status...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white font-bold tracking-wide focus:outline-none focus:border-purple-500/50"
            >
              {specialties.map(spec => (
                <option key={spec} className="bg-slate-900 text-white" value={spec}>
                  {spec === 'All' ? t('All Department') : `${t(spec)} ${t('Department')}`}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white font-bold tracking-wide focus:outline-none focus:border-purple-500/50"
            >
              <option className="bg-slate-900 text-white" value="All">{t('All Status')}</option>
              <option className="bg-slate-900 text-white" value="On Duty">🟢 {t('On Duty')}</option>
              <option className="bg-slate-900 text-white" value="Off Duty">🔴 {t('Off Duty')}</option>
              <option className="bg-slate-900 text-white" value="Emergency">🚨 {t('Emergency')}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto">
          <button 
            onClick={handleRefresh}
            className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
            title={t("Sychronize Roster")}
          >
            <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
          </button>
          
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs tracking-widest uppercase shadow-lg shadow-purple-900/30 active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>{t('ADD PHYSICIAN')}</span>
          </button>
        </div>
      </div>

      {/* Roster Cards Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <motion.div 
            key={doc.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-slate-900/50 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between group hover:border-purple-500/40 hover:bg-slate-900/80 transition-all duration-500 h-[210px] shadow-xl"
          >
            {/* Status indicators */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
                  <UserSquare2 className="text-cyan-400" size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors uppercase tracking-wider">{t(doc.name)}</h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t(doc.role)}</p>
                </div>
              </div>
              
              <div className={cn(
                "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                doc.status === 'On Duty' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                doc.status === 'Emergency' ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' :
                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              )}>
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  doc.status === 'On Duty' ? 'bg-emerald-400' :
                  doc.status === 'Emergency' ? 'bg-red-500' : 'bg-slate-500'
                )} />
                <span>{t(doc.status)}</span>
              </div>
            </div>

            {/* Department stats */}
            <div className="my-3 space-y-1 bg-white/[0.02] border border-white/5 rounded-2xl p-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/30">
                <span>{t('Specialty Unit')}</span>
                <span className="text-cyan-400">{t(doc.department)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/30">
                <span>{t('Contact Direct')}</span>
                <span className="text-white/60">{doc.contact}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3">
               <span className="text-[9px] font-black tracking-widest text-[#a855f7] uppercase">ID: {doc.id}</span>
               <div className="flex gap-2">
                 <button className="p-1 px-3 text-[9px] uppercase tracking-widest font-black text-emerald-400 hover:bg-emerald-400/10 border border-transparent rounded-lg transition-all">
                    {t('View Schedule')}
                 </button>
               </div>
            </div>
          </motion.div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center opacity-40 gap-4">
             <Users size={48} className="text-white/20" />
             <div>
               <p className="text-xs font-black uppercase tracking-[0.2em]">{t('No Medical Officers Found')}</p>
               <p className="text-[10px] text-white/40 mt-1">{t('Adjust search options or register a new doctor.')}</p>
             </div>
          </div>
        )}
      </div>

      {/* REGISTRATION MODAL */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6"
            >
              <button onClick={() => setIsAddOpen(false)} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 rounded-full">
                 <X size={16} />
              </button>
              
              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-3">{t('Register Doctor')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">{t('Full Name')}</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Jennifer Lawrence"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">{t('Roster Position')}</label>
                  <input 
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Neurosurgeon"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">{t('Specialty Ward')}</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500/50"
                    >
                      <option className="bg-slate-900 text-white" value="Cardiology">{t('Cardiology')}</option>
                      <option className="bg-slate-900 text-white" value="Neurology">{t('Neurology')}</option>
                      <option className="bg-slate-900 text-white" value="Pediatrics">{t('Pediatrics')}</option>
                      <option className="bg-slate-900 text-white" value="Radiology">{t('Radiology')}</option>
                      <option className="bg-slate-900 text-white" value="Orthopedics">{t('Orthopedics')}</option>
                      <option className="bg-slate-900 text-white" value="General Medicine">{t('General Medicine')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">{t('Operation Status')}</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500/50"
                    >
                      <option className="bg-slate-900 text-white" value="On Duty">{t('On Duty')}</option>
                      <option className="bg-slate-900 text-white" value="Off Duty">{t('Off Duty')}</option>
                      <option className="bg-slate-900 text-white" value="Emergency">{t('Emergency')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">{t('Phone / Contact direct')}</label>
                  <input 
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. +91 99999 88888"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full mt-6 py-4 bg-purple-500 hover:bg-purple-400 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl transition-all"
                >
                  {t('Confirm Registration')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
