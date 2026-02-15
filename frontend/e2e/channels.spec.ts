import { test, expect } from '@playwright/test'

test.describe('Channels Management', () => {
  test('should display channels page with heading', async ({ page }) => {
    await page.goto('/admin/channels')

    await expect(
      page.getByRole('heading', { name: 'Channels' }),
    ).toBeVisible()
    await expect(page.getByText('WhatsApp Business')).toBeVisible()
  })

  test('should display WhatsApp configuration form', async ({ page }) => {
    await page.goto('/admin/channels')

    await expect(page.getByLabel('Phone Number ID')).toBeVisible()
    await expect(page.getByLabel('Access Token')).toBeVisible()
    await expect(page.getByLabel('Verify Token')).toBeVisible()
  })

  test('should show save and test connection buttons', async ({ page }) => {
    await page.goto('/admin/channels')

    await expect(
      page.getByRole('button', { name: /save configuration/i }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /test connection/i }),
    ).toBeVisible()
  })

  test('should show conversations link card', async ({ page }) => {
    await page.goto('/admin/channels')

    await expect(page.getByText('Conversations')).toBeVisible()
    await expect(
      page.getByRole('link', { name: /view conversations/i }).or(
        page.getByRole('button', { name: /view conversations/i }),
      ),
    ).toBeVisible()
  })

  test('should navigate to conversations page', async ({ page }) => {
    await page.goto('/admin/channels/conversations')

    await expect(
      page.getByRole('heading', { name: 'Conversations' }),
    ).toBeVisible()
    await expect(
      page.getByText(/monitor ai-assisted/i),
    ).toBeVisible()
  })

  test('should show empty state or conversation list', async ({ page }) => {
    await page.goto('/admin/channels/conversations')

    const emptyState = page.getByText(/no conversations yet/i)
    const conversationList = page.locator('button').filter({ hasText: /.+/ }).first()

    // Either empty state or conversation buttons should be present
    await expect(
      emptyState.or(conversationList),
    ).toBeVisible()
  })

  test('should show back button to channels from conversations', async ({
    page,
  }) => {
    await page.goto('/admin/channels/conversations')

    const backButton = page.getByRole('button').filter({ has: page.locator('svg') }).first()
    await expect(backButton).toBeVisible()
  })
})
