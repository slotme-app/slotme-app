import apiClient from './client'
import type { AvailabilityRule, AvailabilityOverride } from '@/types/models'

export interface UpdateAvailabilityRulesRequest {
  rules: {
    dayOfWeek: number
    startTime: string
    endTime: string
    isWorking: boolean
  }[]
}

export interface CreateOverrideRequest {
  date: string
  startTime?: string
  endTime?: string
  isWorking: boolean
  reason?: string
}

export async function getAvailabilityRules(
  salonId: string,
  masterId: string,
): Promise<AvailabilityRule[]> {
  const response = await apiClient.get<AvailabilityRule[]>(
    `/salons/${salonId}/masters/${masterId}/availability-rules`,
  )
  return response.data
}

export async function updateAvailabilityRules(
  salonId: string,
  masterId: string,
  data: UpdateAvailabilityRulesRequest,
): Promise<AvailabilityRule[]> {
  const response = await apiClient.put<AvailabilityRule[]>(
    `/salons/${salonId}/masters/${masterId}/availability-rules`,
    data,
  )
  return response.data
}

export async function getOverrides(
  salonId: string,
  masterId: string,
  params?: { dateFrom?: string; dateTo?: string },
): Promise<AvailabilityOverride[]> {
  const response = await apiClient.get<AvailabilityOverride[]>(
    `/salons/${salonId}/masters/${masterId}/availability-overrides`,
    { params },
  )
  return response.data
}

export async function createOverride(
  salonId: string,
  masterId: string,
  data: CreateOverrideRequest,
): Promise<AvailabilityOverride> {
  const response = await apiClient.post<AvailabilityOverride>(
    `/salons/${salonId}/masters/${masterId}/availability-overrides`,
    data,
  )
  return response.data
}

export async function deleteOverride(
  salonId: string,
  masterId: string,
  overrideId: string,
): Promise<void> {
  await apiClient.delete(
    `/salons/${salonId}/masters/${masterId}/availability-overrides/${overrideId}`,
  )
}
