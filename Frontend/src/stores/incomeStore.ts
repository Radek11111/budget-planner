import { useIncomes } from '@/api/useIncomes'
import type { Income } from '@/types'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIncomeStore = defineStore('income', () => {
  const monthlyIncomes = ref<Income[]>([])
  const yearlyIncomes = ref<Income[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { getIncomes, addIncome, deleteIncome } = useIncomes()
  const fetchMonthlyIncomes = async (year?: number, month?: number) => {
    isLoading.value = true
    error.value = null
    monthlyIncomes.value = []
    try {
      const now = dayjs()
      const params = {
        year: year ?? now.year(),
        month: month ?? now.month() + 1,
      }
      const response = await getIncomes(params)
      monthlyIncomes.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch incomes'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchYearlyIncomes = async (year?: number) => {
    isLoading.value = true
    error.value = null
    yearlyIncomes.value = []
    try {
      const now = dayjs()
      const params = {
        year: year ?? now.year(),
      }
      const response = await getIncomes(params)
      yearlyIncomes.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch incomes'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  const addNewIncome = async (income: Income) => {
    try {
      await addIncome(income)
      await fetchMonthlyIncomes()
    } catch (err) {
      console.error('Failed to add income:', err)
      throw err
    }
  }

  const removeIncome = async (incomeId: string) => {
    try {
      await deleteIncome(incomeId)
      monthlyIncomes.value = monthlyIncomes.value.filter((income) => income.id !== incomeId)
    } catch (error) {
      console.error('Failed to remove income:', error)
    }
  }
  return {
    monthlyIncomes,
    yearlyIncomes,
    isLoading,
    error,
    fetchMonthlyIncomes,
    fetchYearlyIncomes,
    addNewIncome,
    removeIncome,
  }
})
