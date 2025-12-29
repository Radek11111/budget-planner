<script setup lang="ts">
import type { SavingGoal, SavingGoalView } from '@/types'
import Button from '../ui/button/Button.vue'
import Card from '../ui/card/Card.vue'
import CardContent from '../ui/card/CardContent.vue'
import { computed } from 'vue'



const props = defineProps<{
  goal: SavingGoalView
  icon?: string
}>()

const emit = defineEmits<{
  edit: [goal: SavingGoal]
}>()

const formattedDeadline = computed(() =>
  props.goal.deadline ? new Date(props.goal.deadline).toLocaleDateString('pl-PL') : 'Brak terminu',
)



</script>
<template>
  <Card>
    <CardContent
      class="space-y-5 bg-gradient-to-tl from-orange-50 via-orange-100 to-orange-200 border rounded-xl p-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-200 text-xl"
          >
            🎯
          </div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ goal.name }}
          </h2>
        </div>

        <Button size="sm" variant="outline" @click="emit('edit', goal)"> Edytuj </Button>
      </div>

      <!-- Progress -->
      <div class="space-y-1">
        <div class="flex justify-between text-sm text-gray-600">
          <span>Postęp</span>
          <span class="font-medium text-gray-900"> {{ goal.progress }}% </span>
        </div>

        <div class="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            class="h-full bg-orange-500 transition-all duration-500"
            :style="{ width: `${goal.progress}%` }"
          />
        </div>
      </div>

      <!-- Amounts grid -->
      <div class="grid grid-cols-1 gap-4 text-sm">
        <div class="flex justify-between">
          <p class="text-gray-800">Zaoszczędzono:</p>
          <p class="text-lg font-semibold text-gray-900">{{ goal.currentAmount.toFixed(2) }} zł</p>
        </div>

        <div class="flex justify-between">
          <p class="text-gray-800">Cel:</p>
          <p class="text-lg font-semibold text-gray-900">{{ goal.targetAmount.toFixed(2) }} zł</p>
        </div>

        <div class="flex justify-between">
          <p class="text-gray-500">Pozostało</p>
          <p class="text-lg font-semibold text-orange-darker">
            {{ goal.remainingAmount.toFixed(2) }} zł
          </p>
        </div>

        <div class="flex justify-between">
          <p class="text-gray-800">Termin:</p>
          <p class="font-medium text-gray-900">
            {{ formattedDeadline }}
          </p>
        </div>

        <div class="flex justify-between">
          <p class="text-sm text-gray-600">Miesięcznie</p>
          <p class="text-lg font-semibold text-orange-darker">
            {{ goal.monthlyAmount.toFixed(2) }} zł
          </p>
        </div>

        <div class="flex justify-between">
          <p class="text-sm text-gray-600">Dziennie</p>
          <p class="text-lg font-semibold text-orange-darker">
            {{ goal.dailyAmount.toFixed(2) }} zł
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
