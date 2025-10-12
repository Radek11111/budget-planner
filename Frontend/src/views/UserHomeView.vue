<script setup lang="ts">
import { useTotalAmount } from '@/composabes/useTotalAmount'
import { useExpenseStore } from '@/stores/expenseStore'
import { useIncomeStore } from '@/stores/incomeStore'
import { useSavingStore } from '@/stores/savingStore'
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import FinanseLineChart from '../components/FinanseLineChart.vue'
import dayjs from 'dayjs'
import MonthlyOverview from '@/components/transactionReview/MonthlyOverview.vue'

const isLoading = ref(false)
const incomeStore = useIncomeStore()
const expenseStore = useExpenseStore()
const savingStore = useSavingStore()

onMounted(async () => {
  try {
    isLoading.value = true
    const currentYear = dayjs().year()
    await Promise.all([
      incomeStore.fetchYearlyIncomes(currentYear),
      expenseStore.fetchYearlyExpenses(currentYear),
      savingStore.fetchYearlySavings(currentYear),
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
// Cart calculations
const totalIncome = useTotalAmount(computed(() => incomeStore.yearlyIncomes))
const totalExpense = useTotalAmount(computed(() => expenseStore.yearlyExpenses))
const totalSaving = useTotalAmount(computed(() => savingStore.yearlySavings))
const biggestExpense = computed(() => {
  return expenseStore.yearlyExpenses.reduce((max, expense) => Math.max(max, expense.amount), 0)
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <div class="flex flex-col">
          <p class="text-gray-600">Całkowite wydatki</p>
          <h2 class="text-2xl font-bold">{{ totalExpense.toFixed(2) }} zł</h2>
        </div>
        <v-icon name="bi-file-arrow-down-fill" scale="2.5" fill="#FF474D"></v-icon>
      </div>

      <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <div class="flex flex-col">
          <p class="text-gray-600">Oszczędności</p>
          <h2 class="text-2xl font-bold text-orange">{{ totalSaving.toFixed(2) }} zł</h2>
        </div>
        <v-icon name="bi-file-arrow-up-fill" scale="2.5" fill="#ffb347"></v-icon>
      </div>

      <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <div class="flex flex-col">
          <p class="text-gray-600">Całkowity dochód</p>
          <h2 class="text-2xl font-bold text-blue-600">{{ totalIncome.toFixed(2) }} zł</h2>
        </div>
        <v-icon name="io-wallet" scale="2.5" fill="#155dfc"></v-icon>
      </div>

      <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <div class="flex flex-col">
          <p class="text-gray-600">Największy wydatek</p>
          <h2 class="text-2xl font-bold text-purple-800">{{ biggestExpense.toFixed(2) }} zł</h2>
        </div>
        <v-icon name="md-localgrocerystore-round" scale="2.5" fill="#6e11b0"></v-icon>
      </div>
    </div>
    <div class="bg-white p-4 rounded-xl shadow">
      <h3 class="text-lg font-semibold mb-4">Trendy wydatków</h3>
      <FinanseLineChart />
    </div>
    <div class="bg-white p-4 rounded-xl shadow">
      <div class="border-gray-200 pb-2 mb-2">
        <h3 class="text-lg font-semibold text-gray-800">Przegląd miesięczny</h3>
        <p class="text-sm text-gray-500 mt-1">Wybierz miesiąc, aby zobaczyć statystyki</p>
      </div>

      <MonthlyOverview />
      <div class="border-t"></div>
    </div>
  </div>
</template>
