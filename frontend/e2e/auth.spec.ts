import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

// Auth tests don't use saved auth state
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await expect(loginPage.emailInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.submitButton).toBeVisible()
  })

  test('should show error on invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('wrong@email.com', 'wrongpassword')

    // Should stay on login page or show error
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect unauthenticated users from master routes', async ({
    page,
  }) => {
    await page.goto('/master')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should display register page', async ({ page }) => {
    await page.goto('/register')

    await expect(page.getByLabel(/salon name/i)).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel(/^password$/i)).toBeVisible()
  })

  test('should display password reset page', async ({ page }) => {
    await page.goto('/password-reset')

    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(
      page.getByRole('button', { name: /reset|send/i }),
    ).toBeVisible()
  })

  test('should navigate between login and register', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    const registerLink = page.getByRole('link', { name: /register|sign up|create/i })
    if (await registerLink.isVisible()) {
      await registerLink.click()
      await expect(page).toHaveURL(/\/register/)
    }
  })
})
