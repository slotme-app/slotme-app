import apiClient from './client'
import type { TimeBlock } from '@/types/models'

export interface CreateTimeBlockRequest {
  masterId: string
  type: 'BREAK' | 'BLOCKED' | 'PERSONAL'
  title?: string
  startTime: string
  endTime: string
  recurring?: boolean
  dayOfWeek?: number
}

export interface UpdateTimeBlockRequest {
  type?: 'BREAK' | 'BLOCKED' | 'PERSONAL'
  title?: string
  startTime?: string
  endTime?: string
}

export async function getTimeBlocks(
  salonId: string,
  masterId: string,
  params?: { dateFrom?: string; dateTo?: string },
): Promise<TimeBlock[]> {
  const response = await apiClient.get<TimeBlock[]>(
    `/salons/${salonId}/masters/${masterId}/time-blocks`,
    { params },
  )
  return response.data
}

export async function createTimeBlock(
  salonId: string,
  data: CreateTimeBlockRequest,
): Promise<TimeBlock> {
  const response = await apiClient.post<TimeBlock>(
    `/salons/${salonId}/time-blocks`,
    data,
  )
  return response.data
}

export async function updateTimeBlock(
  salonId: string,
  timeBlockId: string,
  data: UpdateTimeBlockRequest,
): Promise<TimeBlock> {
  const response = await apiClient.put<TimeBlock>(
    `/salons/${salonId}/time-blocks/${timeBlockId}`,
    data,
  )
  return response.data
}

export async function deleteTimeBlock(
  salonId: string,
  timeBlockId: string,
): Promise<void> {
  await apiClient.delete(`/salons/${salonId}/time-blocks/${timeBlockId}`)
}
