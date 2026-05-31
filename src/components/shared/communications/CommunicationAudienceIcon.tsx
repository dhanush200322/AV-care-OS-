import React from 'react';
import { Radio, UserCircle2, Building2, Users } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { CommTargetType } from '../../../store/communicationStore';

export function recipientLabel(
  targetType: CommTargetType,
  targetRole?: string,
  targetDepartment?: string,
  targetUserName?: string
): string {
  if (targetType === 'user') return targetUserName ?? 'Individual User';
  if (targetType === 'department') return targetDepartment ?? 'Department';
  if (targetType === 'all') return 'ALL STATIONS';
  if (targetRole === 'doctor') return 'DOCTORS';
  if (targetRole === 'receptionist' || targetRole === 'reception') return 'RECEPTION';
  if (targetRole === 'security') return 'SECURITY';
  if (targetRole === 'ambulance') return 'AMBULANCE';
  if (targetRole === 'admin') return 'ADMIN TEAM';
  return (targetRole ?? 'ALL').toUpperCase();
}

export function audienceBadgeClass(audience: string): string {
  const base = 'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border';
  if (audience === 'all') return cn(base, 'bg-purple-500/20 text-purple-300 border-purple-500/20');
  if (audience === 'doctor') return cn(base, 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20');
  if (audience === 'receptionist' || audience === 'reception')
    return cn(base, 'bg-teal-500/20 text-teal-300 border-teal-500/20');
  if (audience === 'security') return cn(base, 'bg-blue-500/20 text-blue-300 border-blue-500/20');
  if (audience === 'admin') return cn(base, 'bg-violet-500/20 text-violet-300 border-violet-500/20');
  if (audience === 'department') return cn(base, 'bg-amber-500/20 text-amber-300 border-amber-500/20');
  return cn(base, 'bg-orange-500/20 text-orange-300 border-orange-500/20');
}

interface AudienceIconProps {
  targetType: CommTargetType;
  targetRole?: string;
  className?: string;
}

export const CommunicationAudienceIcon: React.FC<AudienceIconProps> = ({
  targetType,
  targetRole,
  className,
}) => {
  const base = cn(
    'w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0',
    className
  );
  const role = targetRole ?? 'all';

  if (targetType === 'user') {
    return (
      <div className={cn(base, 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400')}>
        <UserCircle2 size={20} />
      </div>
    );
  }
  if (targetType === 'department') {
    return (
      <div className={cn(base, 'bg-amber-500/10 border-amber-500/20 text-amber-400')}>
        <Building2 size={20} />
      </div>
    );
  }
  if (targetType === 'all' || role === 'all') {
    return (
      <div className={cn(base, 'bg-purple-500/10 border-purple-500/20 text-purple-400')}>
        <Radio size={20} />
      </div>
    );
  }
  if (role === 'doctor') {
    return (
      <div className={cn(base, 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400')}>
        <Users size={20} />
      </div>
    );
  }
  if (role === 'receptionist' || role === 'reception') {
    return (
      <div className={cn(base, 'bg-teal-500/10 border-teal-500/20 text-teal-400')}>
        <Radio size={20} />
      </div>
    );
  }
  if (role === 'security') {
    return (
      <div className={cn(base, 'bg-blue-500/10 border-blue-500/20 text-blue-400')}>
        <Radio size={20} />
      </div>
    );
  }
  return (
    <div className={cn(base, 'bg-orange-500/10 border-orange-500/20 text-orange-400')}>
      <Radio size={20} />
    </div>
  );
};

export function deliveryStatusBadge(status: string): string {
  const base = 'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border';
  if (status === 'read') return cn(base, 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20');
  if (status === 'delivered') return cn(base, 'bg-blue-500/20 text-blue-300 border-blue-500/20');
  return cn(base, 'bg-slate-500/20 text-slate-300 border-slate-500/20');
}
