import apiClient from './client'
import type { Appointment } from '@/types/models'

export interface AppointmentListParams {
  dateFrom: string
  dateTo: string
  masterId?: string
  status?: string
}

export interface CreateAppointmentRequest {
  clientId?: string
  clientPhone?: string
  clientName?: string
  serviceId: string
  masterId: string
  startTime: string
  notes?: string
}

export interface UpdateAppointmentRequest {
  startTime?: string
  masterId?: string
  status?: string
  notes?: string
}

// Maps backend field names (startAt/endAt) to frontend field names (startTime/endTime)
export function mapAppointment(apt: any): Appointment {
  return {
    ...apt,
    startTime: apt.startTime ?? apt.startAt,
    endTime: apt.endTime ?? apt.endAt,
  }
}

export interface AvailableSlot {
  startTime: string
  endTime: string
  masterId: string
  masterName: string
}

export async function getAppointments(
  salonId: string,
  params: AppointmentListParams,
): Promise<Appointment[]> {
  const response = await apiClient.get(
    `/salons/${salonId}/appointments`,
    { params },
  )
  const data = response.data
  // Backend may return a paginated response or a plain array
  const list = Array.isArray(data) ? data : (data.content ?? [])
  return list.map(mapAppointment)
}

export async function getAppointment(
  salonId: string,
  appointmentId: string,
): Promise<Appointment> {
  const response = await apiClient.get(
    `/salons/${salonId}/appointments/${appointmentId}`,
  )
  return mapAppointment(response.data)
}

export async function createAppointment(
  salonId: string,
  data: CreateAppointmentRequest,
): Promise<Appointment> {
  const response = await apiClient.post(
    `/salons/${salonId}/appointments`,
    data,
  )
  return mapAppointment(response.data)
}

export async function updateAppointment(
  salonId: string,
  appointmentId: string,
  data: UpdateAppointmentRequest,
): Promise<Appointment> {
  const response = await apiClient.put(
    `/salons/${salonId}/appointments/${appointmentId}`,
    data,
  )
  return mapAppointment(response.data)
}

export async function cancelAppointment(
  salonId: string,
  appointmentId: string,
): Promise<void> {
  await apiClient.patch(
    `/salons/${salonId}/appointments/${appointmentId}/cancel`,
  )
}

export async function getAvailableSlots(
  salonId: string,
  params: {
    serviceId: string
    masterId?: string
    date: string
  },
): Promise<AvailableSlot[]> {
  const response = await apiClient.get(
    `/salons/${salonId}/available-slots`,
    { params },
  )
  const data = response.data
  if (Array.isArray(data)) return data
  const slots = data.slots ?? data.content ?? []
  return slots.flatMap((masterSlot: any) =>
    (masterSlot.availableTimes ?? []).map((time: any) => ({
      startTime: `${masterSlot.date}T${time.start}`,
      endTime: `${masterSlot.date}T${time.end}`,
      masterId: masterSlot.masterId,
      masterName: masterSlot.masterName,
    }))
  )
}
