import axios from 'axios'
import type { TransactionBase, Income, Expense, Saving } from '../types'
import { useAuth } from '@clerk/vue'

export const useBudgetService = () => {
  const { getToken } = useAuth()

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })

  api.interceptors.request.use(async (config) => {
    const token = await getToken.value()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return {
    getBudgets: async () => api.get<TransactionBase[]>('/budget'),
    addIncome: async (data: Income) => api.post('/budget/income', data),
    addExpense: async (data: Expense) => api.post('/budget/expense', data),
    addSaving: async (data: Saving) => api.post('/budget/saving', data),
    deleteBudget: async (id: string) => api.delete(`/budget/${id}`),
  }
}
