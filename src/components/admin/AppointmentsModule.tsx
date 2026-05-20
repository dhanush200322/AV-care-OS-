import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Search, Filter, RefreshCw, Plus, Clock, Stethoscope, User, X, Check, CheckSquare } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export const AppointmentsModule: React.FC = () => {
  const { appointments, addAppointment, doctors, patients, refreshAllData } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Appt Form States
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('General Consultation');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<'Confirmed' | 'Pending' | 'Canceled'>('Confirmed');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
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
    if (!patientName || !doctorName || !date || !time) return;
    addAppointment({
      patientName,
      doctorName,
      specialty,
      date,
      time,
      status
    });
    // Reset Form
    setPatientName('');
    setDoctorName('');
    setDate('');
    setTime('');
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
              placeholder="Search patients, specialist name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white font-bold tracking-wide focus:outline-none focus:border-purple-500/50"
            >
              <option className="bg-slate-900 text-white" value="All">All Appointments</option>
              <option className="bg-slate-900 text-white" value="Confirmed">Confirmed</option>
              <option className="bg-slate-900 text-white" value="Pending">Pending</option>
              <option className="bg-slate-900 text-white" value="Canceled">Canceled</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto">
          <button 
            onClick={handleRefresh}
            className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
            title="Sychronize Scheduler"
          >
            <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
          </button>
          
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs tracking-widest uppercase shadow-lg shadow-purple-900/30 active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>BOOK SCHEDULER</span>
          </button>
        </div>
      </div>

      {/* Roster Cards Deck */}
      <div className="p-1 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">ID</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Patient Name</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Doctor Assignee</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Specialty Unit</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Date & Slot</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-white/5 hover:bg-white/[0.02] group transition-colors">
                  <td className="p-6 text-xs font-mono font-bold text-purple-400">{apt.id}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/15">
                        <User size={14} className="text-cyan-400" />
                      </div>
                      <span className="text-xs font-bold text-white">{apt.patientName}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/15">
                        <Stethoscope size={14} className="text-purple-400" />
                      </div>
                      <span className="text-xs font-semibold text-white/80">{apt.doctorName}</span>
                    </div>
                  </td>
                  <td className="p-6 text-xs text-white/40 tracking-wider font-semibold">{apt.specialty}</td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white">{apt.date}</span>
                      <span className="text-[10px] text-white/30 font-bold flex items-center gap-1 mt-0.5"><Clock size={10} /> {apt.time}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      apt.status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10' :
                      apt.status === 'Pending' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/10' :
                      'bg-red-500/15 text-red-400 border border-red-500/10'
                    )}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-lg transition-all">
                        Checked-In
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Calendar size={48} />
                      <p className="text-xs font-black uppercase tracking-[0.2em]">No Bookings Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
              
              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-3">Book Slot</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Patient Select / Name</label>
                  <select
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="" className="text-slate-400 bg-slate-900">-- Choose Patient --</option>
                    {patients.map(p => (
                       <option key={p.id} value={p.name} className="bg-slate-900 text-white">{p.name}</option>
                    ))}
                    <option value="New Outpatient Intake" className="bg-slate-900 text-purple-400">Add New Outpatient Intake</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">Doctor / Medical Consultant</label>
                  <select
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="" className="text-slate-400 bg-slate-900">-- Select Officer --</option>
                    {doctors.map(d => (
                       <option key={d.id} value={d.name} className="bg-slate-900 text-white">{d.name} ({d.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">Consultation Category</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500/50"
                  >
                    <option className="bg-slate-900 text-white" value="Cardiology">Cardiology</option>
                    <option className="bg-slate-900 text-white" value="Neurology">Neurology</option>
                    <option className="bg-slate-900 text-white" value="Pediatrics">Pediatrics</option>
                    <option className="bg-slate-900 text-white" value="Radiology">Radiology</option>
                    <option className="bg-slate-900 text-white" value="General Consultation">General Consultation</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">Date</label>
                    <input 
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">Slot Time</label>
                    <input 
                      type="text"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 11:30 AM"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-6 py-4 bg-purple-500 hover:bg-purple-400 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl transition-all"
                >
                  Confirm Scheduled Appointment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
