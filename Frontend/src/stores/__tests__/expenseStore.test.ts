import { createPinia, setActivePinia } from 'pinia'
import { useExpenseStore } from '@/stores/expenseStore'
import { vi,  it, expect, beforeEach } from 'vitest'

beforeEach(() => {
  setActivePinia(createPinia())
})

const getExpensesMock = vi.fn()
const addExpenseMock = vi.fn()
const deleteExpenseMock = vi.fn()

vi.mock('@/api/useExpenses', () => ({
  useExpenses: () => ({
    getExpenses: getExpensesMock,
    addExpense: addExpenseMock,
    deleteExpense: deleteExpenseMock,
  }),
}))

it('fetches monthly expenses and updates state', async () => {
  const mockData = [{ id: '1', amount: 100, category: 'Food', date: '2025-01-01' }]

  getExpensesMock.mockResolvedValue({ data: mockData })

  const store = useExpenseStore()
  await store.fetchMonthlyExpenses(2025, 1)

  expect(getExpensesMock).toHaveBeenCalledWith({ year: 2025, month: 1 })
  expect(store.monthlyExpenses).toEqual(mockData)
  expect(store.isLoading).toBe(false)
  expect(store.error).toBe(null)
})
