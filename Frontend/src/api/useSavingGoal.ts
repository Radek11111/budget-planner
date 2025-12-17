import { createApiClerkClient } from './apiClerkClient'
import type { SavingGoal, SavingGoalInput } from '@/types'

export const useSavingGoal = () => {
  const api = createApiClerkClient()
  return {
    getSavingGoal: async (params?: {}): Promise<SavingGoal[]> => {
      const res = await api.get('budget/saving-goal', { params })
      return res.data
    },
    addSavingGoal: (data: SavingGoalInput) => api.post('/budget/saving-goal', data),
    deleteSavingGoal: (id: string) => api.delete(`budget/saving-goal/${id}`),
    updateSavingGoal: (id: string, data: Partial<SavingGoal>) =>
      api.patch(`/budget/saving-goal/${id}`, data),
   
  }
}
