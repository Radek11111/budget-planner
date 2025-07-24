import { useSavings } from '@/api/useSavings'
import type { Saving } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSavingStore = defineStore('saving', () => {
  const savings = ref<Saving[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { getSavings, addSaving, deleteSaving } = useSavings()
  const fetchSavings = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await getSavings()
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
