import { useRef, useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type {
  EventClickArg,
  DateSelectArg,
  EventDropArg,
  DatesSetArg,
} from '@fullcalendar/core'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Appointment, AppointmentStatus } from '@/types/models'

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#22c55e',
  IN_PROGRESS: '#3b82f6',
  COMPLETED: '#6b7280',
  CANCELLED: '#ef4444',
  NO_SHOW: '#9333ea',
}

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  extendedProps?: Record<string, unknown>
}

interface CalendarViewProps {
  appointments: Appointment[]
  customEvents?: CalendarEvent[]
  onDateSelect?: (info: DateSelectArg) => void
  onEventClick?: (appointmentId: string) => void
  onEventDrop?: (appointmentId: string, newStart: string) => void
  onDatesChange?: (start: string, end: string) => void
  initialView?: string
}

export function CalendarView({
  appointments,
  customEvents,
  onDateSelect,
  onEventClick,
  onEventDrop,
  onDatesChange,
  initialView = 'timeGridWeek',
}: CalendarViewProps) {
  const calendarRef = useRef<FullCalendar>(null)
  const [currentView, setCurrentView] = useState(initialView)
  const [title, setTitle] = useState('')

  const items = Array.isArray(appointments) ? appointments : (appointments as unknown as { content?: Appointment[] })?.content ?? []
  const appointmentEvents = items.map((apt) => ({
    id: apt.id,
    title: `${apt.clientName} - ${apt.serviceName}`,
    start: apt.startTime,
    end: apt.endTime,
    backgroundColor: STATUS_COLORS[apt.status],
    borderColor: STATUS_COLORS[apt.status],
    extendedProps: { appointment: apt },
  }))

  const events = customEvents ?? appointmentEvents

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      onEventClick?.(info.event.id)
    },
    [onEventClick],
  )

  const handleEventDrop = useCallback(
    (info: EventDropArg) => {
      if (info.event.start) {
        onEventDrop?.(info.event.id, info.event.start.toISOString())
      }
    },
    [onEventDrop],
  )

  const handleDatesSet = useCallback(
    (info: DatesSetArg) => {
      setTitle(info.view.title)
      onDatesChange?.(info.startStr, info.endStr)
    },
    [onDatesChange],
  )

  const goToView = (view: string) => {
    const api = calendarRef.current?.getApi()
    if (api) {
      api.changeView(view)
      setCurrentView(view)
    }
  }

  const navigate = (action: 'prev' | 'next' | 'today') => {
    const api = calendarRef.current?.getApi()
    if (api) {
      if (action === 'prev') api.prev()
      else if (action === 'next') api.next()
      else api.today()
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('today')}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        <div className="flex gap-1">
          {[
            { key: 'timeGridDay', label: 'Day' },
            { key: 'timeGridWeek', label: 'Week' },
            { key: 'dayGridMonth', label: 'Month' },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={currentView === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => goToView(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-md border bg-background">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={initialView}
          headerToolbar={false}
          events={events}
          editable
          selectable
          selectMirror
          select={onDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          datesSet={handleDatesSet}
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          nowIndicator
          height="auto"
          expandRows
          dayMaxEvents={3}
        />
      </div>
    </div>
  )
}
