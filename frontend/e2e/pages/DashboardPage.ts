import type { Page, Locator } from '@playwright/test'

export class DashboardPage {
  readonly page: Page
  readonly sidebar: Locator
  readonly header: Locator
  readonly notificationBell: Locator
  readonly profileMenu: Locator
  readonly mobileMenuButton: Locator

  constructor(page: Page) {
    this.page = page
    this.sidebar = page.locator('aside')
    this.header = page.locator('header')
    this.notificationBell = page.getByLabel('Notifications')
    this.profileMenu = page.getByLabel('User menu')
    this.mobileMenuButton = page.getByLabel('Toggle menu')
  }

  async navigateTo(label: string) {
    await this.page.getByRole('link', { name: label }).click()
  }

  async logout() {
    await this.profileMenu.click()
    await this.page.getByRole('menuitem', { name: 'Sign out' }).click()
  }
}
