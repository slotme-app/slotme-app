import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/admin/analytics/')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="mt-2 text-muted-foreground">
        Analytics and reports will be implemented here.
      </p>
    </div>
  )
}
