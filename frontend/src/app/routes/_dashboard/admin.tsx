import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_dashboard/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const { role } = useAuthStore()

  if (role !== 'SALON_ADMIN') {
    return <Navigate to="/master" />
  }

  return <Outlet />
}
