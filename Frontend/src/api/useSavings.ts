import type { Saving } from '@/types'
import { createApiClerkClient } from './apiClerkClient'
import type { AxiosResponse } from 'axios'

export const useSavings = () => {
  const api = createApiClerkClient()
  return {
    getSavings: async (): Promise<AxiosResponse<Saving[]>> => {
      const res = await api.get('/budget/saving')
      return res
    },
    addSaving: (data: Saving) => api.post('/budget/saving', data),
    deleteSaving: (id: string) => api.delete(`/budget/saving/${id}`),
  }
}
