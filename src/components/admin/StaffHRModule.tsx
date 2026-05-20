import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Clock, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  X, 
  Edit, 
  Trash2, 
  PlusSquare,
  DollarSign
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Suspended';
  joiningDate: string;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: 'ST-01', name: 'Dr. Sarah Jenkins', role: 'Doctor', department: 'Cardiology', shift: '08:00 AM - 04:00 PM', salary: 185000, status: 'Active', joiningDate: '2021-04-12' },
  { id: 'ST-02', name: 'Raj Kumar', role: 'Receptionist', department: 'Front Desk', shift: '08:00 AM - 04:00 PM', salary: 45000, status: 'Active', joiningDate: '2022-09-01' },
  { id: 'ST-03', name: 'Priya Sharma', role: 'Nurse', department: 'Pediatrics', shift: '04:00 PM - 12:00 AM', salary: 62000, status: 'Active', joiningDate: '2023-01-15' },
  { id: 'ST-04', name: 'Anil Gupta', role: 'Pharmacy Staff', department: 'Pharmacy', shift: '12:00 AM - 08:00 AM', salary: 55000, status: 'Active', joiningDate: '2022-11-20' },
  { id: 'ST-05', name: 'Dr. Ronald Davis', role: 'Doctor', department: 'Emergency', shift: '04:00 PM - 12:00 AM', salary: 195000, status: 'On Leave', joiningDate: '2020-05-18' },
  { id: 'ST-06', name: 'Sunita Rao', role: 'Lab Staff', department: 'Pathology', shift: '08:00 AM - 04:00 PM', salary: 52000, status: 'Active', joiningDate: '2023-03-10' },
  { id: 'ST-07', name: 'Vikram Singh', role: 'Accountant', department: 'Finance', shift: '09:00 AM - 05:00 PM', salary: 75000, status: 'Active', joiningDate: '2021-08-25' },
];

export const StaffHRModule: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<StaffMember> | null>(null);

  const filteredStaff = staff.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member: StaffMember) => {
    setCurrentMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to terminate this staff protocol trace?")) {
      setStaff(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember?.name || !currentMember?.role || !currentMember?.department) return;

    if (currentMember.id) {
      // EDIT
      setStaff(prev => prev.map(m => m.id === currentMember.id ? (currentMember as StaffMember) : m));
    } else {
      // ADD
      const newId = `ST-${String(staff.length + 1).padStart(2, '0')}`;
      const newMember: StaffMember = {
        id: newId,
        name: currentMember.name,
        role: currentMember.role,
        department: currentMember.department,
        shift: currentMember.shift || '08:00 AM - 04:00 PM',
        salary: Number(currentMember.salary) || 50000,
        status: currentMember.status || 'Active',
        joiningDate: new Date().toISOString().split('T')[0]
      };
      setStaff(prev => [...prev, newMember]);
    }

    setIsModalOpen(false);
    setCurrentMember(null);
  };

  return (
    <div className="space-y-6">
      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total active staff', value: staff.filter(s => s.status === 'Active').length, icon: Users, color: 'from-purple-500/20 to-indigo-500/10 text-purple-400' },
          { label: 'On emergency duty', value: staff.filter(s => s.shift.includes('04:00 PM') || s.department === 'Emergency').length, icon: Clock, color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400' },
          { label: 'Total monthly payroll', value: `₹${staff.reduce((acc, s) => acc + s.salary, 0).toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400' },
          { label: 'Pending HR audits', value: '0', icon: ShieldCheck, color: 'from-amber-500/20 to-orange-500/10 text-amber-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">{stat.label}</p>
              <h4 className="text-xl font-black text-white mt-1 leading-none">{stat.value}</h4>
            </div>
            <div className={cn("p-3 rounded-xl bg-gradient-to-br border border-white/5", stat.color)}>
              <stat.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-slate-900/40 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Personnel & Recruitment Registry</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Deploy, monitor, and configure active clinical personnel telemetry.</p>
          </div>
          <button 
            onClick={() => {
              setCurrentMember({ status: 'Active', shift: '08:00 AM - 04:00 PM' });
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 self-start transition-all"
          >
            <UserPlus size={14} /> Add Human Unit
          </button>
        </div>

        {/* Search / Filters Bar */}
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-3 mb-6">
          <Search size={16} className="text-white/20 ml-2" />
          <input 
            type="text" 
            placeholder="Filter by name, specialized clinical division..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder:text-white/20 font-mono uppercase"
          />
          <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black uppercase text-white/40 tracking-widest flex items-center gap-1.5 cursor-pointer hover:bg-white/10">
            <Filter size={10} /> Sync Active
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-white/30">
                <th className="py-4 px-4">Identifier</th>
                <th className="py-4 px-4">Staff Member</th>
                <th className="py-4 px-4">Designation</th>
                <th className="py-4 px-4">Clinical Division</th>
                <th className="py-4 px-4">Shift Details</th>
                <th className="py-4 px-4">Comp Rate</th>
                <th className="py-4 px-4">Telemetry</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredStaff.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.01] transition-colors text-xs font-semibold">
                  <td className="py-4 px-4 font-mono text-purple-400 text-[10px]">{m.id}</td>
                  <td className="py-4 px-4 text-white uppercase tracking-wide">{m.name}</td>
                  <td className="py-4 px-4 text-white/60">{m.role}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {m.department}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white/50 font-mono text-[10px]">{m.shift}</td>
                  <td className="py-4 px-4 text-white/80 font-mono">₹{m.salary.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                      m.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      m.status === 'On Leave' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    )}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(m)}
                        className="p-1.5 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg border border-transparent hover:border-cyan-500/20 transition-all text-white/30"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 hover:text-red-500 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all text-white/30"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-white/20 uppercase tracking-widest text-xs font-mono">
                    No clinical staff matches the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adding/Editing Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Content modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#050816] border border-white/10 rounded-[32px] w-full max-w-lg p-6 relative overflow-hidden z-10"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">
                    {currentMember?.id ? `Modify Staff: ${currentMember.id}` : 'Recruit Human tele-node'}
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Configure active hospital workforce configuration parameters.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-[11px]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 col-span-2">
                    <label className="text-white/40 uppercase tracking-wider">Staff Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={currentMember?.name || ''} 
                      onChange={(e) => setCurrentMember(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs placeholder:text-white/10"
                      placeholder="E.G. DR. AMIT PARSHAD"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Role</label>
                    <select 
                      value={currentMember?.role || 'Nurse'} 
                      onChange={(e) => setCurrentMember(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                    >
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Pharmacy Staff">Pharmacy Staff</option>
                      <option value="Lab Staff">Lab Staff</option>
                      <option value="Accountant">Accountant</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Clinical Division</label>
                    <select 
                      value={currentMember?.department || 'Cardiology'} 
                      onChange={(e) => setCurrentMember(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Pathology">Pathology</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Front Desk">Front Desk</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Salary Details (In ₹)</label>
                    <input 
                      type="number" 
                      required
                      value={currentMember?.salary || ''} 
                      onChange={(e) => setCurrentMember(prev => ({ ...prev, salary: Number(e.target.value) }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Shift Timing</label>
                    <select 
                      value={currentMember?.shift || '08:00 AM - 04:00 PM'} 
                      onChange={(e) => setCurrentMember(prev => ({ ...prev, shift: e.target.value }))}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                    >
                      <option value="08:00 AM - 04:00 PM">Day Shift (08 AM - 04 PM)</option>
                      <option value="04:00 PM - 12:00 AM">Evening Shift (04 PM - 12 AM)</option>
                      <option value="12:00 AM - 08:00 AM">Night Shift (12 AM - 08 AM)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 col-span-2">
                    <label className="text-white/40 uppercase tracking-wider">HR Telemetry Status</label>
                    <div className="flex gap-4">
                      {['Active', 'On Leave', 'Suspended'].map((st) => (
                        <button 
                          key={st}
                          type="button"
                          onClick={() => setCurrentMember(prev => ({ ...prev, status: st as any }))}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors",
                            currentMember?.status === st 
                              ? 'bg-purple-600/20 text-purple-400 border-purple-500/50' 
                              : 'bg-white/5 text-white/40 border-transparent hover:bg-white/10'
                          )}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 mt-8 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-white/10 rounded-xl text-[10px] uppercase font-black tracking-widest text-white/55 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-[linear-gradient(135deg,#A855F7,#6a11cb)] rounded-xl text-[10px] uppercase font-black tracking-widest text-white hover:opacity-90 shadow-lg shadow-purple-950/40"
                  >
                    Authorize Node
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
