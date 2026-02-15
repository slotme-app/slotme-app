import { Link, useMatchRoute } from '@tanstack/react-router'
import { Home, Calendar, Clock, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

const masterTabs: TabItem[] = [
  { label: 'My Day', to: '/master', icon: Home },
  { label: 'Calendar', to: '/master/appointments', icon: Calendar },
  { label: 'Hours', to: '/master/availability', icon: Clock },
  { label: 'Alerts', to: '/master/notifications', icon: Bell },
]

export function MobileTabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden"
      role="tablist"
      aria-label="Navigation"
    >
      <div className="flex items-center justify-around">
        {masterTabs.map((tab) => (
          <MobileTab key={tab.to} tab={tab} />
        ))}
      </div>
    </nav>
  )
}

function MobileTab({ tab }: { tab: TabItem }) {
  const matchRoute = useMatchRoute()
  const isExactMatch = matchRoute({ to: tab.to, fuzzy: false })
  const isFuzzyMatch = matchRoute({ to: tab.to, fuzzy: true })
  const isActive = tab.to === '/master'
    ? Boolean(isExactMatch)
    : Boolean(isFuzzyMatch)

  return (
    <Link
      to={tab.to}
      role="tab"
      aria-selected={isActive}
      className={cn(
        'flex min-h-[48px] min-w-[48px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <tab.icon className="h-5 w-5" />
      <span>{tab.label}</span>
    </Link>
  )
}
