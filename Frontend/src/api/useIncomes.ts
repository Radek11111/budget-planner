import type { Income } from "@/types"
import { createApiClerkClient } from "./apiClerkClient"

export const useIncomes = () => {
  const api = createApiClerkClient()
  return {
    getIncomes: () => api.get('/budget/income'),
    addIncome: (data: Income) => api.post('/budget/income', data),
  }
}
