import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/master/services')({
  component: MasterServicesPage,
})

function MasterServicesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">My Services</h1>
      <p className="mt-2 text-muted-foreground">
        Master services configuration will be implemented here.
      </p>
    </div>
  )
}
