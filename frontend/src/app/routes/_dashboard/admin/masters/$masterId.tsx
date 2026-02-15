import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'
import * as mastersApi from '@/lib/api/masters'

export const Route = createFileRoute('/_dashboard/admin/masters/$masterId')({
  component: MasterDetailPage,
})

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().optional(),
})

type ProfileData = z.infer<typeof profileSchema>

function MasterDetailPage() {
  const { masterId } = Route.useParams()
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''

  const { data: master, isLoading } = useQuery({
    queryKey: ['master', salonId, masterId],
    queryFn: () => mastersApi.getMaster(salonId, masterId),
    enabled: !!salonId,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!master) {
    return (
      <div className="space-y-6">
        <Link to="/admin/masters">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Masters
          </Button>
        </Link>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">Master not found.</p>
        </div>
      </div>
    )
  }

  const initials = master.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const statusColors: Record<string, 'default' | 'secondary' | 'destructive'> = {
    ACTIVE: 'default',
    INACTIVE: 'secondary',
    ON_LEAVE: 'destructive',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/masters">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            {master.avatarUrl && (
              <AvatarImage src={master.avatarUrl} alt={master.name} />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{master.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {master.email}
              </span>
              <Badge variant={statusColors[master.status] ?? 'secondary'}>
                {master.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <ProfileTab salonId={salonId} master={master} />
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Services</CardTitle>
            </CardHeader>
            <CardContent>
              {master.services.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No services assigned yet. Assign services to this master from
                  the Services management page.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {master.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-md border p-4 text-center">
                  <p className="text-2xl font-bold">--</p>
                  <p className="text-sm text-muted-foreground">
                    Total Appointments
                  </p>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-2xl font-bold">--</p>
                  <p className="text-sm text-muted-foreground">
                    Completion Rate
                  </p>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-2xl font-bold">--</p>
                  <p className="text-sm text-muted-foreground">
                    Revenue (MTD)
                  </p>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Performance data will be available once the backend is connected.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileTab({
  salonId,
  master,
}: {
  salonId: string
  master: { id: string; name: string; phone?: string; bio?: string }
}) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: master.name,
      phone: master.phone ?? '',
      bio: master.bio ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ProfileData) =>
      mastersApi.updateMaster(salonId, master.id, data),
    onSuccess: () => {
      toast.success('Profile updated')
      void queryClient.invalidateQueries({
        queryKey: ['master', salonId, master.id],
      })
    },
    onError: () => toast.error('Failed to update profile'),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4 max-w-lg"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...register('phone')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={4} {...register('bio')} />
          </div>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
