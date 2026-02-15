import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { AvailabilityEditor } from '@/components/availability/AvailabilityEditor'

export const Route = createFileRoute('/_dashboard/master/availability')({
  component: MasterAvailabilityPage,
})

function MasterAvailabilityPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const masterId = user?.id ?? ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Availability</h1>
        <p className="text-sm text-muted-foreground">
          Set your working hours and manage schedule exceptions
        </p>
      </div>

      {salonId && masterId && (
        <AvailabilityEditor salonId={salonId} masterId={masterId} />
      )}
    </div>
  )
}
