<script setup lang="ts">
import { useExpenseStore } from '@/stores/expenseStore'
import { computed } from 'vue'
import dayjs from 'dayjs'
import { Card, CardContent } from '@/components/ui/card'
import { categoryStyles, type ExpenseCategory } from '../../constants/categories'

const expenseStore = useExpenseStore()

const recentTransactions = computed(() => {
  return [...expenseStore.yearlyExpenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
})
function getCategoryStyle(category: string) {
  return categoryStyles[category as ExpenseCategory]
}
</script>

<template>
  <Card class="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
    <CardContent class="p-5">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Ostatnie transakcje</h2>

      <ul class="divide-y divide-gray-100">
        <li
          v-for="(transaction, index) in recentTransactions"
          :key="index"
          class="flex items-center justify-between py-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 flex items-center justify-center rounded-full shrink-0"
              :class="getCategoryStyle(transaction.category).color || 'bg-gray-100 text-gray-500'"
            >
              <component :is="getCategoryStyle(transaction.category).icon" class="w-4 h-4" />
            </div>

            <div>
              <p class="text-sm font-medium text-gray-800">
                {{ transaction.category }}
              </p>
              <p class="text-xs text-gray-400">
                {{ dayjs(transaction.date).format('DD MMM YYYY') }}
              </p>
            </div>
          </div>

          <p class="text-sm font-semibold text-red-500">-{{ transaction.amount.toFixed(2) }} zł</p>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
