import type { Saving } from '@/types'
import { createApiClerkClient } from './apiClerkClient'
import type { AxiosResponse } from 'axios'

export const useSavings = () => {
  type SavingInput = Omit<Saving, 'id'> & {
    savingGoalId?: string
  }
  const api = createApiClerkClient()

  return {
    getSavings: async (params?: {
      year?: number
      month?: number
    }): Promise<AxiosResponse<Saving[]>> => {
      const res = await api.get('/budget/saving', { params })
      return res
    },
    addSaving: (data: SavingInput) => api.post('/budget/saving', data),
    deleteSaving: (id: string) => api.delete(`/budget/saving/${id}`),
  }
}
