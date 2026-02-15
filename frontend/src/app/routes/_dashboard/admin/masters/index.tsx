import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Plus, MoreHorizontal, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/authStore'
import * as mastersApi from '@/lib/api/masters'
import type { MasterStatus } from '@/types/models'

export const Route = createFileRoute('/_dashboard/admin/masters/')({
  component: MastersListPage,
})

const statusConfig: Record<
  MasterStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  ACTIVE: { label: 'Active', variant: 'default' },
  INACTIVE: { label: 'Inactive', variant: 'secondary' },
  ON_LEAVE: { label: 'On Leave', variant: 'destructive' },
}

function MastersListPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['masters', salonId],
    queryFn: () => mastersApi.getMasters(salonId),
    enabled: !!salonId,
  })

  const deactivateMutation = useMutation({
    mutationFn: (masterId: string) =>
      mastersApi.deactivateMaster(salonId, masterId),
    onSuccess: () => {
      toast.success('Master deactivated')
      void queryClient.invalidateQueries({ queryKey: ['masters', salonId] })
    },
    onError: () => toast.error('Failed to deactivate master'),
  })

  const activateMutation = useMutation({
    mutationFn: (masterId: string) =>
      mastersApi.activateMaster(salonId, masterId),
    onSuccess: () => {
      toast.success('Master activated')
      void queryClient.invalidateQueries({ queryKey: ['masters', salonId] })
    },
    onError: () => toast.error('Failed to activate master'),
  })

  const allMasters = data?.content ?? []
  const masters = search
    ? allMasters.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : allMasters

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Masters</h1>
          <p className="text-sm text-muted-foreground">
            Manage your salon team
          </p>
        </div>
        <Link to="/admin/masters/new">
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            Add Master
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search masters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : masters.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            {search
              ? 'No masters found matching your search.'
              : 'No masters yet. Add your first team member.'}
          </p>
          {!search && (
            <Link to="/admin/masters/new">
              <Button variant="outline" className="mt-4">
                <Plus className="mr-1 h-4 w-4" />
                Add Master
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="space-y-3 sm:hidden">
            {masters.map((master) => {
              const initials = master.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
              const status = statusConfig[master.status]

              return (
                <div
                  key={master.id}
                  className="rounded-md border p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to="/admin/masters/$masterId"
                      params={{ masterId: master.id }}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Avatar size="sm">
                        {master.avatarUrl && (
                          <AvatarImage
                            src={master.avatarUrl}
                            alt={master.name}
                          />
                        )}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{master.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {master.email}
                        </p>
                      </div>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            to="/admin/masters/$masterId"
                            params={{ masterId: master.id }}
                          >
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/calendar">View Schedule</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {master.status === 'ACTIVE' ? (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              deactivateMutation.mutate(master.id)
                            }
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              activateMutation.mutate(master.id)
                            }
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {master.services.length} services
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop table view */}
          <div className="hidden sm:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {masters.map((master) => {
                  const initials = master.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                  const status = statusConfig[master.status]

                  return (
                    <TableRow key={master.id}>
                      <TableCell>
                        <Link
                          to="/admin/masters/$masterId"
                          params={{ masterId: master.id }}
                          className="flex items-center gap-3 hover:underline"
                        >
                          <Avatar size="sm">
                            {master.avatarUrl && (
                              <AvatarImage
                                src={master.avatarUrl}
                                alt={master.name}
                              />
                            )}
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{master.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {master.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{master.services.length}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                to="/admin/masters/$masterId"
                                params={{ masterId: master.id }}
                              >
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/admin/calendar">View Schedule</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {master.status === 'ACTIVE' ? (
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() =>
                                  deactivateMutation.mutate(master.id)
                                }
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  activateMutation.mutate(master.id)
                                }
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
