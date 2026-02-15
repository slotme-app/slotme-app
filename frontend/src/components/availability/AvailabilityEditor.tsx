import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import * as availabilityApi from '@/lib/api/availability'

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

interface AvailabilityEditorProps {
  salonId: string
  masterId: string
}

export function AvailabilityEditor({
  salonId,
  masterId,
}: AvailabilityEditorProps) {
  const queryClient = useQueryClient()
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false)

  const { data: rules = [], isLoading: loadingRules } = useQuery({
    queryKey: ['availability-rules', salonId, masterId],
    queryFn: () => availabilityApi.getAvailabilityRules(salonId, masterId),
    enabled: !!salonId && !!masterId,
  })

  const { data: overrides = [], isLoading: loadingOverrides } = useQuery({
    queryKey: ['availability-overrides', salonId, masterId],
    queryFn: () => availabilityApi.getOverrides(salonId, masterId),
    enabled: !!salonId && !!masterId,
  })

  const updateRulesMutation = useMutation({
    mutationFn: (
      data: availabilityApi.UpdateAvailabilityRulesRequest,
    ) => availabilityApi.updateAvailabilityRules(salonId, masterId, data),
    onSuccess: () => {
      toast.success('Availability updated')
      void queryClient.invalidateQueries({
        queryKey: ['availability-rules', salonId, masterId],
      })
    },
    onError: () => toast.error('Failed to update availability'),
  })

  const createOverrideMutation = useMutation({
    mutationFn: (data: availabilityApi.CreateOverrideRequest) =>
      availabilityApi.createOverride(salonId, masterId, data),
    onSuccess: () => {
      toast.success('Override created')
      setOverrideDialogOpen(false)
      void queryClient.invalidateQueries({
        queryKey: ['availability-overrides', salonId, masterId],
      })
    },
    onError: () => toast.error('Failed to create override'),
  })

  const deleteOverrideMutation = useMutation({
    mutationFn: (overrideId: string) =>
      availabilityApi.deleteOverride(salonId, masterId, overrideId),
    onSuccess: () => {
      toast.success('Override deleted')
      void queryClient.invalidateQueries({
        queryKey: ['availability-overrides', salonId, masterId],
      })
    },
    onError: () => toast.error('Failed to delete override'),
  })

  const getRuleForDay = useCallback(
    (dayOfWeek: number) => {
      return rules.find((r) => r.dayOfWeek === dayOfWeek)
    },
    [rules],
  )

  const handleToggleDay = (dayOfWeek: number) => {
    const existing = getRuleForDay(dayOfWeek)
    const updatedRules = DAYS.map((_, idx) => {
      const dow = idx + 1
      const rule = getRuleForDay(dow)
      if (dow === dayOfWeek) {
        return {
          dayOfWeek: dow,
          startTime: rule?.startTime ?? '09:00',
          endTime: rule?.endTime ?? '18:00',
          isWorking: !existing?.isWorking,
        }
      }
      return {
        dayOfWeek: dow,
        startTime: rule?.startTime ?? '09:00',
        endTime: rule?.endTime ?? '18:00',
        isWorking: rule?.isWorking ?? false,
      }
    })
    updateRulesMutation.mutate({ rules: updatedRules })
  }

  const handleTimeChange = (
    dayOfWeek: number,
    field: 'startTime' | 'endTime',
    value: string,
  ) => {
    const updatedRules = DAYS.map((_, idx) => {
      const dow = idx + 1
      const rule = getRuleForDay(dow)
      const base = {
        dayOfWeek: dow,
        startTime: rule?.startTime ?? '09:00',
        endTime: rule?.endTime ?? '18:00',
        isWorking: rule?.isWorking ?? false,
      }
      if (dow === dayOfWeek) {
        return { ...base, [field]: value }
      }
      return base
    })
    updateRulesMutation.mutate({ rules: updatedRules })
  }

  if (loadingRules || loadingOverrides) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DAYS.map((dayName, idx) => {
              const dayOfWeek = idx + 1
              const rule = getRuleForDay(dayOfWeek)
              const isWorking = rule?.isWorking ?? false

              return (
                <div
                  key={dayName}
                  className="flex items-center gap-4 rounded-md border p-3"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleDay(dayOfWeek)}
                    className={`w-24 shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isWorking
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {dayName.slice(0, 3)}
                  </button>

                  {isWorking ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        className="w-32"
                        value={rule?.startTime ?? '09:00'}
                        onChange={(e) =>
                          handleTimeChange(dayOfWeek, 'startTime', e.target.value)
                        }
                      />
                      <span className="text-sm text-muted-foreground">to</span>
                      <Input
                        type="time"
                        className="w-32"
                        value={rule?.endTime ?? '18:00'}
                        onChange={(e) =>
                          handleTimeChange(dayOfWeek, 'endTime', e.target.value)
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Day off
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          {updateRulesMutation.isPending && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date Overrides */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Date Overrides</CardTitle>
          <Button
            size="sm"
            onClick={() => setOverrideDialogOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Override
          </Button>
        </CardHeader>
        <CardContent>
          {overrides.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No date overrides. Add exceptions for holidays or special hours.
            </p>
          ) : (
            <div className="space-y-2">
              {overrides.map((override) => (
                <div
                  key={override.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {new Date(override.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <Badge
                        variant={
                          override.isWorking ? 'default' : 'destructive'
                        }
                      >
                        {override.isWorking ? 'Working' : 'Day Off'}
                      </Badge>
                    </div>
                    {override.isWorking && override.startTime && override.endTime && (
                      <p className="text-xs text-muted-foreground">
                        {override.startTime} - {override.endTime}
                      </p>
                    )}
                    {override.reason && (
                      <p className="text-xs text-muted-foreground">
                        {override.reason}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={deleteOverrideMutation.isPending}
                    onClick={() => deleteOverrideMutation.mutate(override.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Override Dialog */}
      <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Date Override</DialogTitle>
          </DialogHeader>
          <OverrideForm
            isPending={createOverrideMutation.isPending}
            onSubmit={(data) => createOverrideMutation.mutate(data)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OverrideForm({
  isPending,
  onSubmit,
}: {
  isPending: boolean
  onSubmit: (data: availabilityApi.CreateOverrideRequest) => void
}) {
  const [date, setDate] = useState('')
  const [isWorking, setIsWorking] = useState(false)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('18:00')
  const [reason, setReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      date,
      isWorking,
      startTime: isWorking ? startTime : undefined,
      endTime: isWorking ? endTime : undefined,
      reason: reason || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="override-date">Date</Label>
        <Input
          id="override-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={isWorking ? 'working' : 'off'}
          onValueChange={(val) => setIsWorking(val === 'working')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="off">Day Off</SelectItem>
            <SelectItem value="working">Custom Hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isWorking && (
        <div className="flex items-center gap-2">
          <div className="space-y-2 flex-1">
            <Label>Start</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="space-y-2 flex-1">
            <Label>End</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="override-reason">Reason (optional)</Label>
        <Input
          id="override-reason"
          placeholder="e.g. National holiday"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending || !date}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add Override
      </Button>
    </form>
  )
}
