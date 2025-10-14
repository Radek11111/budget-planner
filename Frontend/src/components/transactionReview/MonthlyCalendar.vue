<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps<{
  year: number
  month: number
  dailySummary: Record<number, { income: number; expense: number; saving: number }>
}>()

const daysInMonth = computed(() => {
  return new Date(props.year, props.month, 0).getDate()
})

watch(
  () => props.dailySummary,
  (val) => {

  },
  { deep: true },
)
</script>
<template>
  <div class="grid grid-cols-4 gap-3 mt-4 ">
    <div v-for="day in daysInMonth" :key="day" class="p-2 border rounded text-center flex flex-col items-center leading-tight min-h-[3rem]">
      <div class="font-bold">{{ day }}</div>
      <div v-if="props.dailySummary[day]">
        <p class="text-green-500" v-if="props.dailySummary[day].income">
          +{{ props.dailySummary[day].income }} zł
        </p>
        <p class="text-red-500" v-if="props.dailySummary[day].expense">
          -{{ props.dailySummary[day].expense }}
        </p>
        <p class="text-blue-500" v-if="props.dailySummary[day].saving">
          {{ props.dailySummary[day].saving }}
        </p>
      </div>
    </div>
  </div>
</template>
