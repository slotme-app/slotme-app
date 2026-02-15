import type { Page, Locator } from '@playwright/test'

export class ServicesPage {
  readonly page: Page
  readonly heading: Locator
  readonly addServiceButton: Locator
  readonly addCategoryButton: Locator
  readonly serviceDialog: Locator
  readonly categoryDialog: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Services' })
    this.addServiceButton = page.getByRole('button', { name: 'Add Service' })
    this.addCategoryButton = page.getByRole('button', { name: 'Add Category' })
    this.serviceDialog = page.getByRole('dialog')
    this.categoryDialog = page.getByRole('dialog')
  }

  async goto() {
    await this.page.goto('/admin/services')
  }

  async openAddServiceDialog() {
    await this.addServiceButton.click()
  }
}
