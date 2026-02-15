import { test, expect } from '@playwright/test'
import { DashboardPage } from './pages/DashboardPage'

test.describe('Dashboard Layout', () => {
  test('should display sidebar navigation on desktop', async ({ page }) => {
    await page.goto('/admin')
    const dashboard = new DashboardPage(page)

    await expect(dashboard.sidebar).toBeVisible()
    await expect(dashboard.header).toBeVisible()
  })

  test('should display admin navigation items', async ({ page }) => {
    await page.goto('/admin')

    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Calendar' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Masters' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Services' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Clients' })).toBeVisible()
  })

  test('should navigate between admin pages', async ({ page }) => {
    await page.goto('/admin')

    await page.getByRole('link', { name: 'Masters' }).click()
    await expect(page).toHaveURL(/\/admin\/masters/)
    await expect(
      page.getByRole('heading', { name: 'Masters' }),
    ).toBeVisible()

    await page.getByRole('link', { name: 'Services' }).click()
    await expect(page).toHaveURL(/\/admin\/services/)
    await expect(
      page.getByRole('heading', { name: 'Services' }),
    ).toBeVisible()

    await page.getByRole('link', { name: 'Clients' }).click()
    await expect(page).toHaveURL(/\/admin\/clients/)
    await expect(
      page.getByRole('heading', { name: 'Clients' }),
    ).toBeVisible()
  })

  test('should show notification bell with dropdown', async ({ page }) => {
    await page.goto('/admin')
    const dashboard = new DashboardPage(page)

    await dashboard.notificationBell.click()
    await expect(page.getByText('Notifications')).toBeVisible()
  })

  test('should show profile menu with logout option', async ({ page }) => {
    await page.goto('/admin')
    const dashboard = new DashboardPage(page)

    await dashboard.profileMenu.click()
    await expect(
      page.getByRole('menuitem', { name: 'Sign out' }),
    ).toBeVisible()
  })
})
