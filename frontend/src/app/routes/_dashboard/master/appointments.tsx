import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { CalendarView } from '@/components/calendar/CalendarView'
import * as appointmentsApi from '@/lib/api/appointments'
import * as timeBlocksApi from '@/lib/api/timeBlocks'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type { Appointment, TimeBlock, TimeBlockType } from '@/types/models'
import type { DateSelectArg } from '@fullcalendar/core'

export const Route = createFileRoute('/_dashboard/master/appointments')({
  component: MasterCalendarPage,
})

const BLOCK_COLORS: Record<TimeBlockType, string> = {
  BREAK: '#6b7280',
  BLOCKED: '#ef4444',
  PERSONAL: '#eab308',
}

const timeBlockSchema = z.object({
  type: z.enum(['BREAK', 'BLOCKED', 'PERSONAL']),
  title: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
})

type TimeBlockFormData = z.infer<typeof timeBlockSchema>

function MasterCalendarPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const masterId = user?.id ?? ''
  const queryClient = useQueryClient()

  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString(),
    end: new Date(Date.now() + 7 * 86400000).toISOString(),
  })
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null)
  const [blockDeleteConfirm, setBlockDeleteConfirm] = useState(false)
  const [selectInfo, setSelectInfo] = useState<{
    start: string
    end: string
  } | null>(null)

  const { data: appointments = [], isLoading: loadingApts } = useQuery({
    queryKey: ['master-appointments', salonId, masterId, dateRange.start, dateRange.end],
    queryFn: () =>
      appointmentsApi.getAppointments(salonId, {
        dateFrom: dateRange.start,
        dateTo: dateRange.end,
        masterId,
      }),
    select: (data) => (Array.isArray(data) ? data : []),
    enabled: !!salonId && !!masterId,
    staleTime: 2 * 60 * 1000,
  })

  const { data: timeBlocks = [], isLoading: loadingBlocks } = useQuery({
    queryKey: ['time-blocks', salonId, masterId, dateRange.start, dateRange.end],
    queryFn: () =>
      timeBlocksApi.getTimeBlocks(salonId, masterId, {
        dateFrom: dateRange.start,
        dateTo: dateRange.end,
      }),
    enabled: !!salonId && !!masterId,
  })

  const isLoading = loadingApts || loadingBlocks

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentsApi.cancelAppointment(salonId, appointmentId),
    onSuccess: () => {
      toast.success('Appointment cancelled')
      setDetailOpen(false)
      void queryClient.invalidateQueries({
        queryKey: ['master-appointments', salonId],
      })
    },
    onError: () => toast.error('Failed to cancel'),
  })

  const createBlockMutation = useMutation({
    mutationFn: (data: timeBlocksApi.CreateTimeBlockRequest) =>
      timeBlocksApi.createTimeBlock(salonId, data),
    onSuccess: () => {
      toast.success('Time block created')
      setBlockDialogOpen(false)
      setSelectInfo(null)
      void queryClient.invalidateQueries({
        queryKey: ['time-blocks', salonId, masterId],
      })
    },
    onError: () => toast.error('Failed to create time block'),
  })

  const deleteBlockMutation = useMutation({
    mutationFn: (blockId: string) =>
      timeBlocksApi.deleteTimeBlock(salonId, blockId),
    onSuccess: () => {
      toast.success('Time block deleted')
      setBlockDeleteConfirm(false)
      setSelectedBlock(null)
      void queryClient.invalidateQueries({
        queryKey: ['time-blocks', salonId, masterId],
      })
    },
    onError: () => toast.error('Failed to delete time block'),
  })

  const handleDatesChange = useCallback((start: string, end: string) => {
    setDateRange({ start, end })
  }, [])

  const handleEventClick = useCallback(
    (eventId: string) => {
      const block = timeBlocks.find((b) => b.id === eventId)
      if (block) {
        setSelectedBlock(block)
        setBlockDeleteConfirm(true)
        return
      }
      const apt = appointments.find((a) => a.id === eventId)
      if (apt) {
        setSelectedAppointment(apt)
        setDetailOpen(true)
      }
    },
    [appointments, timeBlocks],
  )

  const handleDateSelect = useCallback((info: DateSelectArg) => {
    setSelectInfo({
      start: info.start.toISOString(),
      end: info.end.toISOString(),
    })
    setBlockDialogOpen(true)
  }, [])

  const calendarEvents = [
    ...appointments.map((apt) => ({
      id: apt.id,
      title: `${apt.clientName} - ${apt.serviceName}`,
      start: apt.startTime,
      end: apt.endTime,
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      extendedProps: { type: 'appointment' as const },
    })),
    ...timeBlocks.map((block) => ({
      id: block.id,
      title: block.title || block.type,
      start: block.startTime,
      end: block.endTime,
      backgroundColor: BLOCK_COLORS[block.type],
      borderColor: BLOCK_COLORS[block.type],
      extendedProps: { type: 'block' as const },
    })),
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Calendar</h1>
        <p className="text-sm text-muted-foreground">
          View appointments and manage time blocks
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: '#3b82f6' }} />
          Appointments
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: '#6b7280' }} />
          Break
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: '#ef4444' }} />
          Blocked
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: '#eab308' }} />
          Personal
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <CalendarView
          appointments={[]}
          customEvents={calendarEvents}
          onDatesChange={handleDatesChange}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          initialView="timeGridDay"
        />
      )}

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
                  <span className="text-sm">{selectedAppointment.clientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Service</span>
                  <span className="text-sm">{selectedAppointment.serviceName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Time</span>
                  <span className="text-sm">
                    {new Date(selectedAppointment.startTime).toLocaleTimeString()} -{' '}
                    {new Date(selectedAppointment.endTime).toLocaleTimeString()}
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
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Time Block Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Time Block</DialogTitle>
          </DialogHeader>
          <TimeBlockForm
            masterId={masterId}
            defaultStart={selectInfo?.start}
            defaultEnd={selectInfo?.end}
            isPending={createBlockMutation.isPending}
            onSubmit={(data) =>
              createBlockMutation.mutate({
                masterId,
                ...data,
              })
            }
          />
        </DialogContent>
      </Dialog>

      {/* Delete Time Block Confirmation */}
      <Dialog open={blockDeleteConfirm} onOpenChange={setBlockDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Time Block</DialogTitle>
          </DialogHeader>
          {selectedBlock && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this{' '}
                <strong>{selectedBlock.type.toLowerCase()}</strong> block
                {selectedBlock.title ? ` "${selectedBlock.title}"` : ''}?
              </p>
              <div className="text-sm space-y-1">
                <p>
                  {new Date(selectedBlock.startTime).toLocaleString()} -{' '}
                  {new Date(selectedBlock.endTime).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBlockDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  disabled={deleteBlockMutation.isPending}
                  onClick={() => deleteBlockMutation.mutate(selectedBlock.id)}
                >
                  {deleteBlockMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TimeBlockForm({
  masterId,
  defaultStart,
  defaultEnd,
  isPending,
  onSubmit,
}: {
  masterId: string
  defaultStart?: string
  defaultEnd?: string
  isPending: boolean
  onSubmit: (data: TimeBlockFormData) => void
}) {
  // Suppress unused variable warning - masterId reserved for future recurring block support
  void masterId

  const toLocalDatetime = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TimeBlockFormData>({
    resolver: zodResolver(timeBlockSchema),
    defaultValues: {
      type: 'BREAK',
      startTime: toLocalDatetime(defaultStart),
      endTime: toLocalDatetime(defaultEnd),
    },
  })

  const processSubmit = (data: TimeBlockFormData) => {
    onSubmit({
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          defaultValue="BREAK"
          onValueChange={(val) =>
            setValue('type', val as TimeBlockFormData['type'])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BREAK">Break</SelectItem>
            <SelectItem value="BLOCKED">Blocked</SelectItem>
            <SelectItem value="PERSONAL">Personal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="block-title">Title (optional)</Label>
        <Input
          id="block-title"
          placeholder="e.g. Lunch break"
          {...register('title')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="block-start">Start</Label>
        <Input
          id="block-start"
          type="datetime-local"
          {...register('startTime')}
        />
        {errors.startTime && (
          <p className="text-sm text-destructive">{errors.startTime.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="block-end">End</Label>
        <Input
          id="block-end"
          type="datetime-local"
          {...register('endTime')}
        />
        {errors.endTime && (
          <p className="text-sm text-destructive">{errors.endTime.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Time Block
      </Button>
    </form>
  )
}
