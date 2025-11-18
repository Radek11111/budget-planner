import type { AxiosResponse } from 'axios'
import { createApiClerkClient } from './apiClerkClient'
import type { SavingGoal } from '@/types'

export const useSavingGoal = () => {
  const api = createApiClerkClient()
  return {
    getSavingGoal: async (params?: {}): Promise<AxiosResponse<SavingGoal[]>> => {
      const res = await api.get('budget/saving-goal', { params })
      return res
    },
    addSavingGoal: (data: SavingGoal) => api.post('/budget/saving-goal', data),
    deleteSavingGoal: (id: string) => api.delete(`budget/saving-goal/${id}`),
    updateSavingGoal: (id: string, data: SavingGoal) =>
      api.patch(`/budget/saving-goal/${id}`, data),
  }
}
