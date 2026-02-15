import { z } from 'zod/v4'

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerStep1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().min(7, 'Please enter a valid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>

export const registerStep2Schema = z.object({
  salonName: z.string().min(2, 'Salon name must be at least 2 characters'),
  salonAddress: z.string().optional(),
  salonPhone: z.string().optional(),
  timezone: z.string().min(1, 'Please select a timezone'),
})

export type RegisterStep2Data = z.infer<typeof registerStep2Schema>

export const passwordResetRequestSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>

export const acceptInviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type AcceptInviteData = z.infer<typeof acceptInviteSchema>
