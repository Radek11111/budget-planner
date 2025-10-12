import { useSavings } from '@/api/useSavings'
import type { Saving } from '@/types'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSavingStore = defineStore('saving', () => {
  const monthlySavings = ref<Saving[]>([])
  const yearlySavings = ref<Saving[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { getSavings, addSaving, deleteSaving } = useSavings()
  const fetchMonthlySavings = async (year?: number, month?: number) => {
    isLoading.value = true
    error.value = null
    monthlySavings.value = []
    try {
      const now = dayjs()
      const params = {
        year: year ?? now.year(),
        month: month ?? now.month() + 1,
      }
      const response = await getSavings(params)
      monthlySavings.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch savings'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchYearlySavings = async (year?: number) => {
    isLoading.value = true
    error.value = null
    yearlySavings.value = []
    try {
      const now = dayjs()
      const params = {
        year: year ?? now.year(),
      }
      const response = await getSavings(params)
      yearlySavings.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch savings'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const addNewSaving = async (saving: Saving) => {
    try {
      await addSaving(saving)
      await fetchMonthlySavings()
    } catch (err) {
      console.error('Failed to add saving:', err)
      throw err
    }
  }
  const removeSaving = async (savingid: string) => {
    try {
      await deleteSaving(savingid)
      monthlySavings.value = monthlySavings.value.filter((saving) => saving.id !== savingid)
    } catch (err) {
      console.error('Failed to remove saving:', err)
      throw err
    }
  }
  return {
    monthlySavings,
    yearlySavings,
    isLoading,
    error,
    fetchMonthlySavings,
    fetchYearlySavings,
    addNewSaving,
    removeSaving,
  }
})
