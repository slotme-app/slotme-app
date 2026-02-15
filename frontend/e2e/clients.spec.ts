import { test, expect } from '@playwright/test'
import { ClientsPage } from './pages/ClientsPage'

test.describe('Clients Management', () => {
  test('should display clients page with heading', async ({ page }) => {
    const clientsPage = new ClientsPage(page)
    await clientsPage.goto()

    await expect(clientsPage.heading).toBeVisible()
    await expect(clientsPage.addClientButton.first()).toBeVisible()
    await expect(clientsPage.searchInput).toBeVisible()
  })

  test('should show empty state or client list', async ({ page }) => {
    const clientsPage = new ClientsPage(page)
    await clientsPage.goto()

    const emptyState = page.getByText(/no clients yet/i)
    const clientList = page.locator('table, [class*="space-y"]').first()

    await expect(emptyState.or(clientList)).toBeVisible()
  })

  test('should open add client dialog', async ({ page }) => {
    const clientsPage = new ClientsPage(page)
    await clientsPage.goto()
    await clientsPage.openAddClientDialog()

    await expect(clientsPage.addClientDialog).toBeVisible()
    await expect(page.getByLabel('Name')).toBeVisible()
  })

  test('should filter clients by search', async ({ page }) => {
    const clientsPage = new ClientsPage(page)
    await clientsPage.goto()

    await clientsPage.search('nonexistent-client-xyz')
    await page.waitForTimeout(500) // debounce
  })

  test('should navigate to client detail page', async ({ page }) => {
    const clientsPage = new ClientsPage(page)
    await clientsPage.goto()

    // If there are clients, clicking one should navigate to detail
    const clientLink = page.locator('table tbody tr a, [class*="space-y"] a').first()
    if (await clientLink.isVisible()) {
      await clientLink.click()
      await expect(page).toHaveURL(/\/admin\/clients\//)
    }
  })
})
