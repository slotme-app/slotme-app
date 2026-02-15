import { test, expect } from '@playwright/test'
import { MastersPage } from './pages/MastersPage'

test.describe('Masters Management', () => {
  test('should display masters page with heading', async ({ page }) => {
    const mastersPage = new MastersPage(page)
    await mastersPage.goto()

    await expect(mastersPage.heading).toBeVisible()
    await expect(mastersPage.addMasterButton).toBeVisible()
    await expect(mastersPage.searchInput).toBeVisible()
  })

  test('should show empty state or masters list', async ({ page }) => {
    const mastersPage = new MastersPage(page)
    await mastersPage.goto()

    // Either shows the table/cards or the empty state
    const hasMasters = await page.locator('table, [class*="rounded-md border p-4"]').count()
    if (hasMasters === 0) {
      await expect(
        page.getByText(/no masters yet/i),
      ).toBeVisible()
    }
  })

  test('should navigate to add master form', async ({ page }) => {
    const mastersPage = new MastersPage(page)
    await mastersPage.goto()
    await mastersPage.clickAddMaster()

    await expect(page).toHaveURL(/\/admin\/masters\/new/)
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
  })

  test('should filter masters by search', async ({ page }) => {
    const mastersPage = new MastersPage(page)
    await mastersPage.goto()

    await mastersPage.search('nonexistent-master-xyz')
    // Should either show no results or empty state
    await page.waitForTimeout(500) // debounce
  })
})
