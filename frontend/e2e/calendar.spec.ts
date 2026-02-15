import { test, expect } from '@playwright/test'
import { CalendarPage } from './pages/CalendarPage'

test.describe('Calendar Management', () => {
  test('should display calendar page with heading', async ({ page }) => {
    const calendarPage = new CalendarPage(page)
    await calendarPage.goto()

    await expect(calendarPage.heading).toBeVisible()
    await expect(calendarPage.newAppointmentButton).toBeVisible()
  })

  test('should render FullCalendar component', async ({ page }) => {
    const calendarPage = new CalendarPage(page)
    await calendarPage.goto()

    // FullCalendar renders with .fc class
    await expect(calendarPage.calendar).toBeVisible()
  })

  test('should open new appointment booking modal', async ({ page }) => {
    const calendarPage = new CalendarPage(page)
    await calendarPage.goto()
    await calendarPage.openBookingModal()

    // Booking modal should appear as a dialog
    await expect(calendarPage.bookingDialog).toBeVisible()
  })

  test('should display calendar navigation controls', async ({ page }) => {
    const calendarPage = new CalendarPage(page)
    await calendarPage.goto()

    // FullCalendar should have toolbar with navigation buttons
    const toolbar = page.locator('.fc-toolbar')
    await expect(toolbar).toBeVisible()

    // Should have today/prev/next buttons
    const todayButton = page.locator('.fc-today-button')
    await expect(todayButton).toBeVisible()
  })

  test('should switch between day and week views', async ({ page }) => {
    const calendarPage = new CalendarPage(page)
    await calendarPage.goto()

    // Switch to day view
    const dayButton = page.locator('.fc-timeGridDay-button')
    if (await dayButton.isVisible()) {
      await dayButton.click()
      await expect(page.locator('.fc-timegrid')).toBeVisible()
    }

    // Switch to week view
    const weekButton = page.locator('.fc-timeGridWeek-button')
    if (await weekButton.isVisible()) {
      await weekButton.click()
      await expect(page.locator('.fc-timegrid')).toBeVisible()
    }
  })
})
