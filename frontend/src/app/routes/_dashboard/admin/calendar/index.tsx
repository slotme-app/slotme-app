import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { CalendarView } from '@/components/calendar/CalendarView'
import { BookingModal } from '@/components/booking/BookingModal'
import * as appointmentsApi from '@/lib/api/appointments'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Appointment } from '@/types/models'

export const Route = createFileRoute('/_dashboard/admin/calendar/')({
  component: CalendarPage,
})

function CalendarPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const queryClient = useQueryClient()
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString(),
    end: new Date(Date.now() + 7 * 86400000).toISOString(),
  })
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', salonId, dateRange.start, dateRange.end],
    queryFn: () =>
      appointmentsApi.getAppointments(salonId, {
        dateFrom: dateRange.start,
        dateTo: dateRange.end,
      }),
    select: (data) => (Array.isArray(data) ? data : []),
    enabled: !!salonId,
    staleTime: 2 * 60 * 1000,
  })

  const reschedMutation = useMutation({
    mutationFn: ({
      appointmentId,
      startTime,
    }: {
      appointmentId: string
      startTime: string
    }) =>
      appointmentsApi.updateAppointment(salonId, appointmentId, { startTime }),
    onSuccess: () => {
      toast.success('Appointment rescheduled')
      void queryClient.invalidateQueries({
        queryKey: ['appointments', salonId],
      })
    },
    onError: () => toast.error('Failed to reschedule'),
  })

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentsApi.cancelAppointment(salonId, appointmentId),
    onSuccess: () => {
      toast.success('Appointment cancelled')
      setDetailOpen(false)
      void queryClient.invalidateQueries({
        queryKey: ['appointments', salonId],
      })
    },
    onError: () => toast.error('Failed to cancel'),
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
      setDetailOpen(false)
      void queryClient.invalidateQueries({
        queryKey: ['appointments', salonId],
      })
    },
    onError: () => toast.error('Failed to update status'),
  })

  const handleDatesChange = useCallback((start: string, end: string) => {
    setDateRange({ start, end })
  }, [])

  const handleEventClick = useCallback(
    (appointmentId: string) => {
      const apt = appointments.find((a) => a.id === appointmentId)
      if (apt) {
        setSelectedAppointment(apt)
        setDetailOpen(true)
      }
    },
    [appointments],
  )

  const handleEventDrop = useCallback(
    (appointmentId: string, newStart: string) => {
      reschedMutation.mutate({ appointmentId, startTime: newStart })
    },
    [reschedMutation],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Manage appointments and schedules
          </p>
        </div>
        <Button onClick={() => setBookingOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-1 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <CalendarView
        appointments={appointments}
        onDatesChange={handleDatesChange}
        onEventClick={handleEventClick}
        onEventDrop={handleEventDrop}
      />

      {/* Appointment Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge>{selectedAppointment.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Client</span>
                  <span className="text-sm">
                    {selectedAppointment.clientName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Service</span>
                  <span className="text-sm">
                    {selectedAppointment.serviceName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Master</span>
                  <span className="text-sm">
                    {selectedAppointment.masterName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Time</span>
                  <span className="text-sm">
                    {new Date(
                      selectedAppointment.startTime,
                    ).toLocaleTimeString()}{' '}
                    -{' '}
                    {new Date(
                      selectedAppointment.endTime,
                    ).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Price</span>
                  <span className="text-sm">
                    ${selectedAppointment.price.toFixed(2)}
                  </span>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <span className="text-sm font-medium">Notes</span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}
              </div>

              {selectedAppointment.status !== 'CANCELLED' &&
                selectedAppointment.status !== 'COMPLETED' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      {selectedAppointment.status === 'PENDING' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          disabled={statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({
                              appointmentId: selectedAppointment.id,
                              status: 'CONFIRMED',
                            })
                          }
                        >
                          Confirm
                        </Button>
                      )}
                      {selectedAppointment.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          disabled={statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({
                              appointmentId: selectedAppointment.id,
                              status: 'IN_PROGRESS',
                            })
                          }
                        >
                          Start
                        </Button>
                      )}
                      {selectedAppointment.status === 'IN_PROGRESS' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          disabled={statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({
                              appointmentId: selectedAppointment.id,
                              status: 'COMPLETED',
                            })
                          }
                        >
                          Complete
                        </Button>
                      )}
                      {(selectedAppointment.status === 'PENDING' ||
                        selectedAppointment.status === 'CONFIRMED') && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          disabled={statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({
                              appointmentId: selectedAppointment.id,
                              status: 'NO_SHOW',
                            })
                          }
                        >
                          No Show
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      disabled={cancelMutation.isPending}
                      onClick={() =>
                        cancelMutation.mutate(selectedAppointment.id)
                      }
                    >
                      Cancel Appointment
                    </Button>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <BookingModal
        salonId={salonId}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  )
}
