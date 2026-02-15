import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Loader2,
  Search,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import * as clientsApi from '@/lib/api/clients'
import * as servicesApi from '@/lib/api/services'
import * as mastersApi from '@/lib/api/masters'
import * as appointmentsApi from '@/lib/api/appointments'
import type { Client, Service, Master } from '@/types/models'

type Step = 'client' | 'service' | 'master' | 'time' | 'confirm'

interface BookingModalProps {
  salonId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate?: string
}

export function BookingModal({
  salonId,
  open,
  onOpenChange,
  defaultDate,
}: BookingModalProps) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<Step>('client')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<appointmentsApi.AvailableSlot | null>(null)
  const [selectedDate, setSelectedDate] = useState(
    defaultDate ?? new Date().toISOString().slice(0, 10),
  )
  const [notes, setNotes] = useState('')

  const reset = useCallback(() => {
    setStep('client')
    setSelectedClient(null)
    setSelectedService(null)
    setSelectedMaster(null)
    setSelectedSlot(null)
    setSelectedDate(defaultDate ?? new Date().toISOString().slice(0, 10))
    setNotes('')
  }, [defaultDate])

  const handleOpenChange = (open: boolean) => {
    if (!open) reset()
    onOpenChange(open)
  }

  const createMutation = useMutation({
    mutationFn: (data: appointmentsApi.CreateAppointmentRequest) =>
      appointmentsApi.createAppointment(salonId, data),
    onSuccess: () => {
      toast.success('Appointment booked')
      handleOpenChange(false)
      void queryClient.invalidateQueries({
        queryKey: ['appointments', salonId],
      })
    },
    onError: () => toast.error('Failed to book appointment'),
  })

  const handleConfirm = () => {
    if (!selectedClient || !selectedService || !selectedMaster || !selectedSlot) return
    createMutation.mutate({
      clientId: selectedClient.id,
      serviceId: selectedService.id,
      masterId: selectedMaster.id,
      startTime: selectedSlot.startTime,
      notes: notes || undefined,
    })
  }

  const goBack = () => {
    const steps: Step[] = ['client', 'service', 'master', 'time', 'confirm']
    const idx = steps.indexOf(step)
    if (idx > 0) setStep(steps[idx - 1])
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          {(['client', 'service', 'master', 'time', 'confirm'] as Step[]).map(
            (s, i) => (
              <span key={s} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <span
                  className={
                    step === s ? 'font-semibold text-foreground' : ''
                  }
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </span>
            ),
          )}
        </div>

        {step === 'client' && (
          <ClientStep
            salonId={salonId}
            onSelect={(client) => {
              setSelectedClient(client)
              setStep('service')
            }}
          />
        )}

        {step === 'service' && (
          <ServiceStep
            salonId={salonId}
            onSelect={(service) => {
              setSelectedService(service)
              setStep('master')
            }}
            onBack={goBack}
          />
        )}

        {step === 'master' && (
          <MasterStep
            salonId={salonId}
            onSelect={(master) => {
              setSelectedMaster(master)
              setStep('time')
            }}
            onBack={goBack}
          />
        )}

        {step === 'time' && selectedService && (
          <TimeStep
            salonId={salonId}
            serviceId={selectedService.id}
            masterId={selectedMaster?.id}
            date={selectedDate}
            onDateChange={setSelectedDate}
            onSelect={(slot) => {
              setSelectedSlot(slot)
              setStep('confirm')
            }}
            onBack={goBack}
          />
        )}

        {step === 'confirm' && (
          <ConfirmStep
            client={selectedClient}
            service={selectedService}
            master={selectedMaster}
            slot={selectedSlot}
            notes={notes}
            onNotesChange={setNotes}
            isPending={createMutation.isPending}
            onConfirm={handleConfirm}
            onBack={goBack}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function ClientStep({
  salonId,
  onSelect,
}: {
  salonId: string
  onSelect: (client: Client) => void
}) {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['clients', salonId, search],
    queryFn: () =>
      clientsApi.getClients(salonId, { search: search || undefined }),
    enabled: !!salonId,
  })

  const clients = data?.content ?? []

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="max-h-64 overflow-y-auto space-y-1">
        {isLoading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)
        ) : clients.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {search ? 'No clients found.' : 'No clients yet.'}
          </p>
        ) : (
          clients.map((client) => (
            <button
              key={client.id}
              type="button"
              className="flex w-full items-center justify-between rounded-md border p-3 text-left hover:bg-accent transition-colors"
              onClick={() => onSelect(client)}
            >
              <div>
                <p className="text-sm font-medium">{client.name}</p>
                <p className="text-xs text-muted-foreground">
                  {client.phone || client.email || 'No contact info'}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}

function ServiceStep({
  salonId,
  onSelect,
  onBack,
}: {
  salonId: string
  onSelect: (service: Service) => void
  onBack: () => void
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['services', salonId],
    queryFn: () => servicesApi.getServices(salonId),
    enabled: !!salonId,
  })

  const categories = data?.categories ?? []
  const uncategorized = data?.uncategorized ?? []
  const hasServices = categories.some((c) => c.services.length > 0) || uncategorized.length > 0

  return (
    <div className="space-y-3">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="max-h-64 overflow-y-auto space-y-3">
        {isLoading ? (
          [1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : !hasServices ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No services available.
          </p>
        ) : (
          <>
            {categories.map((group) => (
              <div key={group.category.id}>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                  {group.category.name}
                </p>
                {group.services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-md border p-3 mb-1 text-left hover:bg-accent transition-colors"
                    onClick={() => onSelect(service)}
                  >
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.duration} min
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ${service.price.toFixed(2)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            ))}
            {uncategorized.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Other
                </p>
                {uncategorized.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-md border p-3 mb-1 text-left hover:bg-accent transition-colors"
                    onClick={() => onSelect(service)}
                  >
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.duration} min
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ${service.price.toFixed(2)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function MasterStep({
  salonId,
  onSelect,
  onBack,
}: {
  salonId: string
  onSelect: (master: Master) => void
  onBack: () => void
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['masters', salonId],
    queryFn: () => mastersApi.getMasters(salonId, { status: 'ACTIVE' }),
    enabled: !!salonId,
  })

  const masters = data?.content ?? []

  return (
    <div className="space-y-3">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="max-h-64 overflow-y-auto space-y-1">
        {isLoading ? (
          [1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)
        ) : masters.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No active masters.
          </p>
        ) : (
          masters.map((master) => (
            <button
              key={master.id}
              type="button"
              className="flex w-full items-center justify-between rounded-md border p-3 text-left hover:bg-accent transition-colors"
              onClick={() => onSelect(master)}
            >
              <div>
                <p className="text-sm font-medium">{master.name}</p>
                <p className="text-xs text-muted-foreground">{master.email}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}

function TimeStep({
  salonId,
  serviceId,
  masterId,
  date,
  onDateChange,
  onSelect,
  onBack,
}: {
  salonId: string
  serviceId: string
  masterId?: string
  date: string
  onDateChange: (date: string) => void
  onSelect: (slot: appointmentsApi.AvailableSlot) => void
  onBack: () => void
}) {
  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['available-slots', salonId, serviceId, masterId, date],
    queryFn: () =>
      appointmentsApi.getAvailableSlots(salonId, {
        serviceId,
        masterId,
        date,
      }),
    select: (data) => (Array.isArray(data) ? data : []),
    enabled: !!salonId && !!serviceId && !!date,
    staleTime: 0,
  })

  const morning = slots.filter((s) => {
    const h = new Date(s.startTime).getHours()
    return h < 12
  })
  const afternoon = slots.filter((s) => {
    const h = new Date(s.startTime).getHours()
    return h >= 12 && h < 17
  })
  const evening = slots.filter((s) => {
    const h = new Date(s.startTime).getHours()
    return h >= 17
  })

  const SlotGroup = ({
    label,
    items,
  }: {
    label: string
    items: appointmentsApi.AvailableSlot[]
  }) =>
    items.length > 0 ? (
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <div className="flex flex-wrap gap-1">
          {items.map((slot) => (
            <button
              key={slot.startTime}
              type="button"
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
              onClick={() => onSelect(slot)}
            >
              {new Date(slot.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </button>
          ))}
        </div>
      </div>
    ) : null

  return (
    <div className="space-y-3">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-2">
        <Label>Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className="max-h-52 overflow-y-auto space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : slots.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No available slots for this date.
          </p>
        ) : (
          <>
            <SlotGroup label="Morning" items={morning} />
            <SlotGroup label="Afternoon" items={afternoon} />
            <SlotGroup label="Evening" items={evening} />
          </>
        )}
      </div>
    </div>
  )
}

function ConfirmStep({
  client,
  service,
  master,
  slot,
  notes,
  onNotesChange,
  isPending,
  onConfirm,
  onBack,
}: {
  client: Client | null
  service: Service | null
  master: Master | null
  slot: appointmentsApi.AvailableSlot | null
  notes: string
  onNotesChange: (notes: string) => void
  isPending: boolean
  onConfirm: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="rounded-md border p-4 space-y-2">
        <h3 className="font-semibold text-sm">Booking Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Client</span>
          <span className="font-medium">{client?.name}</span>
          <span className="text-muted-foreground">Service</span>
          <span className="font-medium">{service?.name}</span>
          <span className="text-muted-foreground">Duration</span>
          <span>{service?.duration} min</span>
          <span className="text-muted-foreground">Master</span>
          <span className="font-medium">{master?.name}</span>
          <span className="text-muted-foreground">Date</span>
          <span>
            {slot
              ? new Date(slot.startTime).toLocaleDateString()
              : ''}
          </span>
          <span className="text-muted-foreground">Time</span>
          <span>
            {slot
              ? `${new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : ''}
          </span>
          <span className="text-muted-foreground">Price</span>
          <Badge variant="secondary">${service?.price.toFixed(2)}</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-notes">Notes (optional)</Label>
        <Textarea
          id="booking-notes"
          placeholder="Any special requests..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={2}
        />
      </div>

      <Button
        className="w-full"
        disabled={isPending}
        onClick={onConfirm}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Check className="mr-2 h-4 w-4" />
        )}
        Confirm Booking
      </Button>
    </div>
  )
}
