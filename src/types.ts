import { Shield, Stethoscope, UserCog, Building2, Ambulance } from 'lucide-react';

export type RoleId = 'admin' | 'doctor' | 'reception' | 'security' | 'ambulance';

export type ViewMode = 'selection' | 'auth' | 'dashboard';

export interface Role {
  id: RoleId;
  title: string;
  description: string;
  color: string;
  gradient: string[];
  icon: any;
  sceneTitle: string;
  sceneSub: string;
}

export const ROLES: Role[] = [
  {
    id: 'admin',
    title: 'Admin',
    description: 'System-wide governance and resource management.',
    color: '#A855F7', // Purple
    gradient: ['#0f0c29', '#302b63', '#6a11cb'],
    icon: UserCog,
    sceneTitle: 'NEURAL CORE',
    sceneSub: 'System Governance Active',
  },
  {
    id: 'doctor',
    title: 'Doctor',
    description: 'Clinical operations and patient care coordination.',
    color: '#22C55E', // Parrot green
    gradient: ['#052e16', '#14532d', '#22C55E'],
    icon: Stethoscope,
    sceneTitle: 'VITAL CORE',
    sceneSub: 'Life Support Synchronized',
  },
  {
    id: 'reception',
    title: 'Reception',
    description: 'Patient intake and scheduling optimization.',
    color: '#14b8a6', // Teal
    gradient: ['#134e5e', '#1e5f6e', '#71b280'],
    icon: Building2,
    sceneTitle: 'FLOW MANAGER',
    sceneSub: 'Patient Routing Optimized',
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Facility monitoring and protocol enforcement.',
    color: '#EF4444', // Red
    gradient: ['#200122', '#450a0a', '#6f0000'],
    icon: Shield,
    sceneTitle: 'AEGIS GRID',
    sceneSub: 'Security Perimeter Stable',
  },
  {
    id: 'ambulance',
    title: 'Ambulance',
    description: 'Emergency response and dispatch logistics.',
    color: '#F59E0B', // Orange
    gradient: ['#ff8008', '#f97316', '#ffc837'],
    icon: Ambulance,
    sceneTitle: 'RAPID PULSE',
    sceneSub: 'Emergency Dispatch Linked',
  },
];
