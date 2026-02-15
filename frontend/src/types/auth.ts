export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  salonId: string
  avatarUrl?: string
  createdAt: string
}

export type UserRole = 'SALON_ADMIN' | 'MASTER'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone: string
  salonName: string
  salonAddress?: string
  salonPhone?: string
  timezone: string
}

export interface RegisterResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  newPassword: string
}

export interface InviteDetails {
  token: string
  salonName: string
  masterName: string
  email: string
}

export interface AcceptInviteRequest {
  name: string
  password: string
}
