import { useSavings } from '@/api/useSavings'
import type { Saving } from '@/types'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSavingStore = defineStore('saving', () => {
  const savings = ref<Saving[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { getSavings, addSaving, deleteSaving } = useSavings()
  const fetchSavings = async (year?: number, month?: number) => {
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

      const response = await getSavings({ year, month })
      savings.value = response.data
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
      await fetchSavings()
    } catch (err) {
      console.error('Failed to add saving:', err)
      throw err
    }
  }
  const removeSaving = async (savingid: string) => {
    try {
      await deleteSaving(savingid)
      savings.value = savings.value.filter((saving) => saving.id !== savingid)
    } catch (err) {
      console.error('Failed to remove saving:', err)
      throw err
    }
  }
  return {
    savings,
    isLoading,
    error,
    fetchSavings,
    removeSaving,
    addNewSaving,
  }
})
