import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import * as mastersApi from '@/lib/api/masters'
import { AvailabilityEditor } from '@/components/availability/AvailabilityEditor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_dashboard/admin/availability/')({
  component: AdminAvailabilityPage,
})

function AdminAvailabilityPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const [selectedMasterId, setSelectedMasterId] = useState<string>('')

  const { data: mastersData, isLoading: loadingMasters } = useQuery({
    queryKey: ['masters', salonId],
    queryFn: () => mastersApi.getMasters(salonId, { size: 100 }),
    enabled: !!salonId,
  })

  const masters = mastersData?.content ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Availability Management</h1>
        <p className="text-sm text-muted-foreground">
          Configure working hours and schedule overrides for each master
        </p>
      </div>

      <div className="max-w-xs space-y-2">
        <Label>Select Master</Label>
        {loadingMasters ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={selectedMasterId}
            onValueChange={setSelectedMasterId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a master..." />
            </SelectTrigger>
            <SelectContent>
              {masters.map((master) => (
                <SelectItem key={master.id} value={master.id}>
                  {master.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedMasterId ? (
        <AvailabilityEditor
          key={selectedMasterId}
          salonId={salonId}
          masterId={selectedMasterId}
        />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Select a master to manage their availability.
          </p>
        </div>
      )}
    </div>
  )
}
