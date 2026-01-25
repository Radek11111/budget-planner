import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useExpenseStore } from '@/stores/expenseStore'
import type { Expense } from '@/types'

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

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('useExpenseStore', () => {
  describe('fetchMonthlyExpenses', () => {
    it('fetches monthly expenses and updates state', async () => {
      const store = useExpenseStore()
      const data = [{ id: '1', amount: 100 }]

      getExpensesMock.mockResolvedValueOnce({ data })

      await store.fetchMonthlyExpenses(2025, 1)

      expect(getExpensesMock).toHaveBeenCalledWith({ year: 2025, month: 1 })
      expect(store.monthlyExpenses).toEqual(data)
      expect(store.error).toBeNull()
      expect(store.isLoading).toBe(false)
    })
  })

  describe('fetchYearlyExpenses', () => {
    it('fetches yearly expenses', async () => {
      const store = useExpenseStore()
      const data = [{ id: '2', amount: 1200 }]

      getExpensesMock.mockResolvedValueOnce({ data })

      await store.fetchYearlyExpenses(2025)

      expect(getExpensesMock).toHaveBeenCalledWith({ year: 2025 })
      expect(store.yearlyExpenses).toEqual(data)
    })
  })

  describe('addNewExpense', () => {
    it('adds expense and refreshes monthly list', async () => {
      const store = useExpenseStore()
      const expense = {
        id: '',
        amount: 50,
        category: 'Food',
        date: '2025-01-01',
        description: 'Test',
      }

      addExpenseMock.mockResolvedValueOnce(undefined)
      getExpensesMock.mockResolvedValueOnce({ data: [] })

      await store.addNewExpense(expense)

      expect(addExpenseMock).toHaveBeenCalledWith(expense)
      expect(getExpensesMock).toHaveBeenCalled()
      expect(store.error).toBeNull()
    })
  })

  describe('removeExpense', () => {
    it('removes expense from state', async () => {
      const store = useExpenseStore()
      const expense: Expense = {
        id: 'e1',
        amount: 100,
        category: 'Food',
        date: '2025-01-01',
        description: 'Test',
      }

      store.monthlyExpenses = [expense]
      store.yearlyExpenses = [expense]

      deleteExpenseMock.mockResolvedValueOnce(undefined)

      await store.removeExpense('e1')

      expect(deleteExpenseMock).toHaveBeenCalledWith('e1')
      expect(store.monthlyExpenses).toHaveLength(0)
      expect(store.yearlyExpenses).toHaveLength(0)
    })

    it('sets error when delete fails', async () => {
      const store = useExpenseStore()
      const expense: Expense = {
        id: 'e2',
        amount: 100,
        category: 'Food',
        date: '2025-01-01',
        description: 'Test',
      }

      store.monthlyExpenses = [expense]
      store.yearlyExpenses = [expense]

      deleteExpenseMock.mockRejectedValueOnce(new Error())

      await store.removeExpense('e2')

      expect(store.error).toBe('Failed to remove expense')
      expect(store.monthlyExpenses).toHaveLength(1)
    })
  })
})
