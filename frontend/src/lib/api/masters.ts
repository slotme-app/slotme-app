import apiClient from './client'
import type { Master } from '@/types/models'
import type { PaginatedResponse, PaginationParams } from '@/types/api'

export interface MasterListParams extends PaginationParams {
  search?: string
  status?: string
}

export interface CreateMasterRequest {
  name: string
  email: string
  phone?: string
  bio?: string
  serviceIds: string[]
}

export interface InviteMasterRequest {
  name: string
  email: string
  phone?: string
}

export interface UpdateMasterRequest {
  name?: string
  phone?: string
  bio?: string
  status?: string
  serviceIds?: string[]
}

interface RawMaster {
  id: string
  salonId: string
  userId: string
  displayName?: string
  bio?: string
  specialization?: string
  avatarUrl?: string
  active: boolean
  sortOrder?: number
  serviceIds?: string[]
  createdAt: string
}

function mapMaster(raw: RawMaster): Master {
  return {
    id: raw.id,
    userId: raw.userId,
    name: raw.displayName ?? '',
    email: '',
    phone: undefined,
    bio: raw.bio,
    avatarUrl: raw.avatarUrl,
    status: raw.active ? 'ACTIVE' : 'INACTIVE',
    salonId: raw.salonId,
    services: raw.serviceIds ?? [],
    createdAt: raw.createdAt,
  }
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

export async function getMasters(
  salonId: string,
  params?: MasterListParams,
): Promise<PaginatedResponse<Master>> {
  const { search, ...rest } = params ?? {}
  const response = await apiClient.get(
    `/salons/${salonId}/masters`,
    { params: { ...rest, query: search } },
  )
  const data = response.data
  // Backend may return a plain array or a paginated response object
  if (Array.isArray(data)) {
    return {
      content: data.map(mapMaster),
      totalElements: data.length,
      totalPages: 1,
      page: 0,
      size: data.length,
    }
  }
  return {
    ...data,
    content: (data.content ?? []).map(mapMaster),
  }
}

export async function getMaster(
  salonId: string,
  masterId: string,
): Promise<Master> {
  const response = await apiClient.get<RawMaster>(
    `/salons/${salonId}/masters/${masterId}`,
  )
  return mapMaster(response.data)
}

export async function createMaster(
  salonId: string,
  data: CreateMasterRequest,
): Promise<Master> {
  const { name, email, phone, bio, serviceIds } = data
  const response = await apiClient.post<RawMaster>(
    `/salons/${salonId}/masters`,
    { ...splitName(name), displayName: name, email, phone, bio, serviceIds },
  )
  return mapMaster(response.data)
}

export async function inviteMaster(
  salonId: string,
  data: InviteMasterRequest,
): Promise<void> {
  const { name, email, phone } = data
  await apiClient.post(`/salons/${salonId}/masters/invite`, {
    ...splitName(name),
    displayName: name,
    email,
    phone,
  })
}

export async function updateMaster(
  salonId: string,
  masterId: string,
  data: UpdateMasterRequest,
): Promise<Master> {
  const payload: Record<string, unknown> = {}
  if (data.name !== undefined) {
    Object.assign(payload, splitName(data.name))
    payload.displayName = data.name
  }
  if (data.phone !== undefined) payload.phone = data.phone
  if (data.bio !== undefined) payload.bio = data.bio
  if (data.status !== undefined) payload.status = data.status
  if (data.serviceIds !== undefined) payload.serviceIds = data.serviceIds
  const response = await apiClient.put<RawMaster>(
    `/salons/${salonId}/masters/${masterId}`,
    payload,
  )
  return mapMaster(response.data)
}

export async function deactivateMaster(
  salonId: string,
  masterId: string,
): Promise<void> {
  await apiClient.patch(`/salons/${salonId}/masters/${masterId}/deactivate`)
}

export async function activateMaster(
  salonId: string,
  masterId: string,
): Promise<void> {
  await apiClient.patch(`/salons/${salonId}/masters/${masterId}/activate`)
}
