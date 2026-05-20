import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  ChevronRight, 
  UserCheck, 
  ToggleLeft, 
  ToggleRight, 
  Sliders, 
  Key, 
  FileText, 
  Eye, 
  PlusSquare, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface RoleDef {
  id: string;
  role: string;
  level: string;
  desc: string;
  usersCount: number;
  modules: {
     dashboard: boolean;
     patients: boolean;
     doctors: boolean;
     appointments: boolean;
     lab: boolean;
     pharmacy: boolean;
     billing: boolean;
     staffHr: boolean;
  };
  actions: {
     view: boolean;
     create: boolean;
     edit: boolean;
     delete: boolean;
  };
}

const INITIAL_ROLES: RoleDef[] = [
  {
    id: 'admin',
    role: "Admin",
    level: "Super User Control • LVL 10",
    desc: "System-wide root governance. Full read/write matrix mapping across all physical and logical clinical resources.",
    usersCount: 2,
    modules: { dashboard: true, patients: true, doctors: true, appointments: true, lab: true, pharmacy: true, billing: true, staffHr: true },
    actions: { view: true, create: true, edit: true, delete: true }
  },
  {
    id: 'doctor',
    role: "Doctor",
    level: "Clinical Practitioner • LVL 8",
    desc: "Oversees diagnostic panels, treatment regimens, inpatient status telemetry, and clinical routing.",
    usersCount: 14,
    modules: { dashboard: true, patients: true, doctors: true, appointments: true, lab: true, pharmacy: false, billing: false, staffHr: false },
    actions: { view: true, create: true, edit: true, delete: false }
  },
  {
    id: 'receptionist',
    role: "Receptionist",
    level: "Registration Dispatch • LVL 5",
    desc: "Primary check-in queue, consult scheduling, patient intake, and staging of outpatient billing codes.",
    usersCount: 4,
    modules: { dashboard: true, patients: true, doctors: false, appointments: true, lab: false, pharmacy: false, billing: true, staffHr: false },
    actions: { view: true, create: true, edit: true, delete: false }
  },
  {
    id: 'pharmacist',
    role: "Pharmacy Staff",
    level: "Pharmacological Ledger • LVL 6",
    desc: "Regulates pharmaceutical logistics, dispenses medicines, audites stock replenishment triggers.",
    usersCount: 5,
    modules: { dashboard: true, patients: false, doctors: false, appointments: false, lab: false, pharmacy: true, billing: true, staffHr: false },
    actions: { view: true, create: true, edit: true, delete: false }
  },
  {
    id: 'lab_staff',
    role: "Lab Staff",
    level: "Pathology Diagnostics • LVL 6",
    desc: "Conducts hematology, biochemistry audits, and uploads diagnostic test results.",
    usersCount: 3,
    modules: { dashboard: true, patients: true, doctors: false, appointments: false, lab: true, pharmacy: false, billing: false, staffHr: false },
    actions: { view: true, create: true, edit: true, delete: false }
  },
  {
    id: 'accountant',
    role: "Accountant",
    level: "Financial Auditing • LVL 7",
    desc: "Handles clinical revenues, refund protocols, insurance claim tracking, and billing ledger audits.",
    usersCount: 2,
    modules: { dashboard: true, patients: false, doctors: false, appointments: false, lab: false, pharmacy: false, billing: true, staffHr: false },
    actions: { view: true, create: true, edit: true, delete: false }
  }
];

export const RolesModule: React.FC = () => {
  const [roles, setRoles] = useState<RoleDef[]>(INITIAL_ROLES);
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);

  const toggleModulePerm = (idx: number, key: keyof RoleDef['modules']) => {
    setRoles(prev => prev.map((role, i) => {
      if (i === idx) {
         return {
           ...role,
           modules: {
              ...role.modules,
              [key]: !role.modules[key]
           }
         };
      }
      return role;
   }));
  };

  const toggleActionPerm = (idx: number, key: keyof RoleDef['actions']) => {
    setRoles(prev => prev.map((role, i) => {
      if (i === idx) {
         return {
           ...role,
           actions: {
              ...role.actions,
              [key]: !role.actions[key]
           }
         };
      }
      return role;
    }));
  };

  const currentRole = roles[selectedRoleIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Roles Navigation Side */}
      <div className="space-y-3 lg:col-span-1">
        <h3 className="text-xs font-black tracking-widest text-white/30 uppercase mb-4 px-1">Active Security Roles</h3>
        {roles.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setSelectedRoleIdx(idx)}
            className={cn(
              "w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-4",
              selectedRoleIdx === idx 
                ? "bg-purple-500/15 border-purple-500/40 text-white shadow-[0_0_20px_rgba(168,85,247,0.1)]" 
                : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-900/60"
            )}
          >
            <div>
              <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className={selectedRoleIdx === idx ? "text-cyan-400" : "text-white/40"} />
                 <span className="text-xs font-black uppercase tracking-wider">{item.role}</span>
              </div>
              <p className="text-[9px] text-white/40 font-bold tracking-widest mt-1.5">{item.level} • {item.usersCount} Nodes</p>
            </div>
            <ChevronRight size={14} className="text-white/20 mt-1" />
          </button>
        ))}
      </div>

      {/* Permissions Workspace Selector */}
      <div className="lg:col-span-2 bg-slate-900/40 border border-white/10 backdrop-blur-3xl rounded-[32px] p-6 lg:p-8 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-6">
             <div>
                <h2 className="text-base font-black text-white uppercase tracking-widest">{currentRole.role} Role matrix</h2>
                <p className="text-[10px] font-black tracking-[0.2em] text-purple-400 uppercase mt-1">{currentRole.level}</p>
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-400/10 text-cyan-400 rounded-full border border-cyan-400/20 text-[9px] font-black uppercase tracking-widest">
               <UserCheck size={10} /> Policies Enforced
             </div>
          </div>

          <p className="text-xs text-white/60 leading-relaxed font-semibold mb-6 italic">
            "{currentRole.desc}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* MODULE PERMISSIONS COLUMN */}
             <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2 text-[#a855f7]">
                  <Sliders size={12} />
                  <h4 className="text-[10px] font-black tracking-widest uppercase">Module Access Permissions</h4>
               </div>
               
               <div className="space-y-2.5">
                  {(Object.keys(currentRole.modules) as Array<keyof RoleDef['modules']>).map((modKey) => {
                    const active = currentRole.modules[modKey];
                    return (
                      <div key={modKey} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-white/70">{modKey} portal</span>
                        <button
                          onClick={() => toggleModulePerm(selectedRoleIdx, modKey)}
                          className={cn("transition-all p-1 rounded-lg border", active ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-white/25 border-white/5 hover:text-white/50")}
                        >
                          {active ? <ToggleRight size={22} className="text-emerald-400" /> : <ToggleLeft size={22} className="text-white/20" />}
                        </button>
                      </div>
                    );
                  })}
               </div>
             </div>

             {/* DATA ACTION PERMISSIONS COLUMN (CRUD) */}
             <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2 text-cyan-400">
                  <Key size={12} />
                  <h4 className="text-[10px] font-black tracking-widest uppercase">CRUD Action Permissions</h4>
               </div>

               <div className="space-y-2.5">
                  {[
                    { key: 'view', label: 'View Records', info: 'Read-only node sync', icon: Eye },
                    { key: 'create', label: 'Create Records', info: 'Write new node records', icon: PlusSquare },
                    { key: 'edit', label: 'Edit/Modify', info: 'Alters backdated data logs', icon: Edit },
                    { key: 'delete', label: 'Delete/Retire', info: 'Full node purging capabilities', icon: Trash2 },
                  ].map((act) => {
                    const active = currentRole.actions[act.key as keyof RoleDef['actions']];
                    return (
                      <div key={act.key} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5">
                        <div>
                          <div className="flex items-center gap-2">
                             <act.icon size={11} className="text-white/30" />
                             <span className="text-[11px] font-black uppercase tracking-wider text-white/70">{act.label}</span>
                          </div>
                          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{act.info}</span>
                        </div>
                        <button
                          onClick={() => toggleActionPerm(selectedRoleIdx, act.key as keyof RoleDef['actions'])}
                          className={cn("transition-all p-1 rounded-lg border", active ? "text-cyan-400 border-cyan-500/20 bg-cyan-500/10" : "text-white/25 border-white/5 hover:text-white/50")}
                        >
                          {active ? <ToggleRight size={22} className="text-cyan-400" /> : <ToggleLeft size={22} className="text-white/20" />}
                        </button>
                      </div>
                    );
                  })}
               </div>
             </div>

          </div>
        </div>

        {/* Warning Policy stamp */}
        <div className="flex items-center gap-3 border-t border-white/5 pt-6 mt-8 text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] leading-relaxed">
           <Lock size={12} className="text-[#a855f7] shrink-0" /> Note: Altering permission sets forces real-time encryption rotations. Active users in edited slots must re-authenticate.
        </div>
      </div>

    </div>
  );
};
