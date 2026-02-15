import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import {
  ArrowLeft,
  Loader2,
  Save,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Star,
  Trash2,
  Plus,
  Download,
  AlertTriangle,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuthStore } from '@/stores/authStore'
import * as clientsApi from '@/lib/api/clients'
import type { AppointmentStatus } from '@/types/models'

export const Route = createFileRoute('/_dashboard/admin/clients/$clientId')({
  component: ClientDetailPage,
})

const editClientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  email: z.email('Please enter a valid email').optional().or(z.literal('')),
})

type EditClientData = z.infer<typeof editClientSchema>

const statusBadgeVariant: Record<
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

function ClientDetailPage() {
  const { clientId } = Route.useParams()
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const queryClient = useQueryClient()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', salonId, clientId],
    queryFn: () => clientsApi.getClient(salonId, clientId),
    enabled: !!salonId,
  })

  const { data: appointments = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['client-appointments', salonId, clientId],
    queryFn: () => clientsApi.getClientAppointments(salonId, clientId),
    select: (data) => (Array.isArray(data) ? data : []),
    enabled: !!salonId,
  })

  const { data: notes = [], isLoading: loadingNotes } = useQuery({
    queryKey: ['client-notes', salonId, clientId],
    queryFn: () => clientsApi.getClientNotes(salonId, clientId),
    enabled: !!salonId,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditClientData>({
    resolver: zodResolver(editClientSchema),
    values: client
      ? { name: client.name, phone: client.phone ?? '', email: client.email ?? '' }
      : undefined,
  })

  const updateMutation = useMutation({
    mutationFn: (data: EditClientData) =>
      clientsApi.updateClient(salonId, clientId, data),
    onSuccess: () => {
      toast.success('Client updated')
      void queryClient.invalidateQueries({
        queryKey: ['client', salonId, clientId],
      })
    },
    onError: () => toast.error('Failed to update client'),
  })

  const exportMutation = useMutation({
    mutationFn: () => clientsApi.exportClientData(salonId, clientId),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `client-${clientId}-data.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Data exported')
    },
    onError: () => toast.error('Failed to export data'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => clientsApi.deleteClientData(salonId, clientId),
    onSuccess: () => {
      toast.success('Client data deleted')
      setDeleteConfirmOpen(false)
    },
    onError: () => toast.error('Failed to delete client data'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <Link to="/admin/clients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Clients
          </Button>
        </Link>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">Client not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {client.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {client.phone}
              </span>
            )}
            {client.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {client.email}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {client.totalVisits} visits
            </span>
          </div>
          {client.tags && client.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {client.tags.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  salonId={salonId}
                  clientId={clientId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{client.totalVisits}</p>
                <p className="text-xs text-muted-foreground">Total Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  ${(client.totalSpent ?? 0).toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm font-bold truncate">
                  {client.favoriteMaster ?? 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Favorite Master
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-bold">
                  {client.lastVisitDate
                    ? new Date(client.lastVisitDate).toLocaleDateString()
                    : 'Never'}
                </p>
                <p className="text-xs text-muted-foreground">Last Visit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">
            Appointments ({appointments.length})
          </TabsTrigger>
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
                className="space-y-4 max-w-lg"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" {...register('phone')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {client.topServices && client.topServices.length > 0 && (
                  <div className="space-y-2">
                    <Label>Top Services</Label>
                    <div className="flex flex-wrap gap-1">
                      {client.topServices.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No appointment history yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {apt.serviceName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(apt.startTime).toLocaleDateString()} at{' '}
                          {new Date(apt.startTime).toLocaleTimeString()} with{' '}
                          {apt.masterName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusBadgeVariant[apt.status]}>
                          {apt.status}
                        </Badge>
                        <span className="text-sm font-medium">
                          ${apt.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <NotesSection
                salonId={salonId}
                clientId={clientId}
                notes={notes}
                isLoading={loadingNotes}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab (GDPR) */}
        <TabsContent value="settings" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <TagManager
                salonId={salonId}
                clientId={clientId}
                tags={client.tags ?? []}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy (GDPR)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">Export Client Data</p>
                  <p className="text-xs text-muted-foreground">
                    Download all data associated with this client as JSON
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto min-h-[44px]"
                  disabled={exportMutation.isPending}
                  onClick={() => exportMutation.mutate()}
                >
                  {exportMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export
                </Button>
              </div>
              <div className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Delete Client Data
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete all client data. This cannot be undone.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full sm:w-auto min-h-[44px]"
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Client Data
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              This will permanently delete all data for{' '}
              <strong>{client.name}</strong>, including:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Client profile and contact information</li>
              <li>All appointment history</li>
              <li>All notes and tags</li>
              <li>Conversation history</li>
            </ul>
            <p className="text-sm font-medium text-destructive">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete All Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function NotesSection({
  salonId,
  clientId,
  notes,
  isLoading,
}: {
  salonId: string
  clientId: string
  notes: { id: string; content: string; authorName: string; createdAt: string }[]
  isLoading: boolean
}) {
  const queryClient = useQueryClient()
  const [newNote, setNewNote] = useState('')

  const addMutation = useMutation({
    mutationFn: (content: string) =>
      clientsApi.addClientNote(salonId, clientId, content),
    onSuccess: () => {
      setNewNote('')
      toast.success('Note added')
      void queryClient.invalidateQueries({
        queryKey: ['client-notes', salonId, clientId],
      })
    },
    onError: () => toast.error('Failed to add note'),
  })

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) =>
      clientsApi.deleteClientNote(salonId, clientId, noteId),
    onSuccess: () => {
      toast.success('Note deleted')
      void queryClient.invalidateQueries({
        queryKey: ['client-notes', salonId, clientId],
      })
    },
    onError: () => toast.error('Failed to delete note'),
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={2}
        />
        <Button
          size="sm"
          disabled={!newNote.trim() || addMutation.isPending}
          onClick={() => addMutation.mutate(newNote.trim())}
        >
          {addMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Add Note
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-md border p-3 space-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="text-xs text-muted-foreground">
                  {note.authorName} &middot;{' '}
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(note.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TagBadge({
  tag,
  salonId,
  clientId,
}: {
  tag: string
  salonId: string
  clientId: string
}) {
  const queryClient = useQueryClient()

  const removeMutation = useMutation({
    mutationFn: () => clientsApi.removeClientTag(salonId, clientId, tag),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['client', salonId, clientId],
      })
    },
  })

  return (
    <Badge variant="secondary" className="gap-1">
      {tag}
      <button
        type="button"
        className="hover:text-destructive"
        onClick={() => removeMutation.mutate()}
        disabled={removeMutation.isPending}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}

function TagManager({
  salonId,
  clientId,
  tags,
}: {
  salonId: string
  clientId: string
  tags: string[]
}) {
  const queryClient = useQueryClient()
  const [newTag, setNewTag] = useState('')

  const addMutation = useMutation({
    mutationFn: (tag: string) =>
      clientsApi.addClientTag(salonId, clientId, tag),
    onSuccess: () => {
      setNewTag('')
      void queryClient.invalidateQueries({
        queryKey: ['client', salonId, clientId],
      })
    },
    onError: () => toast.error('Failed to add tag'),
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      addMutation.mutate(newTag.trim())
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tags yet.</p>
        ) : (
          tags.map((tag) => (
            <TagBadge
              key={tag}
              tag={tag}
              salonId={salonId}
              clientId={clientId}
            />
          ))
        )}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="Add a tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="max-w-xs"
        />
        <Button
          type="submit"
          size="sm"
          variant="outline"
          disabled={!newTag.trim() || addMutation.isPending}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </form>
    </div>
  )
}
