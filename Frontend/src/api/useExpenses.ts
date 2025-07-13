import type { Expense } from "@/types"
import { createApiClerkClient } from "./apiClerkClient"

export const useExpenses = () => {
  const api = createApiClerkClient()
  return {
    getExpenses: () => api.get('/budget/expense'),
    addExpense: (data: Expense) => api.post('/budget/expense', data),
  }
}
