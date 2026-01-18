import { createPinia, setActivePinia } from 'pinia'
import { useExpenseStore } from '@/stores/expenseStore'
import { vi, it, beforeEach } from 'vitest'
import type { Expense } from '@/types'

const deleteExpenseMock = vi.fn()

vi.mock('@/api/useExpenses', async () => ({
  useExpenses: () => ({
    getExpenses: vi.fn(),
    deleteExpense: deleteExpenseMock,
    addExpense: vi.fn(),
  }),
}))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

it('remove expense from monthly and yearly expenses', async () => {
  const store = useExpenseStore()

  const expense: Expense = {
    id: 'expense-1',
    amount: 100,
    category: 'Food',
    date: '2025-01-10',
    description: 'Groceries',
  }

  store.monthlyExpenses = [expense]
  store.yearlyExpenses = [expense]

  deleteExpenseMock.mockResolvedValueOnce(undefined)

  await store.removeExpense('expense-1')

  expect(deleteExpenseMock).toHaveBeenCalledWith('expense-1')
  expect(store.monthlyExpenses).toEqual([])
  expect(store.yearlyExpenses).toEqual([])
  expect(store.error).toBeNull()
})

it('sets error when removing expense fails', async () => {
  const store = useExpenseStore()

  const expense: Expense = {
    id: 'expense-2',
    amount: 100,
    category: 'Food',
    date: '2025-01-10',
    description: 'Groceries',
  }

  store.monthlyExpenses = [expense]
  store.yearlyExpenses = [expense]

  deleteExpenseMock.mockRejectedValueOnce(new Error('Failed to remove expense'))

  await store.removeExpense('expense-2')

  expect(deleteExpenseMock).toHaveBeenCalled()
  expect(store.monthlyExpenses).toHaveLength(1)
  expect(store.yearlyExpenses).toHaveLength(1)
  expect(store.error).toBe('Failed to remove expense')
})
