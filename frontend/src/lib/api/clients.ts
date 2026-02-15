import apiClient from './client'
import type { Client, ClientNote, Appointment } from '@/types/models'
import type { PaginatedResponse } from '@/types/api'
import { mapAppointment } from './appointments'

export interface ClientListParams {
  search?: string
  page?: number
  size?: number
}

export interface CreateClientRequest {
  name: string
  phone?: string
  email?: string
  preferredMasterId?: string
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}

interface RawClient {
  id: string
  salonId: string
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  notes?: string
  tags?: string[]
  source?: string
  lastVisitAt?: string
  totalVisits: number
  createdAt: string
}

function mapClient(raw: RawClient): Client {
  return {
    id: raw.id,
    salonId: raw.salonId,
    name: [raw.firstName, raw.lastName].filter(Boolean).join(' ') || '',
    phone: raw.phone,
    email: raw.email,
    totalVisits: raw.totalVisits,
    lastVisitDate: raw.lastVisitAt,
    createdAt: raw.createdAt,
    tags: raw.tags,
  }
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

export async function getClients(
  salonId: string,
  params?: ClientListParams,
): Promise<PaginatedResponse<Client>> {
  const { search, ...rest } = params ?? {}
  const response = await apiClient.get<PaginatedResponse<RawClient>>(
    `/salons/${salonId}/clients`,
    { params: { ...rest, query: search } },
  )
  return {
    ...response.data,
    content: response.data.content.map(mapClient),
  }
}

export async function getClient(
  salonId: string,
  clientId: string,
): Promise<Client> {
  const response = await apiClient.get<RawClient>(
    `/salons/${salonId}/clients/${clientId}`,
  )
  return mapClient(response.data)
}

export async function createClient(
  salonId: string,
  data: CreateClientRequest,
): Promise<Client> {
  const { name, phone, email } = data
  const response = await apiClient.post<RawClient>(
    `/salons/${salonId}/clients`,
    { ...splitName(name), phone, email },
  )
  return mapClient(response.data)
}

export async function updateClient(
  salonId: string,
  clientId: string,
  data: UpdateClientRequest,
): Promise<Client> {
  const payload: Record<string, unknown> = {}
  if (data.name !== undefined) {
    Object.assign(payload, splitName(data.name))
  }
  if (data.phone !== undefined) payload.phone = data.phone
  if (data.email !== undefined) payload.email = data.email
  const response = await apiClient.put<RawClient>(
    `/salons/${salonId}/clients/${clientId}`,
    payload,
  )
  return mapClient(response.data)
}

export async function getClientAppointments(
  salonId: string,
  clientId: string,
): Promise<Appointment[]> {
  const response = await apiClient.get(
    `/salons/${salonId}/clients/${clientId}/appointments`,
  )
  const data = response.data
  const list = Array.isArray(data) ? data : (data.content ?? [])
  return list.map(mapAppointment)
}

export async function getClientNotes(
  salonId: string,
  clientId: string,
): Promise<ClientNote[]> {
  const response = await apiClient.get<ClientNote[]>(
    `/salons/${salonId}/clients/${clientId}/notes`,
  )
  return response.data
}

export async function addClientNote(
  salonId: string,
  clientId: string,
  content: string,
): Promise<ClientNote> {
  const response = await apiClient.post<ClientNote>(
    `/salons/${salonId}/clients/${clientId}/notes`,
    { content },
  )
  return response.data
}

export async function deleteClientNote(
  salonId: string,
  clientId: string,
  noteId: string,
): Promise<void> {
  await apiClient.delete(
    `/salons/${salonId}/clients/${clientId}/notes/${noteId}`,
  )
}

export async function addClientTag(
  salonId: string,
  clientId: string,
  tag: string,
): Promise<void> {
  await apiClient.post(`/salons/${salonId}/clients/${clientId}/tags`, { tag })
}

export async function removeClientTag(
  salonId: string,
  clientId: string,
  tag: string,
): Promise<void> {
  await apiClient.delete(
    `/salons/${salonId}/clients/${clientId}/tags/${encodeURIComponent(tag)}`,
  )
}

export async function exportClientData(
  salonId: string,
  clientId: string,
): Promise<Blob> {
  const response = await apiClient.get(
    `/salons/${salonId}/clients/${clientId}/export`,
    { responseType: 'blob' },
  )
  return response.data as Blob
}

export async function deleteClientData(
  salonId: string,
  clientId: string,
): Promise<void> {
  await apiClient.delete(`/salons/${salonId}/clients/${clientId}/data`)
}
