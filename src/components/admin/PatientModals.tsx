import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, Edit2 } from 'lucide-react';
import { useStore, Patient } from '../../store/useStore';

export const PatientEditModal = ({ onClose }: { onClose: () => void }) => {
  const { selectedPatient, updatePatient, setSelectedPatient } = useStore();
  const [formData, setFormData] = useState<Patient | null>(null);

  useEffect(() => {
    if (selectedPatient) {
      setFormData({ ...selectedPatient });
    }
  }, [selectedPatient]);

  if (!formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updatePatient(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedPatient(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={handleClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Edit2 size={20} className="lucide lucide-edit-2" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight uppercase">Edit Patient Details</h2>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">UUID: {formData.id}</p>
              </div>
            </div>
            <button type="button" onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Full Name</label>
                <input 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Age</label>
                  <input 
                    type="number"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all font-bold appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Medical Condition</label>
                <select 
                  value={formData.condition}
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all font-bold appearance-none"
                >
                  <option value="Stable">Stable</option>
                  <option value="Critical">Critical</option>
                  <option value="Recovering">Recovering</option>
                  <option value="Under Obs">Under Obs</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Placement (Ward)</label>
                <input 
                  value={formData.ward}
                  onChange={e => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Auth Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all font-bold appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Admission Date</label>
                <input 
                  type="date"
                  value={formData.admission}
                  onChange={e => setFormData({ ...formData, admission: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-white/[0.02] border-t border-white/5">
            <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-2">
              <Save size={16} /> Update Registry Record
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
