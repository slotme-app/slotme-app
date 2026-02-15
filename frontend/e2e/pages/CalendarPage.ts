import type { Page, Locator } from '@playwright/test'

export class CalendarPage {
  readonly page: Page
  readonly heading: Locator
  readonly newAppointmentButton: Locator
  readonly bookingDialog: Locator
  readonly calendar: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Calendar' })
    this.newAppointmentButton = page.getByRole('button', {
      name: 'New Appointment',
    })
    this.bookingDialog = page.getByRole('dialog')
    this.calendar = page.locator('.fc')
  }

  async goto() {
    await this.page.goto('/admin/calendar')
  }

  async openBookingModal() {
    await this.newAppointmentButton.click()
  }
}
