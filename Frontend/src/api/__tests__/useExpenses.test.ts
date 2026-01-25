import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useExpenses } from '@/api/useExpenses'

const getMock = vi.fn()
const postMock = vi.fn()
const deleteMock = vi.fn()

vi.mock('@/api/apiClerkClient', () => ({
  createApiClerkClient: () => ({
    get: getMock,
    post: postMock,
    delete: deleteMock,
  }),
}))

describe('useExpenses API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getExpenses', () => {
    it('calls GET /budget/expense with params', async () => {
      getMock.mockResolvedValue({ data: [] })

      const api = useExpenses()
      await api.getExpenses({ year: 2025, month: 1 })

      expect(getMock).toHaveBeenCalledWith('/budget/expense', {
        params: { year: 2025, month: 1 },
      })
    })
  })

  describe('addExpense', () => {
    it('calls POST /budget/expense with payload', async () => {
      const api = useExpenses()

      const expense = {
        id: '',
        amount: 100,
        category: 'Food',
        date: '2025-01-10',
        description: 'Groceries',
      }

      await api.addExpense(expense)

      expect(postMock).toHaveBeenCalledWith('/budget/expense', expense)
    })
  })

  describe('deleteExpense', () => {
    it('calls DELETE /budget/expense/:id', async () => {
      const api = useExpenses()

      await api.deleteExpense('expense-1')

      expect(deleteMock).toHaveBeenCalledWith('/budget/expense/expense-1')
    })
  })
})
