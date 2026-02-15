import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/')({
  component: IndexRedirect,
})

function IndexRedirect() {
  const { isAuthenticated, role } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (role === 'SALON_ADMIN') {
    return <Navigate to="/admin" />
  }

  return <Navigate to="/master" />
}
