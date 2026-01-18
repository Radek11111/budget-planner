import { createPinia, setActivePinia } from 'pinia'
import { useExpenseStore } from '@/stores/expenseStore'
import { vi,  it, expect, beforeEach } from 'vitest'
import type { Expense } from '@/types'

const addExpenseMock = vi.fn()
const getExpensesMock = vi.fn()

vi.mock('@/api/useExpenses', async () => ({
  useExpenses: () => ({
    addExpense: addExpenseMock,
    getExpenses: getExpensesMock,
    deleteExpense: vi.fn(),
  }),
}))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

it('adds a new expense and refreshes monthly expenses', async () => {
  const store = useExpenseStore()

  const expense: Expense = {
    id: '1',
    amount: 100,
    category: 'Food',
    date: '2025-01-10',
    description: 'Groceries',
  }

  addExpenseMock.mockResolvedValueOnce(undefined)
  getExpensesMock.mockResolvedValueOnce({ data: [] })

  await store.addNewExpense(expense)

  expect(addExpenseMock).toHaveBeenCalledWith(expense)
  expect(getExpensesMock).toHaveBeenCalledTimes(1)
  expect(store.error).toBeNull()
})

it('sets error when adding a new expense fails', async () => {
  const store = useExpenseStore()

  addExpenseMock.mockRejectedValue(new Error('Failed to add expense'))

  const expense: Expense = {
    id: '2',
    amount: 50,
    category: 'Transport',
    date: '2025-01-10',
    description: 'Bus ticket',
  }
  await store.addNewExpense(expense)

  expect(addExpenseMock).toHaveBeenCalled()
  expect(store.error).toBe('Failed to add expense')
})
