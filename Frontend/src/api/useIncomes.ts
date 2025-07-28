import type { Income } from '@/types'
import { createApiClerkClient } from './apiClerkClient'
import type { AxiosResponse } from 'axios'

export const useIncomes = () => {
  const api = createApiClerkClient()
  return {
    getIncomes: async (params?: { year?: number; month?: number }): Promise<AxiosResponse<Income[]>> => {
      const res = await api.get('/budget/income', { params })

      return res
    },
    addIncome: (data: Income) => api.post('/budget/income', data),
    deleteIncome: (id: string) => api.delete(`/budget/income/${id}`),
  }
}
