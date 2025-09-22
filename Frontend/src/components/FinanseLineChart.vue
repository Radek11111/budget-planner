<script setup lang="ts">
import { onMounted, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useExpenseStore } from '../stores/expenseStore'
import dayjs from 'dayjs'
import { MonthsLabels } from '@/constants/monthLabels'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler)

const expenseStore = useExpenseStore()


const getYearlyExpenses = () => {
  const monthlyTotals: number[] = new Array(12).fill(0)

  expenseStore.expenses.forEach((expense) => {
    const monthIndex = dayjs(expense.date).month() 
    monthlyTotals[monthIndex] += expense.amount
  })

  return monthlyTotals
}

onMounted(() => {
  expenseStore.fetchExpenses()
})

const expenseValues = computed(() => getYearlyExpenses())



const chartData = computed<ChartData<'line'>>(() => ({
  labels: MonthsLabels,
  datasets: [
    {
      label: 'Wydatki',
      data: expenseValues.value,
      borderColor: '#f87917',
      backgroundColor: 'rgba(255, 127, 80, 0.1)', 
      borderWidth: 2,
      pointBackgroundColor: '#f87917',
      tension: 0.4,
      fill: true, 
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y.toFixed(2)} zł`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { callback: (value) => `${value} zł` },
    },
  },
}
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>
