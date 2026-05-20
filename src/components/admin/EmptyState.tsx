import React from 'react';
import { Hospital, Inbox } from 'lucide-react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon: Icon = Inbox }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full animate-in fade-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full animate-pulse" />
        <div className="w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center relative z-10 backdrop-blur-sm shadow-xl">
          <Icon size={40} className="text-cyan-400/80" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-white tracking-wide mb-2">{title}</h2>
      <p className="text-slate-400 text-sm max-w-md text-center">{description}</p>
    </div>
  );
};
