import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_dashboard/master')({
  component: MasterLayout,
})

function MasterLayout() {
  const { role } = useAuthStore()

  if (role !== 'MASTER') {
    return <Navigate to="/admin" />
  }

  return <Outlet />
}
