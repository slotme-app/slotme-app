import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/authStore'
import * as authApi from '@/lib/api/auth'
import { acceptInviteSchema, type AcceptInviteData } from '@/lib/utils/validation'

export const Route = createFileRoute('/_auth/invite/$token')({
  component: InviteAcceptPage,
})

function InviteAcceptPage() {
  const { token } = Route.useParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [serverError, setServerError] = useState<string | null>(null)

  const { data: invite, isLoading, error } = useQuery({
    queryKey: ['invite', token],
    queryFn: () => authApi.getInviteDetails(token),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteData>({
    resolver: zodResolver(acceptInviteSchema),
  })

  const onSubmit = async (data: AcceptInviteData) => {
    setServerError(null)
    try {
      const response = await authApi.acceptInvite(token, {
        name: data.name,
        password: data.password,
      })
      setAuth(response.user, response.accessToken, response.refreshToken)
      await navigate({ to: '/master' })
    } catch {
      setServerError('Failed to accept invitation. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-8 shadow-sm space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (error || !invite) {
    return (
      <div className="rounded-lg border bg-card p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold">Invalid Invitation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This invitation link is invalid or has expired.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Join {invite.salonName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set up your account to manage your appointments
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div className="rounded-md bg-muted p-3 text-sm">
          <p>
            <span className="font-medium">Salon:</span> {invite.salonName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {invite.email}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            placeholder="Your full name"
            defaultValue={invite.masterName}
            autoComplete="name"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Accept Invitation
        </Button>
      </form>
    </div>
  )
}
