import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/authStore'
import * as authApi from '@/lib/api/auth'
import {
  registerStep1Schema,
  registerStep2Schema,
  type RegisterStep1Data,
  type RegisterStep2Data,
} from '@/lib/utils/validation'

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
})

const STEPS = ['Account', 'Salon', 'Confirm'] as const

function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [step, setStep] = useState(0)
  const [step1Data, setStep1Data] = useState<RegisterStep1Data | null>(null)
  const [step2Data, setStep2Data] = useState<RegisterStep2Data | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const step1Form = useForm<RegisterStep1Data>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: step1Data ?? undefined,
  })

  const step2Form = useForm<RegisterStep2Data>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: step2Data ?? { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  })

  const handleStep1 = (data: RegisterStep1Data) => {
    setStep1Data(data)
    setStep(1)
  }

  const handleStep2 = (data: RegisterStep2Data) => {
    setStep2Data(data)
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!step1Data || !step2Data) return
    setIsSubmitting(true)
    setServerError(null)
    try {
      const response = await authApi.register({
        name: step1Data.name,
        email: step1Data.email,
        password: step1Data.password,
        phone: step1Data.phone,
        salonName: step2Data.salonName,
        salonAddress: step2Data.salonAddress,
        salonPhone: step2Data.salonPhone,
        timezone: step2Data.timezone,
      })
      setAuth(response.user, response.accessToken, response.refreshToken)
      await navigate({ to: '/admin' })
    } catch {
      setServerError('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Register Your Salon</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set up your salon on SlotMe
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i < step
                  ? 'bg-primary text-primary-foreground'
                  : i === step
                    ? 'border-2 border-primary text-primary'
                    : 'border-2 border-muted text-muted-foreground'
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-xs ${
                i === step ? 'font-medium' : 'text-muted-foreground'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="mx-1 h-px w-8 bg-border" />
            )}
          </div>
        ))}
      </div>

      {serverError && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Step 1: Account details */}
      {step === 0 && (
        <form onSubmit={step1Form.handleSubmit(handleStep1)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your full name"
              autoComplete="name"
              {...step1Form.register('name')}
            />
            {step1Form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {step1Form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...step1Form.register('email')}
            />
            {step1Form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {step1Form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              autoComplete="tel"
              {...step1Form.register('phone')}
            />
            {step1Form.formState.errors.phone && (
              <p className="text-sm text-destructive">
                {step1Form.formState.errors.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              {...step1Form.register('password')}
            />
            {step1Form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {step1Form.formState.errors.password.message}
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
              {...step1Form.register('confirmPassword')}
            />
            {step1Form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {step1Form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      )}

      {/* Step 2: Salon details */}
      {step === 1 && (
        <form onSubmit={step2Form.handleSubmit(handleStep2)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salonName">Salon Name</Label>
            <Input
              id="salonName"
              placeholder="Your salon name"
              {...step2Form.register('salonName')}
            />
            {step2Form.formState.errors.salonName && (
              <p className="text-sm text-destructive">
                {step2Form.formState.errors.salonName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="salonAddress">Address (optional)</Label>
            <Input
              id="salonAddress"
              placeholder="Salon address"
              {...step2Form.register('salonAddress')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salonPhone">Salon Phone (optional)</Label>
            <Input
              id="salonPhone"
              type="tel"
              placeholder="Salon phone number"
              {...step2Form.register('salonPhone')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              placeholder="e.g. America/New_York"
              {...step2Form.register('timezone')}
            />
            {step2Form.formState.errors.timezone && (
              <p className="text-sm text-destructive">
                {step2Form.formState.errors.timezone.message}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(0)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="submit" className="flex-1">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: Confirmation */}
      {step === 2 && step1Data && step2Data && (
        <div className="space-y-4">
          <div className="rounded-md border p-4 text-sm">
            <h3 className="mb-2 font-semibold">Account</h3>
            <p>Name: {step1Data.name}</p>
            <p>Email: {step1Data.email}</p>
            <p>Phone: {step1Data.phone}</p>
          </div>
          <div className="rounded-md border p-4 text-sm">
            <h3 className="mb-2 font-semibold">Salon</h3>
            <p>Name: {step2Data.salonName}</p>
            {step2Data.salonAddress && <p>Address: {step2Data.salonAddress}</p>}
            {step2Data.salonPhone && <p>Phone: {step2Data.salonPhone}</p>}
            <p>Timezone: {step2Data.timezone}</p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              className="flex-1"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
