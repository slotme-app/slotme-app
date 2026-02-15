import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types/auth'
import * as authApi from '@/lib/api/auth'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<string>
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(persist((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await authApi.login({ email, password })
      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        role: response.user.role,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
      throw new Error('Login failed')
    }
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      role: null,
      isAuthenticated: false,
    })
  },

  refreshAuth: async () => {
    const { refreshToken } = get()
    if (!refreshToken) {
      get().logout()
      throw new Error('Session expired')
    }
    try {
      const response = await authApi.refreshToken(refreshToken)
      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        role: response.user.role,
        isAuthenticated: true,
      })
      return response.accessToken
    } catch {
      get().logout()
      throw new Error('Session expired')
    }
  },

  setAuth: (user: User, accessToken: string, refreshToken: string) => {
    set({
      user,
      accessToken,
      refreshToken,
      role: user.role,
      isAuthenticated: true,
    })
  },
}), {
  name: 'slotme-auth',
  partialize: (state) => ({
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    role: state.role,
    isAuthenticated: state.isAuthenticated,
  }),
}))
