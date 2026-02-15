import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import * as notificationsApi from '@/lib/api/notifications'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_dashboard/master/notifications')({
  component: MasterNotificationsPage,
})

function MasterNotificationsPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const queryClient = useQueryClient()

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['notification-preferences', salonId],
    queryFn: () => notificationsApi.getPreferences(salonId),
    enabled: !!salonId,
  })

  const updateMutation = useMutation({
    mutationFn: (data: notificationsApi.NotificationPreferences) =>
      notificationsApi.updatePreferences(salonId, data),
    onSuccess: () => {
      toast.success('Preferences updated')
      void queryClient.invalidateQueries({
        queryKey: ['notification-preferences', salonId],
      })
    },
    onError: () => toast.error('Failed to update preferences'),
  })

  const handleToggle = (key: keyof notificationsApi.NotificationPreferences) => {
    if (!preferences) return
    updateMutation.mutate({
      ...preferences,
      [key]: !preferences[key],
    })
  }

  const toggleItems: {
    key: keyof notificationsApi.NotificationPreferences
    label: string
    description: string
  }[] = [
    {
      key: 'newBookings',
      label: 'New Bookings',
      description: 'Get notified when a new appointment is booked',
    },
    {
      key: 'confirmations',
      label: 'Confirmations',
      description: 'Receive confirmation notifications for appointments',
    },
    {
      key: 'reminders',
      label: 'Reminders',
      description: 'Get reminders before upcoming appointments',
    },
    {
      key: 'cancellations',
      label: 'Cancellations',
      description: 'Get notified when an appointment is cancelled',
    },
    {
      key: 'noShows',
      label: 'No-Shows',
      description: 'Get notified about client no-shows',
    },
    {
      key: 'systemUpdates',
      label: 'System Updates',
      description: 'Receive system and maintenance notifications',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notification Settings</h1>
        <p className="text-sm text-muted-foreground">
          Choose which notifications you want to receive
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {toggleItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-md border p-4"
                >
                  <div>
                    <Label className="text-sm font-medium">
                      {item.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences?.[item.key] ?? false}
                    onClick={() => handleToggle(item.key)}
                    disabled={updateMutation.isPending}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      preferences?.[item.key]
                        ? 'bg-primary'
                        : 'bg-input'
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                        preferences?.[item.key]
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
              {updateMutation.isPending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
