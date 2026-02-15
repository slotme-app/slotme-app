import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const { isAuthenticated, role } = useAuthStore()

  if (isAuthenticated) {
    if (role === 'SALON_ADMIN') {
      return <Navigate to="/admin" />
    }
    return <Navigate to="/master" />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
