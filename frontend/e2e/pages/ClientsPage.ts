import type { Page, Locator } from '@playwright/test'

export class ClientsPage {
  readonly page: Page
  readonly heading: Locator
  readonly addClientButton: Locator
  readonly searchInput: Locator
  readonly addClientDialog: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Clients' })
    this.addClientButton = page.getByRole('button', { name: 'Add Client' })
    this.searchInput = page.getByPlaceholder(/search/i)
    this.addClientDialog = page.getByRole('dialog')
  }

  async goto() {
    await this.page.goto('/admin/clients')
  }

  async search(query: string) {
    await this.searchInput.fill(query)
  }

  async openAddClientDialog() {
    await this.addClientButton.first().click()
  }

  async addClient(name: string, phone?: string, email?: string) {
    await this.openAddClientDialog()
    await this.page.getByLabel('Name').fill(name)
    if (phone) await this.page.getByLabel('Phone').fill(phone)
    if (email) await this.page.getByLabel(/email/i).fill(email)
    await this.addClientDialog.getByRole('button', { name: 'Add Client' }).click()
  }
}
