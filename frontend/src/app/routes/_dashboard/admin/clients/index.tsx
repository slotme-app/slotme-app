import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { Search, Plus, Loader2, Phone, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuthStore } from '@/stores/authStore'
import * as clientsApi from '@/lib/api/clients'

export const Route = createFileRoute('/_dashboard/admin/clients/')({
  component: ClientsPage,
})

const addClientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  email: z.email('Please enter a valid email').optional().or(z.literal('')),
})

type AddClientData = z.infer<typeof addClientSchema>

function ClientsPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['clients', salonId, search],
    queryFn: () =>
      clientsApi.getClients(salonId, { search: search || undefined }),
    enabled: !!salonId,
  })

  const clients = data?.content ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-sm text-muted-foreground">
            Manage your client database
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Client</DialogTitle>
            </DialogHeader>
            <AddClientForm
              salonId={salonId}
              onSuccess={() => {
                setDialogOpen(false)
                void queryClient.invalidateQueries({
                  queryKey: ['clients', salonId],
                })
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            {search
              ? 'No clients found matching your search.'
              : 'No clients yet. Add your first client.'}
          </p>
          {!search && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Client
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="space-y-3 sm:hidden">
            {clients.map((client) => (
              <Link
                key={client.id}
                to="/admin/clients/$clientId"
                params={{ clientId: client.id }}
                className="block rounded-md border p-4 space-y-2 active:bg-accent"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{client.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {client.totalVisits} visits
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
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
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden sm:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total Visits</TableHead>
                  <TableHead>Last Visit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Link
                        to="/admin/clients/$clientId"
                        params={{ clientId: client.id }}
                        className="font-medium hover:underline"
                      >
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {client.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{client.totalVisits}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.lastVisitDate
                        ? new Date(client.lastVisitDate).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}

function AddClientForm({
  salonId,
  onSuccess,
}: {
  salonId: string
  onSuccess: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddClientData>({
    resolver: zodResolver(addClientSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: AddClientData) =>
      clientsApi.createClient(salonId, data),
    onSuccess: () => {
      toast.success('Client added')
      onSuccess()
    },
    onError: () => toast.error('Failed to add client'),
  })

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="client-name">Name</Label>
        <Input
          id="client-name"
          placeholder="Client name"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-phone">Phone</Label>
        <Input
          id="client-phone"
          type="tel"
          placeholder="+1 234 567 8900"
          {...register('phone')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-email">Email (optional)</Label>
        <Input
          id="client-email"
          type="email"
          placeholder="client@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Add Client
      </Button>
    </form>
  )
}
