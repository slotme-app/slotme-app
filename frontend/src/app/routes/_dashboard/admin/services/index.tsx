import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
  Loader2,
  FolderPlus,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/stores/authStore'
import * as servicesApi from '@/lib/api/services'

export const Route = createFileRoute('/_dashboard/admin/services/')({
  component: ServicesPage,
})

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120, 150, 180]

const serviceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  duration: z.coerce.number().min(15, 'Minimum 15 minutes'),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  categoryId: z.string().min(1, 'Category is required'),
  bufferTime: z.coerce.number().min(0).optional(),
})

type ServiceFormData = z.infer<typeof serviceSchema>

function ServicesPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const queryClient = useQueryClient()
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(),
  )

  const { data, isLoading } = useQuery({
    queryKey: ['services', salonId],
    queryFn: () => servicesApi.getServices(salonId),
    enabled: !!salonId,
  })

  const { data: categories } = useQuery({
    queryKey: ['service-categories', salonId],
    queryFn: () => servicesApi.getCategories(salonId),
    enabled: !!salonId,
  })

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  const grouped = data?.categories ?? []
  const uncategorized = data?.uncategorized ?? []
  const hasServices =
    grouped.some((g) => g.services.length > 0) || uncategorized.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-muted-foreground">
            Manage your service catalog
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={categoryDialogOpen}
            onOpenChange={setCategoryDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="mr-1 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>
              <AddCategoryForm
                salonId={salonId}
                onSuccess={() => {
                  setCategoryDialogOpen(false)
                  void queryClient.invalidateQueries({
                    queryKey: ['service-categories', salonId],
                  })
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            open={serviceDialogOpen}
            onOpenChange={setServiceDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Service</DialogTitle>
              </DialogHeader>
              <AddServiceForm
                salonId={salonId}
                categories={categories ?? []}
                onSuccess={() => {
                  setServiceDialogOpen(false)
                  void queryClient.invalidateQueries({
                    queryKey: ['services', salonId],
                  })
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!hasServices ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No services yet. Create your first service to get started.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setServiceDialogOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Service
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ category, services }) => (
            <div key={category.id} className="rounded-md border">
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  {collapsedCategories.has(category.id) ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="font-semibold">{category.name}</span>
                  <Badge variant="secondary">{services.length}</Badge>
                </div>
              </button>

              {!collapsedCategories.has(category.id) && (
                <div className="border-t">
                  {services.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      No services in this category
                    </p>
                  ) : (
                    <div className="divide-y">
                      {services.map((service) => (
                        <ServiceRow key={service.id} service={service} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {uncategorized.length > 0 && (
            <div className="rounded-md border">
              <div className="p-4">
                <span className="font-semibold text-muted-foreground">
                  Uncategorized
                </span>
              </div>
              <div className="divide-y border-t">
                {uncategorized.map((service) => (
                  <ServiceRow key={service.id} service={service} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ServiceRow({
  service,
}: {
  service: servicesApi.ServiceWithCategory
}) {
  return (
    <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{service.name}</span>
          {!service.active && (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
        {service.description && (
          <p className="mt-1 text-sm text-muted-foreground truncate">
            {service.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {service.duration}min
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5" />
          {service.price.toFixed(2)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {service.masterCount}
        </span>
      </div>
    </div>
  )
}

function AddServiceForm({
  salonId,
  categories,
  onSuccess,
}: {
  salonId: string
  categories: { id: string; name: string }[]
  onSuccess: () => void
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { duration: 60, price: 0, bufferTime: 0, categoryId: '' },
  })

  const mutation = useMutation({
    mutationFn: (data: ServiceFormData) =>
      servicesApi.createService(salonId, data),
    onSuccess: () => {
      toast.success('Service created')
      onSuccess()
    },
    onError: () => toast.error('Failed to create service'),
  })

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="service-name">Name</Label>
        <Input
          id="service-name"
          placeholder="e.g. Haircut"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-desc">Description (optional)</Label>
        <Textarea
          id="service-desc"
          rows={2}
          placeholder="Brief description..."
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Duration</Label>
          <Select
            defaultValue="60"
            onValueChange={(v) => setValue('duration', parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d} min
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-price">Price</Label>
          <Input
            id="service-price"
            type="number"
            step="0.01"
            {...register('price')}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No categories yet. Please create a category first using the &quot;Add Category&quot; button.
          </p>
        ) : (
          <Select onValueChange={(v) => setValue('categoryId', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.categoryId && (
          <p className="text-sm text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-buffer">Buffer Time (min, optional)</Label>
        <Input
          id="service-buffer"
          type="number"
          {...register('bufferTime')}
        />
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Create Service
      </Button>
    </form>
  )
}

function AddCategoryForm({
  salonId,
  onSuccess,
}: {
  salonId: string
  onSuccess: () => void
}) {
  const [name, setName] = useState('')

  const mutation = useMutation({
    mutationFn: () => servicesApi.createCategory(salonId, { name }),
    onSuccess: () => {
      toast.success('Category created')
      onSuccess()
    },
    onError: () => toast.error('Failed to create category'),
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cat-name">Category Name</Label>
        <Input
          id="cat-name"
          placeholder="e.g. Hair Services"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button
        className="w-full"
        disabled={!name.trim() || mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Create Category
      </Button>
    </div>
  )
}
