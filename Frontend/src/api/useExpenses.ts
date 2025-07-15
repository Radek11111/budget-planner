import type { Expense } from '@/types'
import { createApiClerkClient } from './apiClerkClient'
import type { AxiosResponse } from 'axios'

export const useExpenses = () => {
  const api = createApiClerkClient()
  return {
    getExpenses: async (): Promise<AxiosResponse<Expense[]>> => {
      const res = await api.get('/budget/expense')
      return res
    },
    addExpense: (data: Expense) => api.post('/budget/expense', data),
    deleteExpense: (id: string) => api.delete(`/budget/expense/${id}`),
  }
}
