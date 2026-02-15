import { create } from 'zustand'

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  resourceType?: string
  resourceId?: string
}

interface NotificationState {
  unreadCount: number
  recentNotifications: Notification[]
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  recentNotifications: [],

  addNotification: (notification: Notification) =>
    set((state) => ({
      recentNotifications: [notification, ...state.recentNotifications].slice(
        0,
        20
      ),
      unreadCount: state.unreadCount + 1,
    })),

  markAsRead: (id: string) =>
    set((state) => ({
      recentNotifications: state.recentNotifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      recentNotifications: state.recentNotifications.map((n) => ({
        ...n,
        read: true,
      })),
      unreadCount: 0,
    })),
}))
