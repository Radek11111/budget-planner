<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { HoverCard } from '../ui/hover-card'
import HoverCardTrigger from '../ui/hover-card/HoverCardTrigger.vue'
import HoverCardContent from '../ui/hover-card/HoverCardContent.vue'
import Dialog from '../ui/dialog/Dialog.vue'
import DialogContent from '../ui/dialog/DialogContent.vue'
import Button from '../ui/button/Button.vue'
import TransactionDetails from './TransactionDetails.vue'

const props = defineProps<{
  year: number
  month: number
  dailySummary: Record<number, { income: number; expense: number; saving: number }>
}>()

const isDialogOpen = computed({
  get: () => selectedDay.value !== null,
  set: (val: boolean) => {
    if (!val) selectedDay.value = null
  },
})

const selectedDay = ref<number | null>(null)
const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
})
const daysInMonth = computed(() => {
  return new Date(props.year, props.month, 0).getDate()
})

const hasTransactions = (day: number) => !!props.dailySummary[day]
</script>
<template>
  <!-- Desktop -->

  <div class="grid grid-cols-7 gap-2 sm:gap-3 mt-4">
    <div
      v-for="day in daysInMonth"
      :key="day"
      class="relative aspect-square w-full flex flex-col items-center justify-between p-2 rounded-xl border transition-all duration-200"
      :class="[
        hasTransactions(day)
          ? 'border-red-300 bg-red-50 hover:bg-red-100'
          : 'border-gray-200 bg-white hover:bg-gray-50',
        'cursor-pointer',
      ]"
      @click="isMobile && hasTransactions(day) ? (selectedDay = day) : null"
    >
      <div class="font-semibold text-gray-800">{{ day }}</div>

      <!-- Desktop hover card -->

      <HoverCard v-if="!isMobile && hasTransactions(day)">
        <HoverCardTrigger as-child>
          <div class="absolute inset-0"></div>
        </HoverCardTrigger>
        <HoverCardContent class="w-48 text-sm">
          <h4 class="font-semibold mb-1 text-gray-800">Dzień {{ day }}</h4>
          <TransactionDetails :data="props.dailySummary[day]" />
        </HoverCardContent>
      </HoverCard>
    </div>
  </div>

  <!-- Mobile -->
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="sm:max-w-[350px] rounded-xl">
      <h3 class="font-semibold text-gray-800 text-lg mb-2">Dzień {{ selectedDay }}</h3>

      <div v-if="selectedDay && props.dailySummary[selectedDay]" class="space-y-2 text-sm">
        <TransactionDetails
          v-if="selectedDay && props.dailySummary[selectedDay]"
          :data="props.dailySummary[selectedDay]"
        />
      </div>

      <div class="mt-4 flex justify-end">
        <Button variant="outline" size="sm" @click="selectedDay = null">Zamknij</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
