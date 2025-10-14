<script setup lang="ts">
import { MonthsLabels } from '@/constants/monthLabels'
const props = defineProps<{ selectedMonth: number }>()
const emit = defineEmits<{ (e: 'update:selectedMonth', value: number): void }>()
</script>
<template>
  <div class="">
    <button
      v-for="(label, index) in MonthsLabels"
      :key="index"
      @click="emit('update:selectedMonth', index + 1)"
      :class="[
        'px-4 py-2 rounded cursor-pointer ',
        props.selectedMonth === index + 1 ? 'bg-blue-50 text-blue-500 border-b-2 border-blue-500 shadow-sm' : 'bg-white',
      ]"
    >
      {{ label }}
    </button>
  </div>
</template>
