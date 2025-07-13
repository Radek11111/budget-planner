import type { Saving } from '@/types'
import { createApiClerkClient } from './apiClerkClient'

export const useSavings = () => {
  const api = createApiClerkClient()
  return {
    getSavings: () => api.get('/budget/saving'),
    addSaving: (data: Saving) => api.post('/budget/saving', data),
    deleteSaving: (id: string) => api.delete(`/budget/saving/${id}`),
  }
}
