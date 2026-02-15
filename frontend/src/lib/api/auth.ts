import apiClient from './client'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  InviteDetails,
  AcceptInviteRequest,
  User,
} from '@/types/auth'

interface RawUserInfo {
  id: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  salonId?: string
  tenantId?: string
  avatarUrl?: string
  createdAt?: string
  phone?: string
}

interface RawAuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn?: number
  user: RawUserInfo
}

function mapUserInfo(u: RawUserInfo): User {
  return {
    id: u.id,
    email: u.email,
    name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email,
    role: u.role as User['role'],
    salonId: u.salonId ?? '',
    phone: u.phone,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt ?? new Date().toISOString(),
  }
}

function mapAuthResponse(raw: RawAuthResponse): LoginResponse {
  return {
    accessToken: raw.accessToken,
    refreshToken: raw.refreshToken,
    user: mapUserInfo(raw.user),
  }
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<RawAuthResponse>('/auth/login', data)
  return mapAuthResponse(response.data)
}

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const response = await apiClient.post<RawAuthResponse>(
    '/auth/register',
    data
  )
  return mapAuthResponse(response.data)
}

export async function refreshToken(token: string): Promise<LoginResponse> {
  const response = await apiClient.post<RawAuthResponse>('/auth/refresh', {
    refreshToken: token,
  })
  return mapAuthResponse(response.data)
}

export async function requestPasswordReset(
  data: PasswordResetRequest
): Promise<void> {
  await apiClient.post('/auth/password-reset/request', data)
}

export async function confirmPasswordReset(
  data: PasswordResetConfirm
): Promise<void> {
  await apiClient.post('/auth/password-reset/confirm', data)
}

export async function getInviteDetails(
  token: string
): Promise<InviteDetails> {
  const response = await apiClient.get<InviteDetails>(
    `/auth/invite/${token}`
  )
  return response.data
}

export async function acceptInvite(
  token: string,
  data: AcceptInviteRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<RawAuthResponse>(
    `/auth/invite/${token}/accept`,
    data
  )
  return mapAuthResponse(response.data)
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<RawUserInfo>('/auth/me')
  return mapUserInfo(response.data)
}
