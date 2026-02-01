import { test, expect } from '@playwright/test'

test('user can add a new expense', async ({ page }) => {
  await page.goto('http://localhost:5173/dashboard')

  await page.getByTestId('tab-expenses').click()
  await expect(page.getByTestId('expense-date-input')).toBeVisible()

  await page.getByTestId('expense-date-input').fill('2026-02-02')
  await page.getByTestId('expense-amount-input').fill('25.50')
  await page.getByTestId('expense-category-input').selectOption('Transport')
  await page.getByTestId('expense-description-input').fill('Bus ticket')

  await page.getByTestId('expense-submit-button').click()

  await expect(page.getByTestId('expense-description')).toHaveText('Bus ticket')
})
