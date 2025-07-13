import type { Income } from '@/types'
import { createApiClerkClient } from './apiClerkClient'

export const useIncomes = () => {
  const api = createApiClerkClient()
  return {
    getIncomes: async (): Promise<{ data: Income[] }> => {
      const res = await api.get('/budget/income')

      return res.data
    },
    addIncome: (data: Income) => api.post('/budget/income', data),
    deleteIncome: (id: string) => api.delete(`/budget/income/${id}`),
  }
}
