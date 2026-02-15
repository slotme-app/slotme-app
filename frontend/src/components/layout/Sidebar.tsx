import { Link, useMatchRoute } from '@tanstack/react-router'
import {
  Home,
  Calendar,
  Users,
  Scissors,
  UserCircle,
  MessageSquare,
  BarChart3,
  Settings,
  Clock,
  Bell,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useSidebarStore } from '@/stores/sidebarStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { UserRole } from '@/types/auth'

interface NavItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNav: NavItem[] = [
  { label: 'Home', to: '/admin', icon: Home },
  { label: 'Calendar', to: '/admin/calendar', icon: Calendar },
  { label: 'Masters', to: '/admin/masters', icon: Users },
  { label: 'Services', to: '/admin/services', icon: Scissors },
  { label: 'Clients', to: '/admin/clients', icon: UserCircle },
  { label: 'Messages', to: '/admin/channels', icon: MessageSquare },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

const masterNav: NavItem[] = [
  { label: 'My Day', to: '/master', icon: Home },
  { label: 'Calendar', to: '/master/appointments', icon: Calendar },
  { label: 'Services', to: '/master/services', icon: Scissors },
  { label: 'Availability', to: '/master/availability', icon: Clock },
  { label: 'Clients', to: '/master/clients', icon: UserCircle },
  { label: 'Notifications', to: '/master/notifications', icon: Bell },
]

function getNavItems(role: UserRole | null): NavItem[] {
  if (role === 'SALON_ADMIN') return adminNav
  if (role === 'MASTER') return masterNav
  return []
}

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { role } = useAuthStore()
  const { isCollapsed, toggle } = useSidebarStore()
  const navItems = getNavItems(role)

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-sidebar transition-[width] duration-200',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-14 items-center border-b px-4',
          isCollapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!isCollapsed && (
          <span className="text-lg font-semibold text-sidebar-foreground">
            SlotMe
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-sidebar-foreground"
          onClick={toggle}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} item={item} collapsed={isCollapsed} />
          ))}
        </ul>
      </nav>

      <Separator />
      <div className={cn('p-2', isCollapsed && 'flex justify-center')}>
        <span className="text-xs text-muted-foreground">
          {isCollapsed ? 'v1' : 'SlotMe v1.0'}
        </span>
      </div>
    </aside>
  )
}

function SidebarNavItem({
  item,
  collapsed,
}: {
  item: NavItem
  collapsed: boolean
}) {
  const matchRoute = useMatchRoute()
  const isExactMatch = matchRoute({ to: item.to, fuzzy: false })
  const isFuzzyMatch = matchRoute({ to: item.to, fuzzy: true })
  const isActive = item.to.endsWith('/admin') || item.to.endsWith('/master')
    ? Boolean(isExactMatch)
    : Boolean(isFuzzyMatch)

  return (
    <li>
      <Link
        to={item.to}
        className={cn(
          'flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
          isActive && 'bg-sidebar-accent text-sidebar-foreground',
          collapsed && 'justify-center px-0',
        )}
        title={collapsed ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    </li>
  )
}

export { getNavItems, type NavItem }
