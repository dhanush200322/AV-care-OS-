import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Siren, 
  MapPin, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  PhoneCall,
  Activity,
  AlertOctagon,
  TrendingUp,
  Clock,
  Navigation
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AmbulanceUnit {
  id: string;
  vehicleNo: string;
  type: 'ALS (Advanced Life Support)' | 'BLS (Basic Life Support)' | 'Neonatal Unit';
  pilot: string;
  paramedic: string;
  status: 'Ready' | 'Dispatched' | 'Maintenance';
  activeIncident?: string;
  destinationNode?: string;
  contact: string;
}

const INITIAL_UNITS: AmbulanceUnit[] = [
  { id: 'AMB-01', vehicleNo: 'DL-3C-AF-4501', type: 'ALS (Advanced Life Support)', pilot: 'Rajesh Pilot', paramedic: 'Sandeep Roy', status: 'Dispatched', activeIncident: 'Multiple Trauma on Ring Road (S7)', destinationNode: 'AV Care Trauma Hub', contact: '+91 90001 00021' },
  { id: 'AMB-02', vehicleNo: 'DL-3C-AF-4502', type: 'ALS (Advanced Life Support)', pilot: 'Anoop Tomar', paramedic: 'Sister Grace', status: 'Ready', contact: '+91 90001 00022' },
  { id: 'AMB-03', vehicleNo: 'DL-3C-AF-4503', type: 'BLS (Basic Life Support)', pilot: 'Gurpreet Singh', paramedic: 'Amit Mishra', status: 'Ready', contact: '+91 90001 00023' },
  { id: 'AMB-04', vehicleNo: 'DL-3C-AF-4504', type: 'Neonatal Unit', pilot: 'Dinesh Kumar', paramedic: 'Dr. Shruti Sen', status: 'Dispatched', activeIncident: 'Premature twins delivery in East Sect', destinationNode: 'AV Care Pediatric NICU', contact: '+91 90001 00024' },
  { id: 'AMB-05', vehicleNo: 'DL-3C-AF-4505', type: 'BLS (Basic Life Support)', pilot: 'Mahesh Chander', paramedic: 'Nitin Patel', status: 'Maintenance', contact: '+91 90001 00025' },
];

export const AmbulanceModule: React.FC = () => {
  const [units, setUnits] = useState<AmbulanceUnit[]>(INITIAL_UNITS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<Partial<AmbulanceUnit> | null>(null);

  const filteredUnits = units.filter(u => 
    u.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.pilot.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.activeIncident && u.activeIncident.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (unit: AmbulanceUnit) => {
    setCurrentUnit(unit);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to retire this active responder fleet register?")) {
      setUnits(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUnit?.vehicleNo || !currentUnit?.pilot || !currentUnit?.type) return;

    if (currentUnit.id) {
      setUnits(prev => prev.map(u => u.id === currentUnit.id ? (currentUnit as AmbulanceUnit) : u));
    } else {
      const newId = `AMB-${String(units.length + 1).padStart(2, '0')}`;
      const newUnit: AmbulanceUnit = {
        id: newId,
        vehicleNo: currentUnit.vehicleNo,
        type: currentUnit.type as any,
        pilot: currentUnit.pilot,
        paramedic: currentUnit.paramedic || 'Unassigned Paramedic',
        status: currentUnit.status || 'Ready',
        activeIncident: currentUnit.activeIncident,
        destinationNode: currentUnit.destinationNode,
        contact: currentUnit.contact || '+91 90001 00000'
      };
      setUnits(prev => [...prev, newUnit]);
    }

    setIsModalOpen(false);
    setCurrentUnit(null);
  };

  const getDispatchedUnits = () => units.filter(u => u.status === 'Dispatched');

  return (
    <div className="space-y-6">
      {/* Live Dispatches Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-red-950/40 to-[#050816]/40 border border-red-500/20 backdrop-blur-3xl rounded-[32px] p-6 col-span-1 md:col-span-2 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-red-500 tracking-[0.3em] flex items-center gap-1.5 animate-pulse">
              <Siren size={10} className="text-red-500 shrink-0" /> EMERGENCY SIRENS DISPATCHED
            </span>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">
              {getDispatchedUnits().length} Emergency Ambulances Active
            </h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">
              Estimated trauma responses: SLA 8-min response target lock.
            </p>
          </div>
          <div className="p-3.5 bg-red-500/20 rounded-2xl text-red-400 border border-red-500/30">
             <AlertOctagon size={24} className="animate-bounce" />
          </div>
        </div>

        {[
          { label: 'Available ambulances', value: `${units.filter(u => u.status === 'Ready').length} vehicle nodes`, icon: Siren, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
          { label: 'Fleet maintenance', value: `${units.filter(u => u.status === 'Maintenance').length} offline`, icon: Clock, color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">{stat.label}</p>
              <h4 className="text-xl font-black text-white mt-1 leading-none">{stat.value}</h4>
            </div>
            <div className={cn("p-2.5 rounded-xl border", stat.color)}>
              < Siren size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Ambulance Dispatch Area */}
      <div className="bg-slate-900/40 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Ambulance Fleet Dispatch Registry</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Simulate ambulance state controls, rescue operations dispatching, and crew allocations.</p>
          </div>
          <button 
            onClick={() => {
              setCurrentUnit({ status: 'Ready', type: 'ALS (Advanced Life Support)' });
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 self-start transition-all"
          >
            <Plus size={14} /> Register Rescue Vehicle
          </button>
        </div>

        {/* Filter Input */}
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-3 mb-6">
          <Search size={16} className="text-white/20 ml-2" />
          <input 
            type="text" 
            placeholder="Search vehicle ID, driver pilot name, current disaster coordinates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder:text-white/20 font-mono uppercase"
          />
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-white/30">
                <th className="py-4 px-4">Vehicle Key</th>
                <th className="py-4 px-4">Plate Identifier</th>
                <th className="py-4 px-4">Classification</th>
                <th className="py-4 px-4">Fleet Pilot</th>
                <th className="py-4 px-4">Paramedic Support</th>
                <th className="py-4 px-4">Current Incident / Location</th>
                <th className="py-4 px-4">Readiness Telemetry</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredUnits.map((u) => {
                const isActive = u.status === 'Dispatched';
                return (
                  <tr key={u.id} className="hover:bg-white/[0.01] transition-colors text-xs font-semibold">
                    <td className="py-4 px-4 font-mono text-pink-400 text-[10px]">{u.id}</td>
                    <td className="py-4 px-4 text-white uppercase tracking-wide font-mono text-[11px]">{u.vehicleNo}</td>
                    <td className="py-4 px-4 text-white/60 text-[10px] font-bold uppercase">{u.type}</td>
                    <td className="py-4 px-4 text-white/80 uppercase">{u.pilot}</td>
                    <td className="py-4 px-4 text-white/60">{u.paramedic}</td>
                    <td className="py-4 px-4">
                      {isActive ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-white text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 text-red-400">
                            <Navigation size={10} className="animate-bounce" /> {u.activeIncident}
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-white/40">Dest: {u.destinationNode}</span>
                        </div>
                      ) : (
                        <span className="text-white/25 uppercase font-mono text-[10px]">Staged in emergency depot</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                        u.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                        u.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
                      )}>
                        {u.status === 'Dispatched' ? '🚨 Active Call' : u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-white/30">
                        <button onClick={() => handleEdit(u)} className="p-1.5 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUnits.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-white/20 uppercase tracking-widest text-xs font-mono">
                    No active rescue vehicles fit searching criteria.
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#050816] border border-white/10 rounded-[32px] w-full max-w-lg p-6 relative overflow-hidden z-10"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">
                    {currentUnit?.id ? `Re-align Response Fleet: ${currentUnit.id}` : 'Deploy Ambulance Vehicle'}
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Configure emergency responder classes, communication lines, and crew nodes.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-[11px]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Plate / Vehicle Registration No</label>
                    <input 
                      type="text" 
                      required
                      value={currentUnit?.vehicleNo || ''} 
                      onChange={(e) => setCurrentUnit(prev => ({ ...prev, vehicleNo: e.target.value.toUpperCase() }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs text-upper"
                      placeholder="E.G. DL-3C-AF-4501"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Classification</label>
                    <select 
                      value={currentUnit?.type || 'ALS (Advanced Life Support)'} 
                      onChange={(e) => setCurrentUnit(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                    >
                      <option value="ALS (Advanced Life Support)">ALS (Advanced Life Support)</option>
                      <option value="BLS (Basic Life Support)">BLS (Basic Life Support)</option>
                      <option value="Neonatal Unit">Neonatal Unit</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Fleet Lead Pilot (Driver)</label>
                    <input 
                      type="text" 
                      required
                      value={currentUnit?.pilot || ''} 
                      onChange={(e) => setCurrentUnit(prev => ({ ...prev, pilot: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                      placeholder="Pilot Name"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Specialized On-Board Paramedic</label>
                    <input 
                      type="text" 
                      required
                      value={currentUnit?.paramedic || ''} 
                      onChange={(e) => setCurrentUnit(prev => ({ ...prev, paramedic: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                      placeholder="Paramedic Name"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Emergency Hotlink Dial</label>
                    <input 
                      type="text" 
                      required
                      value={currentUnit?.contact || ''} 
                      onChange={(e) => setCurrentUnit(prev => ({ ...prev, contact: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                      placeholder="+91 90001 00021"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 uppercase tracking-wider">Fleet Readiness Status</label>
                    <select 
                      value={currentUnit?.status || 'Ready'} 
                      onChange={(e) => setCurrentUnit(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs"
                    >
                      <option value="Ready">Ready</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>

                  {currentUnit?.status === 'Dispatched' && (
                    <>
                      <div className="flex flex-col gap-2 col-span-2">
                        <label className="text-white/40 uppercase tracking-wider font-bold text-red-400">Emergent Incident Detail / Coordinates</label>
                        <input 
                          type="text" 
                          required
                          value={currentUnit?.activeIncident || ''} 
                          onChange={(e) => setCurrentUnit(prev => ({ ...prev, activeIncident: e.target.value }))}
                          className="w-full bg-red-950/10 border border-red-500/30 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-500 text-xs uppercase"
                          placeholder="Cardiac arrest in sector 12"
                        />
                      </div>

                      <div className="flex flex-col gap-2 col-span-2">
                        <label className="text-white/40 uppercase tracking-wider">Response Hub Destination Node</label>
                        <input 
                          type="text" 
                          required
                          value={currentUnit?.destinationNode || ''} 
                          onChange={(e) => setCurrentUnit(prev => ({ ...prev, destinationNode: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 text-xs uppercase"
                          placeholder="AV Care Emergency Bay"
                        />
                      </div>
                    </>
                  )}
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
                    className="flex-1 py-3 bg-[linear-gradient(135deg,#DC2626,#ef4444)] rounded-xl text-[10px] uppercase font-black tracking-widest text-white hover:opacity-90 shadow-lg shadow-red-950/40"
                  >
                    Commit Dispatch Wave
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
