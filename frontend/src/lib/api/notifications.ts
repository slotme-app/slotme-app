import apiClient from './client'
import type { Notification } from '@/stores/notificationStore'

export interface NotificationListParams {
  page?: number
  size?: number
  type?: string
  read?: boolean
}

export interface NotificationPreferences {
  confirmations: boolean
  reminders: boolean
  cancellations: boolean
  noShows: boolean
  newBookings: boolean
  systemUpdates: boolean
}

export async function getNotifications(
  salonId: string,
  params?: NotificationListParams,
): Promise<{ content: Notification[]; totalUnread: number }> {
  const response = await apiClient.get<{
    content: Notification[]
    totalUnread: number
  }>(`/salons/${salonId}/notifications`, { params })
  return response.data
}

export async function markAsRead(
  salonId: string,
  notificationId: string,
): Promise<void> {
  await apiClient.patch(
    `/salons/${salonId}/notifications/${notificationId}/read`,
  )
}

export async function markAllAsRead(salonId: string): Promise<void> {
  await apiClient.patch(`/salons/${salonId}/notifications/read-all`)
}

export async function getPreferences(
  salonId: string,
): Promise<NotificationPreferences> {
  const response = await apiClient.get<NotificationPreferences>(
    `/salons/${salonId}/notification-preferences`,
  )
  return response.data
}

export async function updatePreferences(
  salonId: string,
  data: NotificationPreferences,
): Promise<NotificationPreferences> {
  const response = await apiClient.put<NotificationPreferences>(
    `/salons/${salonId}/notification-preferences`,
    data,
  )
  return response.data
}
