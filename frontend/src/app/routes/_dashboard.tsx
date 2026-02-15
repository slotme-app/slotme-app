import { useState } from 'react'
import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { isAuthenticated, role } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMasterRole = role === 'MASTER'

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar className="h-screen" />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMobileMenuToggle={() => setMobileOpen(true)} />
        <main
          className={`flex-1 overflow-y-auto p-4 lg:p-6 ${
            isMasterRole ? 'pb-20 lg:pb-6' : ''
          }`}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Mobile bottom tab bar for master role */}
      {isMasterRole && <MobileTabBar />}
    </div>
  )
}
