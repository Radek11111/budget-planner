import type { TransactionBase } from '../types'
import type { Income, Expense, Saving } from '../types'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
})

export const getBudgets = () => api.get<TransactionBase[]>('/budget')
export const addIncome = (data: Income) => api.post('/budget/income', data)
export const addExpense = (data: Expense) => api.post('/budget/expense', data)
export const addSaving = (data: Saving) => api.post('/budget/saving', data)
export const deleteBudget = (id: string) => api.delete(`/budget/${id}`)
