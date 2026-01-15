import { createPinia, setActivePinia } from 'pinia'
import { useExpenseStore } from '@/stores/expenseStore'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const getExpensesMock = vi.fn()

vi.mock('@/api/useExpenses', () => ({
  useExpenses: () => ({
    getExpenses: getExpensesMock,
    addExpenses: vi.fn(),
    deleteExpense: vi.fn(),
  }),
}))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

it('fetches yearly expenses with given year', async () => {
  const mockData = [{ id: '1', amount: 1200, category: 'Rent', date: '2025-01-01' }]

  getExpensesMock.mockResolvedValue({ data: mockData })

  const store = useExpenseStore()
  await store.fetchYearlyExpenses(2025)

  expect(getExpensesMock).toHaveBeenCalledWith({ year: 2025 })
  expect(store.yearlyExpenses).toEqual(mockData)
  expect(store.isLoading).toBe(false)
  expect(store.error).toBeNull()
})
