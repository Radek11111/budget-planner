import type { SavingGoal } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSavingGoal } from '@/api/useSavingGoal'

export const useSavingGoalStore = defineStore('saving-goal', () => {
  const savingGoal = ref<SavingGoal[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { getSavingGoal, addSavingGoal, deleteSavingGoal, updateSavingGoal } = useSavingGoal()

  const sortedGoals = computed(() => {
    return [...savingGoal.value].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  })

  const goalsWithProgress = computed(() => {
    return savingGoal.value.map((goal) => ({
      ...goal,
      progress: goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0,
      remainingAmount: goal.targetAmount - goal.currentAmount,
      isCompleted: goal.currentAmount >= goal.targetAmount,
    }))
  })

  const activeGoals = computed(() => {
    return goalsWithProgress.value.filter((goal) => !goal.isCompleted)
  })

  const completedGoals = computed(() => {
    return goalsWithProgress.value.filter((goal) => goal.isCompleted)
  })

  const totalSavedAmount = computed(() => {
    return savingGoal.value.reduce((sum, goal) => sum + goal.currentAmount, 0)
  })

  const totalTargetAmount = computed(() => {
    return savingGoal.value.reduce((sum, goal) => sum + goal.targetAmount, 0)
  })

  const fetchSavingGoals = async () => {
    isLoading.value = true
    error.value = null
    savingGoal.value = []
    try {
      const response = await getSavingGoal()
      savingGoal.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch savings'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return {}
})
