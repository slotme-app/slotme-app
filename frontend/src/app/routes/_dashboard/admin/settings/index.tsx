import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/authStore'
import * as salonsApi from '@/lib/api/salons'

export const Route = createFileRoute('/_dashboard/admin/settings/')({
  component: SettingsPage,
})

// Validation schemas
const generalSettingsSchema = z.object({
  name: z.string().min(2, 'Salon name must be at least 2 characters'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.email('Please enter a valid email').optional().or(z.literal('')),
  timezone: z.string().min(1, 'Timezone is required'),
})

type GeneralSettingsData = z.infer<typeof generalSettingsSchema>

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

function SettingsPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const queryClient = useQueryClient()

  const { data: salon, isLoading } = useQuery({
    queryKey: ['salon', salonId],
    queryFn: () => salonsApi.getSalon(salonId),
    enabled: !!salonId,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your salon settings
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
          <TabsTrigger value="booking">Booking Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <GeneralSettingsTab
            salonId={salonId}
            salon={salon}
            onSaved={() =>
              void queryClient.invalidateQueries({
                queryKey: ['salon', salonId],
              })
            }
          />
        </TabsContent>

        <TabsContent value="hours" className="mt-4">
          <WorkingHoursTab
            salonId={salonId}
            workingHours={salon?.workingHours}
            onSaved={() =>
              void queryClient.invalidateQueries({
                queryKey: ['salon', salonId],
              })
            }
          />
        </TabsContent>

        <TabsContent value="booking" className="mt-4">
          <BookingRulesTab
            salonId={salonId}
            bookingRules={salon?.bookingRules}
            onSaved={() =>
              void queryClient.invalidateQueries({
                queryKey: ['salon', salonId],
              })
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// General Settings Tab
function GeneralSettingsTab({
  salonId,
  salon,
  onSaved,
}: {
  salonId: string
  salon?: salonsApi.SalonSettings
  onSaved: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneralSettingsData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      name: salon?.name ?? '',
      address: salon?.address ?? '',
      phone: salon?.phone ?? '',
      email: salon?.email ?? '',
      timezone: salon?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: GeneralSettingsData) =>
      salonsApi.updateSalon(salonId, data),
    onSuccess: () => {
      toast.success('Settings saved successfully')
      onSaved()
    },
    onError: () => {
      toast.error('Failed to save settings')
    },
  })

  const onSubmit = (data: GeneralSettingsData) => {
    mutation.mutate(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="name">Salon Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...register('phone')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" {...register('timezone')} />
            {errors.timezone && (
              <p className="text-sm text-destructive">
                {errors.timezone.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Working Hours Tab
function WorkingHoursTab({
  salonId,
  workingHours,
  onSaved,
}: {
  salonId: string
  workingHours?: salonsApi.WorkingHoursDay[]
  onSaved: () => void
}) {
  const defaultHours: salonsApi.WorkingHoursDay[] = DAYS_OF_WEEK.map(
    (name, i) => ({
      dayOfWeek: i + 1,
      dayName: name,
      enabled: i < 5,
      startTime: '09:00',
      endTime: '18:00',
    }),
  )

  const [hours, setHours] = useState<salonsApi.WorkingHoursDay[]>(
    workingHours ?? defaultHours,
  )

  const mutation = useMutation({
    mutationFn: () =>
      salonsApi.updateWorkingHours(salonId, { workingHours: hours }),
    onSuccess: () => {
      toast.success('Working hours saved')
      onSaved()
    },
    onError: () => {
      toast.error('Failed to save working hours')
    },
  })

  const toggleDay = (index: number) => {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, enabled: !h.enabled } : h)),
    )
  }

  const updateTime = (
    index: number,
    field: 'startTime' | 'endTime',
    value: string,
  ) => {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Working Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-w-lg">
          {hours.map((day, index) => (
            <div
              key={day.dayOfWeek}
              className="flex items-center gap-4 rounded-md border p-3"
            >
              <label className="flex w-28 items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={() => toggleDay(index)}
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm font-medium">{day.dayName}</span>
              </label>

              {day.enabled ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={day.startTime}
                    onChange={(e) =>
                      updateTime(index, 'startTime', e.target.value)
                    }
                    className="w-28"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={day.endTime}
                    onChange={(e) =>
                      updateTime(index, 'endTime', e.target.value)
                    }
                    className="w-28"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Closed</span>
              )}
            </div>
          ))}

          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="mt-4"
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Working Hours
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Booking Rules Tab
function BookingRulesTab({
  salonId,
  bookingRules,
  onSaved,
}: {
  salonId: string
  bookingRules?: salonsApi.BookingRules
  onSaved: () => void
}) {
  const bookingRulesSchema = z.object({
    minAdvanceMinutes: z
      .number()
      .min(0, 'Must be 0 or more')
      .max(10080, 'Max 7 days'),
    maxFutureDays: z
      .number()
      .min(1, 'Must be at least 1')
      .max(365, 'Max 365 days'),
    bufferMinutes: z
      .number()
      .min(0, 'Must be 0 or more')
      .max(120, 'Max 120 minutes'),
  })

  type BookingRulesData = z.infer<typeof bookingRulesSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingRulesData>({
    resolver: zodResolver(bookingRulesSchema),
    defaultValues: {
      minAdvanceMinutes: bookingRules?.minAdvanceMinutes ?? 60,
      maxFutureDays: bookingRules?.maxFutureDays ?? 30,
      bufferMinutes: bookingRules?.bufferMinutes ?? 10,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: BookingRulesData) =>
      salonsApi.updateBookingRules(salonId, data),
    onSuccess: () => {
      toast.success('Booking rules saved')
      onSaved()
    },
    onError: () => {
      toast.error('Failed to save booking rules')
    },
  })

  const onSubmit = (data: BookingRulesData) => {
    mutation.mutate(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="minAdvanceMinutes">
              Minimum Advance Booking (minutes)
            </Label>
            <Input
              id="minAdvanceMinutes"
              type="number"
              {...register('minAdvanceMinutes', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              How far in advance clients must book (e.g., 60 = 1 hour before)
            </p>
            {errors.minAdvanceMinutes && (
              <p className="text-sm text-destructive">
                {errors.minAdvanceMinutes.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxFutureDays">
              Maximum Future Booking (days)
            </Label>
            <Input
              id="maxFutureDays"
              type="number"
              {...register('maxFutureDays', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              How far in the future clients can book
            </p>
            {errors.maxFutureDays && (
              <p className="text-sm text-destructive">
                {errors.maxFutureDays.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bufferMinutes">
              Buffer Time Between Appointments (minutes)
            </Label>
            <Input
              id="bufferMinutes"
              type="number"
              {...register('bufferMinutes', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Automatic gap between consecutive appointments
            </p>
            {errors.bufferMinutes && (
              <p className="text-sm text-destructive">
                {errors.bufferMinutes.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Booking Rules
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
