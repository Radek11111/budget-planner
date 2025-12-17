import type { SavingGoal, SavingGoalInput } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSavingGoal } from '@/api/useSavingGoal'

export const useSavingGoalStore = defineStore('saving-goal', () => {
  const savingGoal = ref<SavingGoal[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { getSavingGoal, addSavingGoal, deleteSavingGoal, updateSavingGoal } = useSavingGoal()

  const calculateMonthlyAmount = (goal: SavingGoal) => {
    if (!goal.deadline || goal.currentAmount >= goal.targetAmount) return 0

    const now = new Date()
    const deadline = new Date(goal.deadline)
    const remaining = goal.targetAmount - goal.currentAmount

    let monthsDiff = (deadline.getFullYear() - now.getFullYear()) * 12
    monthsDiff += deadline.getMonth() - now.getMonth()

    if (deadline.getDate() < now.getDate()) {
      monthsDiff--
    }

    if (monthsDiff <= 0) return remaining

    const remainingDays = Math.max(
      0,
      Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    )
    const exactMonths = remainingDays / 30.44
    return remaining / Math.max(1, exactMonths)
  }

  const calculateDailyAmount = (goal: SavingGoal) => {
    if (!goal.deadline || goal.currentAmount >= goal.targetAmount) return 0

    const now = new Date()
    const deadline = new Date(goal.deadline)
    const remaining = goal.targetAmount - goal.currentAmount

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const targetDate = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())

    const daysDiff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff <= 0) return remaining
    return remaining / daysDiff
  }

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
      monthlyAmount: calculateMonthlyAmount(goal),
      dailyAmount: calculateDailyAmount(goal),
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
      const goals = await getSavingGoal()
      savingGoal.value = goals
    } catch (err) {
      error.value = 'Failed to fetch savings'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const createSavingGoal = async (goalData: SavingGoalInput) => {
    isLoading.value = true
    error.value = null
    try {
      const newGoal = await addSavingGoal(goalData)
      savingGoal.value.unshift(newGoal.data)
    } catch (err) {
      error.value = 'Failed to create saving goal'
      console.error('Error creating saving goal:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const editSavingGoal = async (id: string, updates: Partial<SavingGoal>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedGoal = await updateSavingGoal(id, updates)

      const index = savingGoal.value.findIndex((goal) => goal.id === id)
      if (index !== -1) {
        savingGoal.value[index] = updatedGoal.data
      }
      return updatedGoal.data
    } catch (err) {
      error.value = 'Failed to update saving goal'
      console.error('Error updating saving goal:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeSavingGoal = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await deleteSavingGoal(id)
      savingGoal.value = savingGoal.value.filter((goal) => goal.id !== id)
    } catch (err) {
      error.value = 'Failed to delete saving goal'
      console.error('Error deleting saving goal:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getGoalById = (id: string) => {
    return savingGoal.value.find((goal) => goal.id === id)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    savingGoal,
    isLoading,
    error,
    sortedGoals,
    goalsWithProgress,
    activeGoals,
    completedGoals,
    totalSavedAmount,
    totalTargetAmount,
    fetchSavingGoals,
    createSavingGoal,
    editSavingGoal,
    removeSavingGoal,
    getGoalById,
    clearError,
    calculateMonthlyAmount,
    calculateDailyAmount,
  }
})
