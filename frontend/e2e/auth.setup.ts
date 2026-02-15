import { test as setup, expect } from '@playwright/test'

const ADMIN_FILE = 'e2e/.auth/admin.json'

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Email').fill('admin@slotme-demo.com')
  await page.getByLabel('Password').fill('demo-password-123')
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Wait for navigation to dashboard
  await expect(page).toHaveURL(/\/admin/)

  // Save auth state
  await page.context().storageState({ path: ADMIN_FILE })
})
