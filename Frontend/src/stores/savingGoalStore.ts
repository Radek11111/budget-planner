import type { SavingGoal, SavingGoalInput, SavingGoalView } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSavingGoal } from '@/api/useSavingGoal'

export const useSavingGoalStore = defineStore('saving-goal', () => {
  const savingGoal = ref<SavingGoal[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { getSavingGoal, addSavingGoal, deleteSavingGoal, updateSavingGoal } = useSavingGoal()

  const calculateMonthlyAmount = (
    targetAmount: number,
    currentAmount: number,
    deadline?: string,
  ) => {
    if (!deadline || currentAmount >= targetAmount) return 0

    const now = new Date()
    const endDate = new Date(deadline)
    const remaining = targetAmount - currentAmount

    const days = Math.max(1, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    const months = days / 30.44
    return remaining / months
  }

  const calculateDailyAmount = (targetAmount: number, currentAmount: number, deadline?: string) => {
    if (!deadline || currentAmount >= targetAmount) return 0

    const now = new Date()
    const endDate = new Date(deadline)

    const days = Math.max(1, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    return (targetAmount - currentAmount) / days
  }

  const sortedGoals = computed(() => {
    return [...savingGoal.value].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  })

  const goalsWithProgress = computed<SavingGoalView[]>(() => {
    return savingGoal.value.map((goal) => {
      const currentAmount = goal.savings?.reduce((sum, s) => sum + s.amount, 0) ?? 0

      const progress =
        goal.targetAmount > 0 ? Math.min(100, (currentAmount / goal.targetAmount) * 100) : 0

      return {
        ...goal,
        currentAmount,
        progress,
        remainingAmount: goal.targetAmount - currentAmount,
        isCompleted: currentAmount >= goal.targetAmount,
        monthlyAmount: calculateMonthlyAmount(goal.targetAmount, currentAmount, goal.deadline),
        dailyAmount: calculateDailyAmount(goal.targetAmount, currentAmount, goal.deadline),
      }
    })
  })

  const activeGoals = computed(() => {
    return goalsWithProgress.value.filter((goal) => !goal.isCompleted)
  })

  const completedGoals = computed(() => {
    return goalsWithProgress.value.filter((goal) => goal.isCompleted)
  })

  const totalSavedAmount = computed(() => {
    return goalsWithProgress.value.reduce((sum, goal) => sum + goal.currentAmount, 0)
  })

  const totalTargetAmount = computed(() => {
    return savingGoal.value.reduce((sum, goal) => sum + goal.targetAmount, 0)
  })

  const fetchSavingGoals = async () => {
    isLoading.value = true
    error.value = null

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
