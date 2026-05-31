import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export type CommTargetType = 'all' | 'role' | 'department' | 'user';
export type CommPriority =
  | 'system'
  | 'announcement'
  | 'emergency'
  | 'critical'
  | 'department'
  | 'direct'
  | 'information';
export type DeliveryStatus = 'sent' | 'delivered' | 'read';
export type PortalAudience = 'all' | 'admin' | 'doctor' | 'receptionist' | 'security' | 'ambulance';

export interface CommunicationRecord {
  id: string;
  senderId?: string;
  senderName: string;
  senderRole: string;
  targetType: CommTargetType;
  targetRole?: string;
  targetDepartment?: string;
  targetUserId?: string;
  targetUserName?: string;
  title: string;
  message: string;
  priority: CommPriority;
  createdAt: string;
  deliveryStatus: DeliveryStatus;
  isEmergency?: boolean;
  archived?: boolean;
}

export interface CommNotification {
  id: string;
  communicationId: string;
  targetRole: string;
  targetUserId?: string;
  title: string;
  message: string;
  type: CommPriority | 'broadcast';
  isRead: boolean;
  createdAt: string;
}

export interface SendCommunicationInput {
  title: string;
  message: string;
  targetType: CommTargetType;
  targetRole?: string;
  targetDepartment?: string;
  targetUserId?: string;
  targetUserName?: string;
  priority?: CommPriority;
  isEmergency?: boolean;
  senderName?: string;
  senderRole?: string;
  senderId?: string;
}

const COMM_KEY = 'avcare_communications_v1';
const NOTIF_KEY = 'avcare_comm_notifications_v1';
const EMERGENCY_KEY = 'avcare_emergency_banner';

const DEPARTMENTS = [
  'Cardiology',
  'Emergency',
  'Radiology',
  'Pharmacy',
  'ICU',
  'OPD',
  'Others',
] as const;

export { DEPARTMENTS, notificationMatches, matchesRole };

/** Resolve broadcast target fields from compose form state. */
export function resolveBroadcastTarget(input: {
  targetType: CommTargetType;
  targetRole: string;
  targetDepartment: string;
  targetUserQuery: string;
  targetUserName: string;
}): Pick<
  SendCommunicationInput,
  'targetType' | 'targetRole' | 'targetDepartment' | 'targetUserId' | 'targetUserName'
> {
  const { targetType, targetRole, targetDepartment, targetUserQuery, targetUserName } = input;
  return {
    targetType,
    targetRole:
      targetType === 'role' ? targetRole : targetType === 'all' ? 'all' : undefined,
    targetDepartment: targetType === 'department' ? targetDepartment : undefined,
    targetUserId: targetType === 'user' ? targetUserQuery.trim() || undefined : undefined,
    targetUserName:
      targetType === 'user' ? targetUserName.trim() || targetUserQuery.trim() : undefined,
  };
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function normalizePortalRole(role: string): PortalAudience | null {
  const r = role.trim().toLowerCase();
  if (r === 'reception') return 'receptionist';
  const roles: PortalAudience[] = ['all', 'admin', 'doctor', 'receptionist', 'security', 'ambulance'];
  return roles.includes(r as PortalAudience) ? (r as PortalAudience) : null;
}

function matchesRole(record: CommunicationRecord, portalRole: PortalAudience, userId?: string): boolean {
  if (record.targetType === 'user') {
    return !!userId && record.targetUserId === userId;
  }
  if (record.targetType === 'all') return true;
  if (record.targetType === 'role' && record.targetRole) {
    const t = normalizePortalRole(record.targetRole);
    return t === 'all' || t === portalRole;
  }
  if (record.targetType === 'department') return true;
  return false;
}

function notificationMatches(n: CommNotification, portalRole: PortalAudience, userId?: string): boolean {
  if (n.targetUserId) return !!userId && n.targetUserId === userId;
  const r = normalizePortalRole(n.targetRole) ?? 'all';
  if (r === 'all') return true;
  return r === portalRole;
}

function seedCommunications(): CommunicationRecord[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'seed-hospital-core',
      senderName: 'AV CareOS',
      senderRole: 'admin',
      targetType: 'all',
      targetRole: 'all',
      title: 'Hospital Core OS Active',
      message: 'Hospital core systems are now unified under AV CARE OS v1.2.4.',
      priority: 'system',
      createdAt: now,
      deliveryStatus: 'delivered',
      archived: false,
    },
  ];
}

function genId() {
  return crypto.randomUUID?.() ?? `comm-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface CommunicationState {
  communications: CommunicationRecord[];
  notifications: CommNotification[];
  emergencyBanner: CommunicationRecord | null;
  realtimeReady: boolean;
  initFromStorage: () => void;
  subscribeRealtime: () => () => void;
  sendCommunication: (input: SendCommunicationInput) => Promise<CommunicationRecord>;
  getInbox: (portalRole: PortalAudience, userId?: string) => CommunicationRecord[];
  getSent: (senderId?: string) => CommunicationRecord[];
  getLogs: (portalRole: PortalAudience, userId?: string, isAdmin?: boolean) => CommunicationRecord[];
  getGlobalLogs: () => CommunicationRecord[];
  getNotifications: (portalRole: PortalAudience, userId?: string) => CommNotification[];
  getUnreadCount: (portalRole: PortalAudience, userId?: string) => number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (portalRole: PortalAudience, userId?: string) => void;
  markCommunicationRead: (id: string, userId?: string) => void;
  archiveCommunication: (id: string) => void;
  clearEmergencyBanner: () => void;
  searchCommunications: (
    portalRole: PortalAudience,
    query: string,
    filter?: 'all' | 'broadcast' | 'direct' | 'emergency' | 'unread'
  ) => CommunicationRecord[];
}

export const useCommunicationStore = create<CommunicationState>((set, get) => ({
  communications: [],
  notifications: [],
  emergencyBanner: null,
  realtimeReady: false,

  initFromStorage: () => {
    let communications = loadJson<CommunicationRecord[]>(COMM_KEY, []);
    let notifications = loadJson<CommNotification[]>(NOTIF_KEY, []);
    if (communications.length === 0) {
      communications = seedCommunications();
      const seed = communications[0];
      notifications = [
        {
          id: 'seed-notif-hospital-core',
          communicationId: seed.id,
          targetRole: 'all',
          title: seed.title,
          message: seed.message,
          type: 'system',
          isRead: false,
          createdAt: seed.createdAt,
        },
      ];
      saveJson(COMM_KEY, communications);
      saveJson(NOTIF_KEY, notifications);
    }
    const emergency = loadJson<CommunicationRecord | null>(EMERGENCY_KEY, null);
    set({ communications, notifications, emergencyBanner: emergency });
  },

  subscribeRealtime: () => {
    if (get().realtimeReady) {
      return () => undefined;
    }

    get().initFromStorage();

    const channel = supabase
      .channel('avcare-communications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'communications' },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          const record: CommunicationRecord = {
            id: String(row.id),
            senderId: row.sender_id as string | undefined,
            senderName: String(row.sender_name ?? 'System'),
            senderRole: String(row.sender_role ?? 'admin'),
            targetType: row.target_type as CommTargetType,
            targetRole: row.target_role as string | undefined,
            targetDepartment: row.target_department as string | undefined,
            targetUserId: row.target_user_id as string | undefined,
            targetUserName: row.target_user_name as string | undefined,
            title: String(row.title),
            message: String(row.message),
            priority: row.priority as CommPriority,
            createdAt: String(row.created_at),
            deliveryStatus: (row.delivery_status as DeliveryStatus) ?? 'delivered',
            isEmergency: Boolean(row.is_emergency),
            archived: Boolean(row.archived),
          };
          set((s) => {
            if (s.communications.some((c) => c.id === record.id)) return s;
            const communications = [record, ...s.communications];
            saveJson(COMM_KEY, communications);
            return {
              communications,
              emergencyBanner: record.isEmergency ? record : s.emergencyBanner,
            };
          });
          window.dispatchEvent(
            new CustomEvent('avcare:toast', {
              detail: {
                type: record.isEmergency ? 'error' : 'info',
                message: record.title,
              },
            })
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          const notif: CommNotification = {
            id: String(row.id),
            communicationId: String(row.communication_id ?? ''),
            targetRole: String(row.target_role ?? 'all'),
            targetUserId: row.user_id as string | undefined,
            title: String(row.title),
            message: String(row.message),
            type: row.type as CommNotification['type'],
            isRead: Boolean(row.is_read),
            createdAt: String(row.created_at),
          };
          set((s) => {
            if (s.notifications.some((n) => n.id === notif.id)) return s;
            const notifications = [notif, ...s.notifications];
            saveJson(NOTIF_KEY, notifications);
            return { notifications };
          });
        }
      )
      .subscribe();

    const onStorage = (e: StorageEvent) => {
      if (e.key === COMM_KEY || e.key === NOTIF_KEY || e.key === EMERGENCY_KEY) {
        get().initFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);

    set({ realtimeReady: true });

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('storage', onStorage);
      set({ realtimeReady: false });
    };
  },

  sendCommunication: async (input) => {
    const record: CommunicationRecord = {
      id: genId(),
      senderId: input.senderId,
      senderName: input.senderName ?? 'System Admin',
      senderRole: input.senderRole ?? 'admin',
      targetType: input.targetType,
      targetRole:
        input.targetType === 'role'
          ? input.targetRole ?? 'all'
          : input.targetType === 'all'
            ? 'all'
            : input.targetRole,
      targetDepartment: input.targetDepartment,
      targetUserId: input.targetUserId,
      targetUserName: input.targetUserName,
      title: input.title,
      message: input.message,
      priority: input.priority ?? (input.isEmergency ? 'emergency' : 'announcement'),
      createdAt: new Date().toISOString(),
      deliveryStatus: 'delivered',
      isEmergency: input.isEmergency ?? false,
      archived: false,
    };

    const notifTargetRole =
      input.targetType === 'all'
        ? 'all'
        : input.targetType === 'role'
          ? normalizePortalRole(input.targetRole ?? 'all') ?? 'all'
          : input.targetType === 'department'
            ? 'all'
            : input.targetRole ?? 'all';

    const notification: CommNotification = {
      id: genId(),
      communicationId: record.id,
      targetRole: notifTargetRole,
      targetUserId: input.targetUserId,
      title: input.title,
      message: input.message,
      type: record.priority,
      isRead: false,
      createdAt: record.createdAt,
    };

    set((s) => {
      const communications = [record, ...s.communications];
      const notifications = [notification, ...s.notifications];
      saveJson(COMM_KEY, communications);
      saveJson(NOTIF_KEY, notifications);
      if (record.isEmergency) saveJson(EMERGENCY_KEY, record);
      return {
        communications,
        notifications,
        emergencyBanner: record.isEmergency ? record : s.emergencyBanner,
      };
    });

    window.dispatchEvent(new CustomEvent('avcare:toast', { detail: { type: 'info', message: record.title } }));

    try {
      const { data: auth } = await supabase.auth.getUser();
      await supabase.from('communications').insert({
        id: record.id,
        sender_id: auth.user?.id ?? null,
        sender_name: record.senderName,
        sender_role: record.senderRole,
        target_type: record.targetType,
        target_role: record.targetRole ?? null,
        target_department: record.targetDepartment ?? null,
        target_user_id: record.targetUserId ?? null,
        target_user_name: record.targetUserName ?? null,
        title: record.title,
        message: record.message,
        priority: record.priority,
        delivery_status: record.deliveryStatus,
        is_emergency: record.isEmergency ?? false,
        created_at: record.createdAt,
      });
      await supabase.from('notifications').insert({
        id: notification.id,
        user_id: record.targetUserId ?? null,
        target_role: notification.targetRole,
        communication_id: record.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        is_read: false,
        created_at: notification.createdAt,
      });
    } catch {
      /* local-first when Supabase tables unavailable */
    }

    return record;
  },

  getInbox: (portalRole, userId) =>
    get()
      .communications.filter((c) => !c.archived && matchesRole(c, portalRole, userId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  getSent: (senderId) =>
    get()
      .communications.filter((c) => !senderId || c.senderId === senderId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  getLogs: (portalRole, userId, isAdmin) => {
    if (isAdmin) return get().getGlobalLogs();
    const inbox = get().getInbox(portalRole, userId);
    const sent = get().getSent(userId);
    const ids = new Set<string>();
    return [...inbox, ...sent].filter((c) => {
      if (ids.has(c.id)) return false;
      ids.add(c.id);
      return true;
    });
  },

  getGlobalLogs: () =>
    get()
      .communications.filter((c) => !c.archived)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  getNotifications: (portalRole, userId) =>
    get()
      .notifications.filter((n) => notificationMatches(n, portalRole, userId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  getUnreadCount: (portalRole, userId) =>
    get().getNotifications(portalRole, userId).filter((n) => !n.isRead).length,

  markNotificationRead: (id) => {
    set((s) => {
      const notifications = s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      saveJson(NOTIF_KEY, notifications);
      return { notifications };
    });
  },

  markAllNotificationsRead: (portalRole, userId) => {
    set((s) => {
      const notifications = s.notifications.map((n) =>
        notificationMatches(n, portalRole, userId) ? { ...n, isRead: true } : n
      );
      saveJson(NOTIF_KEY, notifications);
      return { notifications };
    });
  },

  markCommunicationRead: (id, userId) => {
    set((s) => {
      const communications = s.communications.map((c) =>
        c.id === id ? { ...c, deliveryStatus: 'read' as DeliveryStatus } : c
      );
      saveJson(COMM_KEY, communications);
      return { communications };
    });
    if (userId) {
      supabase.from('communication_reads').upsert({
        communication_id: id,
        user_id: userId,
        read_at: new Date().toISOString(),
      });
    }
  },

  archiveCommunication: (id) => {
    set((s) => {
      const communications = s.communications.map((c) => (c.id === id ? { ...c, archived: true } : c));
      saveJson(COMM_KEY, communications);
      return { communications };
    });
  },

  clearEmergencyBanner: () => {
    localStorage.removeItem(EMERGENCY_KEY);
    set({ emergencyBanner: null });
  },

  searchCommunications: (portalRole, query, filter = 'all') => {
    const q = query.trim().toLowerCase();
    let list = get().getInbox(portalRole);
    if (filter === 'emergency') list = list.filter((c) => c.isEmergency || c.priority === 'emergency' || c.priority === 'critical');
    if (filter === 'broadcast') list = list.filter((c) => c.targetType !== 'user');
    if (filter === 'direct') list = list.filter((c) => c.targetType === 'user');
    if (filter === 'unread') list = list.filter((c) => c.deliveryStatus !== 'read');
    if (!q) return list;
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        c.senderName.toLowerCase().includes(q)
    );
  },
}));
