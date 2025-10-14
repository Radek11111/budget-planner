<script setup lang="ts">
import { useExpenseStore } from '@/stores/expenseStore'
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Legend, Title, Tooltip)

const expenseStore = useExpenseStore()

const categoryData = computed(() => {
  const grouped: Record<string, number> = {}
  expenseStore.yearlyExpenses.forEach((expense) => {
    const category = expense.category || 'Inne'
    grouped[category] = (grouped[category] || 0) + expense.amount
  })
  return grouped
})

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: Object.keys(categoryData.value),
  datasets: [
    {
      backgroundColor: ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#c084fc', '#f472b6'],
      data: Object.values(categoryData.value),
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 10,
    },
  ],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '40%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 20,
        color: '#374151',
        font: { size: 13 },
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = context.parsed || 0
          return `${label}: ${value.toFixed(2)} zł`
        },
      },
    },
  },
}
</script>
<template>
  <div class="p-4 bg-white md:border-l-1 ">
    <h2 class="text-lg font-semibold text-gray-800 mb-3">Kategorie wydatków</h2>
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
