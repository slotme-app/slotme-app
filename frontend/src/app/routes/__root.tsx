import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">Page not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}

function RootComponent() {
  return (
    <ErrorBoundary>
      <Outlet />
      <Toaster position="top-right" richColors />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </ErrorBoundary>
  )
}
