import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { ArrowLeft, Loader2, Send, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import * as mastersApi from '@/lib/api/masters'

export const Route = createFileRoute('/_dashboard/admin/masters/new')({
  component: NewMasterPage,
})

const inviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email'),
  phone: z.string().optional(),
})

const createSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email'),
  phone: z.string().optional(),
  bio: z.string().optional(),
})

type InviteData = z.infer<typeof inviteSchema>
type CreateData = z.infer<typeof createSchema>

function NewMasterPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<'invite' | 'create'>('invite')

  const inviteForm = useForm<InviteData>({
    resolver: zodResolver(inviteSchema),
  })

  const createForm = useForm<CreateData>({
    resolver: zodResolver(createSchema),
  })

  const inviteMutation = useMutation({
    mutationFn: (data: InviteData) => mastersApi.inviteMaster(salonId, data),
    onSuccess: () => {
      toast.success('Invitation sent successfully')
      void queryClient.invalidateQueries({ queryKey: ['masters', salonId] })
      void navigate({ to: '/admin/masters' })
    },
    onError: () => toast.error('Failed to send invitation'),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateData) =>
      mastersApi.createMaster(salonId, { ...data, serviceIds: [] }),
    onSuccess: () => {
      toast.success('Master created successfully')
      void queryClient.invalidateQueries({ queryKey: ['masters', salonId] })
      void navigate({ to: '/admin/masters' })
    },
    onError: () => toast.error('Failed to create master'),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/masters">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add Master</h1>
          <p className="text-sm text-muted-foreground">
            Add a new team member to your salon
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={mode === 'invite' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('invite')}
        >
          <Send className="mr-1 h-4 w-4" />
          Send Invite
        </Button>
        <Button
          variant={mode === 'create' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('create')}
        >
          <UserPlus className="mr-1 h-4 w-4" />
          Create Account
        </Button>
      </div>

      {mode === 'invite' ? (
        <Card>
          <CardHeader>
            <CardTitle>Send Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={inviteForm.handleSubmit((data) =>
                inviteMutation.mutate(data),
              )}
              className="space-y-4 max-w-lg"
            >
              <div className="space-y-2">
                <Label htmlFor="invite-name">Name</Label>
                <Input
                  id="invite-name"
                  placeholder="Master's full name"
                  {...inviteForm.register('name')}
                />
                {inviteForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {inviteForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="master@example.com"
                  {...inviteForm.register('email')}
                />
                {inviteForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {inviteForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-phone">Phone (optional)</Label>
                <Input
                  id="invite-phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  {...inviteForm.register('phone')}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                An email invitation will be sent. The master can set up their
                own password and profile.
              </p>

              <Button
                type="submit"
                disabled={inviteMutation.isPending}
              >
                {inviteMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Send className="mr-1 h-4 w-4" />
                Send Invitation
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={createForm.handleSubmit((data) =>
                createMutation.mutate(data),
              )}
              className="space-y-4 max-w-lg"
            >
              <div className="space-y-2">
                <Label htmlFor="create-name">Name</Label>
                <Input
                  id="create-name"
                  placeholder="Master's full name"
                  {...createForm.register('name')}
                />
                {createForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  placeholder="master@example.com"
                  {...createForm.register('email')}
                />
                {createForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-phone">Phone (optional)</Label>
                <Input
                  id="create-phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  {...createForm.register('phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-bio">Bio (optional)</Label>
                <Textarea
                  id="create-bio"
                  placeholder="A brief description of the master's specialties..."
                  rows={3}
                  {...createForm.register('bio')}
                />
              </div>

              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <UserPlus className="mr-1 h-4 w-4" />
                Create Master
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
