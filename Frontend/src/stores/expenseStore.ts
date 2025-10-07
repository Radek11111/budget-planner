import { useExpenses } from '@/api/useExpenses'
import type { Expense } from '@/types'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref<Expense[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { getExpenses, addExpense, deleteExpense } = useExpenses()
  const fetchExpenses = async (year?: number, month?: number) => {
    isLoading.value = true
    error.value = null
    try {
      let params: { year?: number; month?: number } = {}
      if (year === undefined) {
        const now = dayjs()
        params.year = now.year()
        params.month = now.month() + 1
      } else {
        params.year = year
        if (month !== undefined) {
          params.month = month
        }
      }

      const response = await getExpenses(params)
      expenses.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch expenses'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  const addNewExpense = async (expense: Expense) => {
    try {
      await addExpense(expense)
      await fetchExpenses()
    } catch (err) {
      error.value = 'Failed to add expense'
      console.error(err)
    }
  }
  const removeExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId)
      expenses.value = expenses.value.filter((expense) => expense.id !== expenseId)
    } catch (err) {
      error.value = 'Failed to remove expense'
      console.error(err)
    }
  }
  return {
    expenses,
    isLoading,
    error,
    fetchExpenses,
    removeExpense,
    addNewExpense,
  }
})
