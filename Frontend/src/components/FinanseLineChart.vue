<script setup lang="ts">
import { onMounted, computed, unref } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useExpenseStore } from '../stores/expenseStore'
import dayjs from 'dayjs'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend)

const expenseStore = useExpenseStore()

const getMonthlyExpenses = () => {
  const monthlyData = expenseStore.expenses.reduce((acc: Record<string, number>, expense) => {
    const month = dayjs(expense.date).format('YYYY-MM');
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  // Sortowanie danych po dacie (miesiącu)
  const sortedMonths = Object.keys(monthlyData).sort();

  return sortedMonths.map(month => ({
    label: dayjs(month).format('MMM'), // Format miesiąca np. "Sty", "Lut" dzięki ustawionemu locale
    value: monthlyData[month]
  }));
};
const monthlyExpenses = computed(() => getMonthlyExpenses());
onMounted(() => {
  expenseStore.fetchExpenses()
})

const expenseValues = computed(() =>
  expenseStore.expenses.length ? expenseStore.expenses.map((e) => e.amount) : [],
)

const expenseLabels = computed(() =>
  expenseStore.expenses.length
    ? expenseStore.expenses.map((e) => dayjs(e.date).format('YYYY-MM'))
    : [],
)

const chartData = computed<ChartData<'line'>>(() => ({
  labels: expenseLabels.value,
  datasets: [
    {
      label: 'Wydatki',
      data: expenseValues.value,
      borderColor: '#f87917',
      backgroundColor: 'rgba(248, 121, 23, 0.2)',
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
