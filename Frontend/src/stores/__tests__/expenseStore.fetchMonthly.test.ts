import { createPinia, setActivePinia } from 'pinia'
import { useExpenseStore } from '@/stores/expenseStore'
import { vi, it, expect, beforeEach } from 'vitest'

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

it('fetches monthly expenses with given year and month', async () => {
  const mockData = [{ id: '1', amount: 100, category: 'Food', date: '2025-01-01' }]
  getExpensesMock.mockResolvedValue({ data: mockData })

  const store = useExpenseStore()
  await store.fetchMonthlyExpenses(2025, 1)

  expect(getExpensesMock).toHaveBeenCalledWith({ year: 2025, month: 1 })
  expect(store.monthlyExpenses).toEqual(mockData)
  expect(store.isLoading).toBe(false)
  expect(store.error).toBeNull()
})

it('handles error when fetching monthly expenses fails', async () => {
  getExpensesMock.mockRejectedValueOnce(new Error('API Error'))

  const store = useExpenseStore()
  await store.fetchMonthlyExpenses(2025, 1)

  expect(store.monthlyExpenses).toEqual([])
  expect(store.error).toBe('Failed to fetch expenses')
  expect(store.isLoading).toBe(false)
})

it('fetches monthly expenses using current date when params are missing', async () => {
  getExpensesMock.mockResolvedValue({ data: [] })

  const store = useExpenseStore()
  await store.fetchMonthlyExpenses()

  expect(getExpensesMock).toHaveBeenCalledWith(
    expect.objectContaining({
      year: expect.any(Number),
      month: expect.any(Number),
    }),
  )

  expect(store.monthlyExpenses).toEqual([])
  expect(store.isLoading).toBe(false)
})
