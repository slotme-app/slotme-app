import type { Page, Locator } from '@playwright/test'

export class MastersPage {
  readonly page: Page
  readonly heading: Locator
  readonly addMasterButton: Locator
  readonly searchInput: Locator
  readonly mastersList: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Masters' })
    this.addMasterButton = page.getByRole('link', { name: 'Add Master' })
    this.searchInput = page.getByPlaceholder('Search masters...')
    this.mastersList = page.locator('table tbody, [class*="space-y"]')
  }

  async goto() {
    await this.page.goto('/admin/masters')
  }

  async search(query: string) {
    await this.searchInput.fill(query)
  }

  async clickAddMaster() {
    await this.addMasterButton.click()
  }
}
