<script setup lang="ts">
import { useTotalAmount } from '@/composabes/useTotalAmount'
import { useExpenseStore } from '@/stores/expenseStore'
import { useIncomeStore } from '@/stores/incomeStore'
import { useSavingStore } from '@/stores/savingStore'
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

const isLoading = ref(false)
const incomeStore = useIncomeStore()
const expenseStore = useExpenseStore()
const savingStore = useSavingStore()

onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      incomeStore.fetchIncomes(),
      expenseStore.fetchExpenses(),
      savingStore.fetchSavings(),
    ])
  } catch (error) {
    console.error('Error fetching data:', error)
    Swal.fire({
      icon: 'error',
      title: 'Błąd',
      text: 'Nie udało się pobrać danych. Spróbuj ponownie później.',
    })
  } finally {
    isLoading.value = false
  }
})


const totalIncome = useTotalAmount(computed(() => incomeStore.incomes))
const totalExpense = useTotalAmount(computed(() => expenseStore.expenses))
const totalSaving = useTotalAmount(computed(() => savingStore.savings))


const expensesPercentage = computed(() =>
totalIncome.value > 0 ? (totalExpense.value / totalIncome.value) * 100 : 0,
)

const biggestExpense = computed(() => {
  return expenseStore.expenses.reduce((max, expense) => Math.max(max, expense.amount), 0)
})
const savingsPercentage = computed(() =>
  totalIncome.value > 0 ? (totalSaving.value / totalIncome.value) * 100 : 0,
)
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-600">Całkowite wydatki</p>
        <h2 class="text-2xl font-bold ">{{ totalExpense.toFixed(2) }} zł</h2>
      </div>
      <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-600">Oszczędności</p>
        <h2 class="text-2xl font-bold ">{{ totalSaving.toFixed(2) }} zł</h2>
      </div>
      <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-600">Całkowity dochód</p>
        <h2 class="text-2xl font-bold ">{{ totalIncome.toFixed(2) }} zł</h2>
      </div>
      <div class="bg-white p-4 rounded-xl shadow">
        <p class="text-gray-600">Największy wydatek</p>
        <h2 class="text-2xl font-bold ">{{ biggestExpense.toFixed(2) }} zł</h2>
      </div>
    </div>
  </div>
</template>
