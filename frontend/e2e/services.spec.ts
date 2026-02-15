import { test, expect } from '@playwright/test'
import { ServicesPage } from './pages/ServicesPage'

test.describe('Services Management', () => {
  test('should display services page', async ({ page }) => {
    const servicesPage = new ServicesPage(page)
    await servicesPage.goto()

    await expect(servicesPage.heading).toBeVisible()
    await expect(servicesPage.addServiceButton).toBeVisible()
    await expect(servicesPage.addCategoryButton).toBeVisible()
  })

  test('should show empty state or service categories', async ({ page }) => {
    const servicesPage = new ServicesPage(page)
    await servicesPage.goto()

    // Either shows service list or empty state
    const emptyState = page.getByText(/no services yet/i)
    const serviceList = page.locator('[class*="rounded-md border"]').first()

    await expect(emptyState.or(serviceList)).toBeVisible()
  })

  test('should open add service dialog', async ({ page }) => {
    const servicesPage = new ServicesPage(page)
    await servicesPage.goto()
    await servicesPage.openAddServiceDialog()

    await expect(
      page.getByRole('heading', { name: 'Add Service' }),
    ).toBeVisible()
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByText('Duration')).toBeVisible()
    await expect(page.getByLabel('Price')).toBeVisible()
  })

  test('should open add category dialog', async ({ page }) => {
    const servicesPage = new ServicesPage(page)
    await servicesPage.goto()
    await servicesPage.addCategoryButton.click()

    await expect(
      page.getByRole('heading', { name: 'Add Category' }),
    ).toBeVisible()
    await expect(page.getByLabel('Category Name')).toBeVisible()
  })
})
