import React, { useState } from 'react';
import { Settings, Bell, Shield, Hospital, Layout, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const SettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'hospital', label: 'Hospital Info', icon: Hospital },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Theme Mode', icon: Layout },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Settings</h2>
          <p className="text-slate-400 text-sm">Configure AV CareOS admin preferences.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-[#0f1225] border border-white/5 rounded-2xl p-8 shadow-xl min-h-[400px]">
          
          {activeTab === 'general' && (
             <div className="space-y-8 animate-in fade-in">
                <h3 className="text-lg font-bold text-white mb-4">General Configurations</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                     <div>
                        <h4 className="text-sm font-semibold text-white">Maintenance Mode</h4>
                        <p className="text-xs text-slate-400 mt-1">Suspend non-admin access to the portal.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                     </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                     <div>
                        <h4 className="text-sm font-semibold text-white">Auto-Assign Lab Reports</h4>
                        <p className="text-xs text-slate-400 mt-1">Automatically route new lab reports to ordering physician.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                     </label>
                  </div>

                  <div className="space-y-2 mt-6">
                     <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Default Dashboard View</label>
                     <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none">
                        <option value="overview">Overview Dashboard</option>
                        <option value="patients">Patients Flow</option>
                        <option value="billing">Revenue & Billing</option>
                     </select>
                  </div>
                </div>
             </div>
          )}

          {activeTab !== 'general' && (
             <div className="flex flex-col items-center justify-center h-full text-center opacity-50 animate-in fade-in">
                <Settings size={48} className="text-slate-500 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Settings Area placeholder</h3>
                <p className="text-sm text-slate-400">This section is functional, connect to backend for options.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
