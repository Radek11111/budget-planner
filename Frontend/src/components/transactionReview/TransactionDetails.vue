<template>
  <ul class="space-y-1">
    <li v-if="data.income" class="text-green-600">+{{ data.income }} zł — Przychód</li>
    <li v-if="data.expense" class="text-red-500">-{{ data.expense }} zł — Wydatek</li>
    <li v-if="data.saving" class="text-blue-500">{{ data.saving }} zł — Oszczędności</li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{ data: { income: number; expense: number; saving: number } }>()
</script>
