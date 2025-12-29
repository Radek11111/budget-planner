<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import IncomeForm from '@/components/forms/IncomeForm.vue'
import ExpenseForm from '@/components/forms/ExpenseForm.vue'
import SavingForm from '@/components/forms/SavingForm.vue'
import { useIncomeStore } from '@/stores/incomeStore'
import { useExpenseStore } from '@/stores/expenseStore'
import { useSavingStore } from '@/stores/savingStore'
import Swal from 'sweetalert2'
import { useTotalAmount } from '@/composabes/useTotalAmount'
import { useSprending } from '../composabes/useSprending'
import FinancePieChart from '@/components/FinancePieChart.vue'
import dayjs from 'dayjs'
import { useSavingGoalStore } from '@/stores/savingGoalStore'

const isLoading = ref(false)
const incomeStore = useIncomeStore()
const expenseStore = useExpenseStore()
const savingStore = useSavingStore()
const { useSpendingWarning } = useSprending()
const savingGoalStore = useSavingGoalStore()

const handleSavingAdded = async () => {
  const year = dayjs().year()
  const month = dayjs().month() + 1

  await Promise.all([
    savingStore.fetchMonthlySavings(year, month),
    savingGoalStore.fetchSavingGoals(),
  ])
}


onMounted(async () => {
  const currentYear = dayjs().year()
  const currentMonth = dayjs().month() + 1
  try {
    isLoading.value = true
    await Promise.all([
      incomeStore.fetchMonthlyIncomes(currentYear, currentMonth),
      expenseStore.fetchMonthlyExpenses(currentYear, currentMonth),
      savingStore.fetchMonthlySavings(currentYear, currentMonth),
      
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

// Total amounts
const totalIncome = useTotalAmount(computed(() => incomeStore.monthlyIncomes))
const totalExpense = useTotalAmount(computed(() => expenseStore.monthlyExpenses))
const totalSaving = useTotalAmount(computed(() => savingStore.monthlySavings))

// Function percentage
const expensesPercentage = computed(() =>
  totalIncome.value > 0 ? (totalExpense.value / totalIncome.value) * 100 : 0,
)

const savingsPercentage = computed(() =>
  totalIncome.value > 0 ? (totalSaving.value / totalIncome.value) * 100 : 0,
)
// Watch for changes in expenses percentage to trigger warning
useSpendingWarning(expensesPercentage)

// UI
const activeTab = ref('earnings')
const tabs = [
  { id: 'earnings', name: 'Zarobki', icon: 'io-wallet-outline' },
  { id: 'expenses', name: 'Wydatki', icon: 'fa-shopping-cart' },
  { id: 'savings', name: 'Oszczędności', icon: 'fa-piggy-bank' },
]
</script>

<template v-if="!isLoading">
  <div class="min-h-screen bg-gray-50">
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <v-icon name="la-spinner-solid" scale="3" fill="orange" animation="spin" />
      <p class="text-gray-600">Ładowanie danych...</p>
    </div>
    <div v-else class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-orange">Planer Budżetu</h1>
        <p class="text-gray-600">Śledź swoje finanse i planuj przyszłość</p>
      </div>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Earnings Card -->
        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center mb-4">
            <v-icon name="io-wallet" scale="1.5" fill="orange" animation="pulse" class="mr-3" />
            <h2 class="text-xl font-semibold text-gray-800">Zarobki</h2>
          </div>
          <p class="text-3xl font-bold text-gray-800 mb-2">{{ totalIncome.toFixed(2) }}</p>
          <p class="text-gray-600">100% z zarobków</p>
        </div>
        <!-- Expenses Card -->
        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center mb-4">
            <v-icon
              name="fa-shopping-cart"
              scale="1.5"
              fill="orange"
              animation="pulse"
              class="mr-3"
            />
            <h2 class="text-xl font-semibold text-gray-800">Wydatki</h2>
          </div>
          <p class="text-3xl font-bold text-gray-800 mb-2">{{ totalExpense.toFixed(2) }}</p>
          <p
            class="text-gray-600"
            :class="expensesPercentage > 80 ? 'text-red-600' : 'text-gray-600'"
          >
            {{ expensesPercentage.toFixed(2) }}% z zarobków
          </p>
        </div>
        <!-- Savings Card -->
        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center mb-4">
            <v-icon name="fa-piggy-bank" scale="1.5" fill="orange" animation="pulse" class="mr-3" />
            <h2 class="text-xl font-semibold text-gray-800">Oszczędności</h2>
          </div>
          <p class="text-3xl font-bold text-gray-800 mb-2">{{ totalSaving.toFixed(2) }}</p>
          <p
            class="text-gray-600"
            :class="savingsPercentage > 10 ? 'text-yellow-600' : 'text-gray-600'"
          >
            {{ savingsPercentage.toFixed(2) }}% z zarobków
          </p>
        </div>
      </div>
      <!-- Charts Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Wykres Finansów</h2>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="w-full md:w-2/3" style="height: 400px">
            <FinancePieChart
              :incomes="totalIncome"
              :expenses="totalExpense"
              :savings="totalSaving"
            />
          </div>
          <div class="w-full md:w-1/3 mt-6 md:mt-0">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-800 mb-2">Podsumowanie</h3>
              <p class="text-gray-600">Twoje podsumowanie bugdżetu na dzień</p>
            </div>
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="bg-orange-medium w-4 h-4 rounded-full mr-3"></div>
                <div class="">
                  <p class="font-medium">Zarobki</p>
                  <p class="text-gray-600">{{ totalIncome.toFixed(2) }} zł</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="bg-orange-dark w-4 h-4 rounded-full mr-3"></div>
                <div class="">
                  <p class="font-medium">Wydatki</p>
                  <p class="text-gray-600">{{ totalExpense.toFixed(2) }} zł</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="bg-orange-light-medium w-4 h-4 rounded-full mr-3"></div>
                <div class="">
                  <p class="font-medium">Oszczędności</p>
                  <p class="text-gray-600">{{ totalSaving.toFixed(2) }} zł</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs section -->

      <div class="bg-white rounded-lg shadow-md">
        <div class="flex flex-wrap border-b border-gray-100">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'w-full sm:flex-1 py-4 px-6 text-center font-medium whitespace-nowrap cursor-pointer !rounded-button',
              activeTab === tab.id
                ? 'text-orange border-b-2 border-text-orange'
                : 'text-gray-600 hover:text-orange',
            ]"
          >
            <v-icon :name="tab.icon" class="inline-block mr-2" />
            {{ tab.name }}
          </button>
        </div>
        <!-- Tab Content -->

        <div :key="activeTab" class="p-6 animate-fadeIn" v-bind="$attrs">
          <!-- Earnings Tab -->
          <IncomeForm v-if="activeTab === 'earnings'" />
          <!-- Expenses Tab -->
          <ExpenseForm v-if="activeTab === 'expenses'" />
          <!-- Savings Tab -->
          <SavingForm v-if="activeTab === 'savings'" @saving-added="handleSavingAdded" />
        </div>
      </div>
    </div>
  </div>
</template>
