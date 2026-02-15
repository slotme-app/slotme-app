import { Link, useMatchRoute } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { getNavItems, type NavItem } from '@/components/layout/Sidebar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const { role } = useAuthStore()
  const navItems = getNavItems(role)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="text-lg">SlotMe</SheetTitle>
        </SheetHeader>
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <MobileNavItem
                key={item.to}
                item={item}
                onNavigate={() => onOpenChange(false)}
              />
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function MobileNavItem({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate: () => void
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
        onClick={onNavigate}
        className={cn(
          'flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          'text-foreground/70 hover:bg-accent hover:text-foreground',
          isActive && 'bg-accent text-foreground',
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span>{item.label}</span>
      </Link>
    </li>
  )
}
