import { useIncomes } from '@/api/useIncomes'
import type { Income } from '@/types'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIncomeStore = defineStore('income', () => {
  const incomes = ref<Income[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { getIncomes, addIncome, deleteIncome } = useIncomes()
  const fetchIncomes = async () => {
    isLoading.value = true
    error.value = null
    try {
      const now = dayjs()
      const year = now.year()
      const month = now.month() + 1
      const response = await getIncomes({ year, month })
      incomes.value = response.data
      
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
      await fetchIncomes()
    } catch (err) {
      console.error('Failed to add income:', err)
      throw err
    }
  }

  const removeIncome = async (incomeId: string) => {
    try {
      await deleteIncome(incomeId)
      incomes.value = incomes.value.filter((income) => income.id !== incomeId)
    } catch (error) {
      console.error('Failed to remove income:', error)
    }
  }
  return {
    incomes,
    isLoading,
    error,
    fetchIncomes,
    removeIncome,
    addNewIncome,
  }
})
