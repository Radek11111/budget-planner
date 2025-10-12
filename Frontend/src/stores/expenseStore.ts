import { useExpenses } from '@/api/useExpenses'
import type { Expense } from '@/types'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExpenseStore = defineStore('expense', () => {
  const monthlyExpenses = ref<Expense[]>([])
  const yearlyExpenses = ref<Expense[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { getExpenses, addExpense, deleteExpense } = useExpenses()

  const fetchMonthlyExpenses = async (year?: number, month?: number) => {
    isLoading.value = true
    error.value = null
    monthlyExpenses.value = []
    try {
      const now = dayjs()
      const params = {
        year: year ?? now.year(),
        month: month ?? now.month() + 1,
      }

      const response = await getExpenses(params)
      monthlyExpenses.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch expenses'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchYearlyExpenses = async (year?: number) => {
    isLoading.value = true
    error.value = null
    yearlyExpenses.value = []
    try {
      const now = dayjs()
      const params = {
        year: year ?? now.year(),
      }
      const response = await getExpenses(params)
      yearlyExpenses.value = response.data
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
      await fetchMonthlyExpenses()
    } catch (err) {
      error.value = 'Failed to add expense'
      console.error(err)
    }
  }
  const removeExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId)
      monthlyExpenses.value = monthlyExpenses.value.filter((e) => e.id !== expenseId)
      yearlyExpenses.value = yearlyExpenses.value.filter((e) => e.id !== expenseId)
    } catch (err) {
      error.value = 'Failed to remove expense'
      console.error(err)
    }
  }
  return {
    monthlyExpenses,
    yearlyExpenses,
    isLoading,
    error,
    fetchMonthlyExpenses,
    fetchYearlyExpenses,
    addNewExpense,
    removeExpense,
  }
})
