import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Camera, Save } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfileModule: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Profile</h2>
          <p className="text-slate-400 text-sm">Manage your personal information and preferences.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors"
        >
          {isEditing ? <><Save size={16} /> Save Changes</> : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-[#0f1225] border border-white/5 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-1">
                <div className="w-full h-full bg-[#0f1225] rounded-[22px] flex items-center justify-center overflow-hidden">
                  <User size={48} className="text-slate-400" />
                </div>
              </div>
              {isEditing && (
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={14} />
                </button>
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
              <Shield size={12} />
              Admin
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              {isEditing ? (
                <input type="text" defaultValue="Admin User" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500" />
              ) : (
                <p className="text-white font-medium text-lg border border-transparent px-4 py-2">Admin User</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              {isEditing ? (
                <input type="email" defaultValue="admin@avcare.os" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500" />
              ) : (
                <div className="flex items-center gap-2 text-white font-medium text-lg border border-transparent px-4 py-2">
                   <Mail size={16} className="text-slate-500" /> admin@avcare.os
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</label>
              {isEditing ? (
                <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500" />
              ) : (
                <div className="flex items-center gap-2 text-white font-medium text-lg border border-transparent px-4 py-2">
                   <Phone size={16} className="text-slate-500" /> +1 (555) 000-0000
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
              {isEditing ? (
                <input type="text" defaultValue="HQ Terminal" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500" />
              ) : (
                <p className="text-white font-medium text-lg border border-transparent px-4 py-2">HQ Terminal</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
