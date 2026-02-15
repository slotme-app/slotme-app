import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/master/clients')({
  component: MasterClientsPage,
})

function MasterClientsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">My Clients</h1>
      <p className="mt-2 text-muted-foreground">
        Client history will be implemented here.
      </p>
    </div>
  )
}
