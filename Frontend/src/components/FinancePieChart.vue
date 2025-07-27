<script setup lang="ts">
import { defineProps, watch } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Legend, Title, Tooltip)

const props = defineProps<{
  incomes: number
  expenses: number
  savings: number
  income?: number 
}>()

const total = props.income ?? props.incomes
const expenses = props.expenses
const savings = props.savings

const chartData: ChartData<'doughnut'> = {
  labels: ['Zarobki', 'Wydatki', 'Oszczędności'],
  datasets: [
    {
      label: 'Budżet',
      backgroundColor: ['#ffb347', '#f87917', '#fdbe74'],
      data: [total, expenses, savings],
      borderColor: '#ffffff',
      borderWidth: 2,
      borderRadius: 10,
      hoverOffset: 10,
    },
  ],
}
watch(props, () => {
  chartData.datasets[0].data = [props.incomes, props.expenses, props.savings]
})

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '40%',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = context.parsed
          const total = props.incomes
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value.toFixed(2)} zł (${percentage}%)`
        },
      },
    },
  },
}
</script>

<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>
