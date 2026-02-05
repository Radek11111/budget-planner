import { test as setup, expect } from '@playwright/test'

const authFile = 'e2e/.auth/clerk-user.json'

setup('authentication setup', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByRole('button', { name: /zaloguj się/i }).click()

  await page.getByLabel(/email address/i).fill('test@test.pl')
  await page.getByRole('button', { name: /continue/i }).click()

  await page.waitForTimeout(1000)

  const passwordField = page.locator('input[type="password"], input[name*="password"], #password')
  await passwordField.first().fill('N@nku943')
  await page.getByRole('button', { name: /continue/i }).click()

  await page.waitForURL('http://localhost:5173/user')

  await expect(page.getByTestId('user-home-view')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
