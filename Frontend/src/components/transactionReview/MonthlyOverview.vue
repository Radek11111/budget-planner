<script setup lang="ts">
import { useExpenseStore } from '@/stores/expenseStore'
import { useIncomeStore } from '@/stores/incomeStore'
import { useSavingStore } from '@/stores/savingStore'
import { computed, onMounted, ref } from 'vue'
import MonthTabs from '../transactionReview/MonthTabs.vue'
import MonthlyCalendar from '../transactionReview/MonthlyCalendar.vue'

type TransactionType = 'income' | 'expense' | 'saving'

interface Transaction {
  date: string
  type: TransactionType
  amount: number
}

const incomeStore = useIncomeStore()
const expenseStore = useExpenseStore()
const savingStore = useSavingStore()

const selectedMonth = ref(new Date().getMonth())
const selectedYear = ref(new Date().getFullYear())

onMounted(async () => {
  await Promise.all([
    incomeStore.fetchIncomes(),
    expenseStore.fetchExpenses(),
    savingStore.fetchSavings(),
  ])
})

const allTransactions = computed(() => [
  ...incomeStore.incomes.map((income) => ({
    date: income.date,
    type: 'income',
    amount: income.amount,
  })),
  ...expenseStore.expenses.map((expense) => ({
    date: expense.date,
    type: 'expense',
    amount: expense.amount,
  })),
  ...savingStore.savings.map((saving) => ({
    date: saving.date,
    type: 'saving',
    amount: saving.amount,
  })),
])

const monthlyTransactions = computed(() =>
  allTransactions.value.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    return (
      transactionDate.getMonth() === selectedMonth.value &&
      transactionDate.getFullYear() === selectedYear.value
    )
  }),
)

const dailySummary = computed(() => {
  const result: Record<number, { income: number; expense: number; saving: number }> = {}
  ;(monthlyTransactions.value as Transaction[]).forEach((transaction) => {
    const day = new Date(transaction.date).getDate()
    if (!result[day]) {
      result[day] = { income: 0, expense: 0, saving: 0 }
    }
    result[day][transaction.type] += transaction.amount
  })
  return result
})
</script>
<template>
  <div class="p-4">
    <MonthTabs v-model:selectedMonth="selectedMonth" v-model:selectedYear="selectedYear" />
    <MonthlyCalendar :year="selectedYear" :month="selectedMonth" :dailySummary="dailySummary" />
  </div>
</template>
