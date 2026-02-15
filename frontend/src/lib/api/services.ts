import apiClient from './client'
import type { Service, ServiceCategory } from '@/types/models'

export interface CreateServiceRequest {
  name: string
  description?: string
  duration: number
  price: number
  categoryId: string
  bufferTime?: number
  masterIds?: string[]
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  active?: boolean
}

export interface CreateCategoryRequest {
  name: string
  sortOrder?: number
}

export interface ServiceWithCategory extends Service {
  active: boolean
}

export interface GroupedServices {
  categories: Array<{
    category: ServiceCategory
    services: ServiceWithCategory[]
  }>
  uncategorized: ServiceWithCategory[]
}

export async function getServices(salonId: string): Promise<GroupedServices> {
  const response = await apiClient.get<GroupedServices>(
    `/salons/${salonId}/services`,
  )
  return response.data
}

export async function createService(
  salonId: string,
  data: CreateServiceRequest,
): Promise<Service> {
  const response = await apiClient.post<Service>(
    `/salons/${salonId}/services`,
    data,
  )
  return response.data
}

export async function updateService(
  salonId: string,
  serviceId: string,
  data: UpdateServiceRequest,
): Promise<Service> {
  const response = await apiClient.put<Service>(
    `/salons/${salonId}/services/${serviceId}`,
    data,
  )
  return response.data
}

export async function deleteService(
  salonId: string,
  serviceId: string,
): Promise<void> {
  await apiClient.delete(`/salons/${salonId}/services/${serviceId}`)
}

export async function getCategories(
  salonId: string,
): Promise<ServiceCategory[]> {
  const response = await apiClient.get<ServiceCategory[]>(
    `/salons/${salonId}/service-categories`,
  )
  return response.data
}

export async function createCategory(
  salonId: string,
  data: CreateCategoryRequest,
): Promise<ServiceCategory> {
  const response = await apiClient.post<ServiceCategory>(
    `/salons/${salonId}/service-categories`,
    data,
  )
  return response.data
}

export async function updateCategory(
  salonId: string,
  categoryId: string,
  data: Partial<CreateCategoryRequest>,
): Promise<ServiceCategory> {
  const response = await apiClient.put<ServiceCategory>(
    `/salons/${salonId}/service-categories/${categoryId}`,
    data,
  )
  return response.data
}

export async function deleteCategory(
  salonId: string,
  categoryId: string,
): Promise<void> {
  await apiClient.delete(
    `/salons/${salonId}/service-categories/${categoryId}`,
  )
}
