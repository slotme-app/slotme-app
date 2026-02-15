import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as authApi from '@/lib/api/auth'
import {
  passwordResetRequestSchema,
  type PasswordResetRequestData,
} from '@/lib/utils/validation'

export const Route = createFileRoute('/_auth/password-reset')({
  component: PasswordResetPage,
})

function PasswordResetPage() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestData>({
    resolver: zodResolver(passwordResetRequestSchema),
  })

  const onSubmit = async (data: PasswordResetRequestData) => {
    setServerError(null)
    try {
      await authApi.requestPasswordReset({ email: data.email })
      setSubmitted(true)
    } catch {
      setServerError('Failed to send reset email. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border bg-card p-8 shadow-sm text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          If an account exists with that email, we&apos;ve sent password reset
          instructions.
        </p>
        <Link to="/login">
          <Button variant="outline" className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email to receive reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Reset Instructions
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-1 inline h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
