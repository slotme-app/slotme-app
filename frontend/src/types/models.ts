export interface Salon {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  timezone: string
  logoUrl?: string
  createdAt: string
}

export interface Master {
  id: string
  userId: string
  name: string
  email: string
  phone?: string
  bio?: string
  avatarUrl?: string
  status: MasterStatus
  salonId: string
  services: string[]
  createdAt: string
}

export type MasterStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'

export interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  categoryId: string
  categoryName: string
  bufferTime?: number
  salonId: string
  masterCount: number
}

export interface ServiceCategory {
  id: string
  name: string
  sortOrder: number
  salonId: string
}

export interface Client {
  id: string
  name: string
  phone?: string
  email?: string
  preferredMasterId?: string
  preferredChannel?: string
  totalVisits: number
  lastVisitDate?: string
  salonId: string
  createdAt: string
  tags?: string[]
  totalSpent?: number
  favoriteMaster?: string
  topServices?: string[]
}

export interface ClientNote {
  id: string
  clientId: string
  content: string
  authorName: string
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  masterId: string
  masterName: string
  serviceId: string
  serviceName: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  price: number
  notes?: string
  salonId: string
  createdAt: string
}

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'

export type TimeBlockType = 'BREAK' | 'BLOCKED' | 'PERSONAL'

export interface TimeBlock {
  id: string
  masterId: string
  type: TimeBlockType
  title?: string
  startTime: string
  endTime: string
  recurring: boolean
  dayOfWeek?: number
  salonId: string
}

export interface AvailabilityRule {
  id: string
  masterId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isWorking: boolean
  salonId: string
}

export interface AvailabilityOverride {
  id: string
  masterId: string
  date: string
  startTime?: string
  endTime?: string
  isWorking: boolean
  reason?: string
  salonId: string
}
