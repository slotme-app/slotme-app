import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Clock, CheckCircle2, XCircle, DollarSign, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import * as appointmentsApi from '@/lib/api/appointments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Appointment, AppointmentStatus } from '@/types/models'

export const Route = createFileRoute('/_dashboard/master/')({
  component: MasterMyDayPage,
})

const statusVariant: Record<
  AppointmentStatus,
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  CONFIRMED: 'default',
  IN_PROGRESS: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
  NO_SHOW: 'destructive',
}

function MasterMyDayPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const masterId = user?.id ?? ''
  const queryClient = useQueryClient()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: [
      'master-today',
      salonId,
      masterId,
      todayStart.toISOString().slice(0, 10),
    ],
    queryFn: () =>
      appointmentsApi.getAppointments(salonId, {
        dateFrom: todayStart.toISOString(),
        dateTo: todayEnd.toISOString(),
        masterId,
      }),
    enabled: !!salonId && !!masterId,
    staleTime: 60 * 1000,
  })

  const statusMutation = useMutation({
    mutationFn: ({
      appointmentId,
      status,
    }: {
      appointmentId: string
      status: string
    }) =>
      appointmentsApi.updateAppointment(salonId, appointmentId, { status }),
    onSuccess: () => {
      toast.success('Status updated')
      void queryClient.invalidateQueries({
        queryKey: ['master-today', salonId, masterId],
      })
    },
    onError: () => toast.error('Failed to update status'),
  })

  const now = new Date()
  const upcoming = appointments.filter(
    (a) =>
      new Date(a.startTime) > now &&
      a.status !== 'CANCELLED' &&
      a.status !== 'COMPLETED' &&
      a.status !== 'NO_SHOW',
  )
  const nextAppointment = upcoming.length > 0 ? upcoming[0] : null

  const completed = appointments.filter((a) => a.status === 'COMPLETED')
  const remaining = appointments.filter(
    (a) =>
      a.status !== 'CANCELLED' &&
      a.status !== 'COMPLETED' &&
      a.status !== 'NO_SHOW',
  )
  const totalRevenue = completed.reduce((sum, a) => sum + a.price, 0)

  const sortedAppointments = [...appointments].sort(
    (a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  )

  const getTimeUntil = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - now.getTime()
    if (diff <= 0) return 'Now'
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `in ${mins}m`
    const hours = Math.floor(mins / 60)
    const remainMins = mins % 60
    return `in ${hours}h ${remainMins}m`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Day</h1>
        <p className="text-sm text-muted-foreground">
          {now.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-xs text-muted-foreground">Total Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completed.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{remaining.length}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Appointment Highlight */}
      {nextAppointment && (
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">
              Next Appointment - {getTimeUntil(nextAppointment.startTime)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{nextAppointment.clientName}</p>
                <p className="text-sm text-muted-foreground">
                  {nextAppointment.serviceName} &middot;{' '}
                  {new Date(nextAppointment.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(nextAppointment.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <Badge variant={statusVariant[nextAppointment.status]}>
                {nextAppointment.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointments Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No appointments scheduled for today.
            </p>
          ) : (
            <div className="space-y-3">
              {sortedAppointments.map((apt) => (
                <AppointmentRow
                  key={apt.id}
                  appointment={apt}
                  isNext={apt.id === nextAppointment?.id}
                  isPending={statusMutation.isPending}
                  onStatusChange={(status) =>
                    statusMutation.mutate({
                      appointmentId: apt.id,
                      status,
                    })
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AppointmentRow({
  appointment,
  isNext,
  isPending,
  onStatusChange,
}: {
  appointment: Appointment
  isNext: boolean
  isPending: boolean
  onStatusChange: (status: string) => void
}) {
  const isActive =
    appointment.status !== 'CANCELLED' &&
    appointment.status !== 'COMPLETED' &&
    appointment.status !== 'NO_SHOW'

  return (
    <div
      className={`rounded-md border p-3 ${
        isNext ? 'border-primary bg-primary/5' : ''
      } ${!isActive ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-center shrink-0">
            <p className="text-sm font-semibold">
              {new Date(appointment.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(appointment.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{appointment.clientName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {appointment.serviceName} &middot; ${appointment.price.toFixed(2)}
            </p>
          </div>
        </div>
        <Badge variant={statusVariant[appointment.status]} className="shrink-0 ml-2">
          {appointment.status}
        </Badge>
      </div>
      {isActive && (
        <div className="flex gap-2 mt-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-h-[44px]"
            disabled={isPending}
            onClick={() => onStatusChange('COMPLETED')}
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4 text-green-500" />
            Complete
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-h-[44px]"
            disabled={isPending}
            onClick={() => onStatusChange('NO_SHOW')}
          >
            <XCircle className="mr-1.5 h-4 w-4 text-red-500" />
            No Show
          </Button>
        </div>
      )}
    </div>
  )
}
