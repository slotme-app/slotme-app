import apiClient from './client'
import type { Salon } from '@/types/models'

export interface SalonSettings extends Salon {
  workingHours: WorkingHoursDay[]
  bookingRules: BookingRules
}

export interface WorkingHoursDay {
  dayOfWeek: number
  dayName: string
  enabled: boolean
  startTime: string
  endTime: string
}

export interface BookingRules {
  minAdvanceMinutes: number
  maxFutureDays: number
  bufferMinutes: number
}

export interface UpdateSalonRequest {
  name?: string
  address?: string
  phone?: string
  email?: string
  timezone?: string
}

export interface UpdateWorkingHoursRequest {
  workingHours: WorkingHoursDay[]
}

export interface UpdateBookingRulesRequest {
  minAdvanceMinutes: number
  maxFutureDays: number
  bufferMinutes: number
}

export async function getSalon(salonId: string): Promise<SalonSettings> {
  const response = await apiClient.get<SalonSettings>(`/salons/${salonId}`)
  return response.data
}

export async function updateSalon(
  salonId: string,
  data: UpdateSalonRequest,
): Promise<Salon> {
  const response = await apiClient.put<Salon>(`/salons/${salonId}`, data)
  return response.data
}

export async function updateWorkingHours(
  salonId: string,
  data: UpdateWorkingHoursRequest,
): Promise<void> {
  await apiClient.put(`/salons/${salonId}/working-hours`, data)
}

export async function updateBookingRules(
  salonId: string,
  data: UpdateBookingRulesRequest,
): Promise<void> {
  await apiClient.put(`/salons/${salonId}/booking-rules`, data)
}
