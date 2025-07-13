import type { TransactionBase } from '../types'
import { createApiClerkClient } from './apiClerkClient'

export const useBudget = () => {
  const api = createApiClerkClient()
  return {
    getBudgets: () => api.get<TransactionBase[]>('/budget'),
    deleteBudget: (id: string) => api.delete(`/budget/${id}`),
  }
}
