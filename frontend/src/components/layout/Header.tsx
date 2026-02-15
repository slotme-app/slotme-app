import { useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Bell,
  LogOut,
  User,
  Menu,
  Calendar,
  UserCheck,
  XCircle,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import * as notificationsApi from '@/lib/api/notifications'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import type { Notification } from '@/stores/notificationStore'

interface HeaderProps {
  onMobileMenuToggle: () => void
}

const NOTIFICATION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  APPOINTMENT_CONFIRMED: CheckCircle2,
  APPOINTMENT_CANCELLED: XCircle,
  APPOINTMENT_REMINDER: Calendar,
  NEW_BOOKING: Calendar,
  NO_SHOW: UserCheck,
}

function getNotificationIcon(type: string) {
  const Icon = NOTIFICATION_ICONS[type] ?? Info
  return <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
}

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const queryClient = useQueryClient()
  const { unreadCount, recentNotifications, markAsRead, markAllAsRead } =
    useNotificationStore()

  // Polling for notifications
  const { data } = useQuery({
    queryKey: ['notifications-poll', salonId],
    queryFn: () => notificationsApi.getNotifications(salonId, { size: 10 }),
    enabled: !!salonId,
    refetchInterval: 30000,
    retry: 1,
    refetchIntervalInBackground: false,
  })

  // Sync store with API data
  const notifications: Notification[] =
    data?.content ?? recentNotifications
  const currentUnread = data?.totalUnread ?? unreadCount

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.markAsRead(salonId, notificationId),
    onSuccess: (_data, notificationId) => {
      markAsRead(notificationId)
      void queryClient.invalidateQueries({
        queryKey: ['notifications-poll', salonId],
      })
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(salonId),
    onSuccess: () => {
      markAllAsRead()
      void queryClient.invalidateQueries({
        queryKey: ['notifications-poll', salonId],
      })
    },
  })

  const handleLogout = () => {
    logout()
    void navigate({ to: '/login' })
  }

  const initials = (user?.name ?? '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??'

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMobileMenuToggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="flex-1">
        <span className="text-sm font-medium text-muted-foreground">
          {user?.role === 'SALON_ADMIN' ? 'Salon Admin' : 'Master'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {currentUnread > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
                >
                  {currentUnread > 99 ? '99+' : currentUnread}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {currentUnread > 0 && (
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => markAllReadMutation.mutate()}
                >
                  Mark all as read
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No notifications
                </p>
              </div>
            ) : (
              notifications.slice(0, 8).map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => {
                    if (!notif.read) {
                      markReadMutation.mutate(notif.id)
                    }
                  }}
                >
                  {getNotificationIcon(notif.type)}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        !notif.read ? 'font-semibold' : ''
                      }`}
                    >
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatTime(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
              aria-label="User menu"
            >
              <Avatar>
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                void navigate({
                  to: user?.role === 'SALON_ADMIN' ? '/admin/settings' : '/master/notifications',
                })
              }
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
