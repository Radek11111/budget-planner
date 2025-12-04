<script setup lang="ts">
import type { SavingGoal } from '@/types'
import Button from './ui/button/Button.vue'
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'
import { computed } from 'vue'

const props = defineProps<{
  goal: SavingGoal & {
    process?: number
    remainingAmount?: number
    isCompleted?: boolean
  }
  icon?: string
}>()

const emit = defineEmits<{
  edit: [goal: SavingGoal]
}>()

const formattedDeadline = computed(() => {
  if (!props.goal.deadline) return 'Brak terminu'
  return new Date(props.goal.deadline).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const progress = computed(() => {
  return props.goal.process
    ? Math.round(props.goal.process)
    : Math.round((props.goal.currentAmount / props.goal.targetAmount) * 100)
})

const remainingAmount = computed(() => {
  return props.goal.remainingAmount ?? props.goal.targetAmount - props.goal.currentAmount
})

const monthly = computed(() => {
  if (!props.goal.deadline || remainingAmount.value <= 0) return 0

  const now = new Date()
  const deadline = new Date(props.goal.deadline)

  let diffMonths = (deadline.getFullYear() - now.getFullYear()) * 12
  diffMonths += deadline.getMonth() - now.getMonth()

  if (deadline.getDate() < now.getDate()) {
    diffMonths--
  }

  if (diffMonths <= 0) return remainingAmount.value
  return Math.ceil(remainingAmount.value / diffMonths)
})
</script>
<template>
  <Card>
    <CardContent class="space-y-4">
      <h2 class="text-xl font-semibold">Nowy Cel Oszczędnościowy</h2>
      <div
        class="w-full max-w-[350px] bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200"
      >
        <div class="">
          <div class="">icona</div>
          <div class="">
            <h2>{{ goal.name }}</h2>
            <p></p>
          </div>
          <div class="">
            <p>Postęp</p>
            <span>{{ progress }}</span>
          </div>
          <div class="">
            <p>Zaoszczędzono:</p>
            <span>{{ goal.currentAmount }}</span>
          </div>
          <div class="">
            <p>Cel:</p>
            <span>{{ goal.targetAmount }}</span>
          </div>
          <div class="">
            <p>Pozostało:</p>
            <span>{{ remainingAmount }}</span>
          </div>
          <div class="">
            <p>Termin:</p>
            <span>{{ formattedDeadline }}</span>
          </div>
          <div class="">
            <p>Miesięcznie:</p>
            <span>{{ monthly }}</span>
          </div>
          <div class="">
            <p>Dziennie:</p>
            <span>kwota</span>
          </div>
          <div class="">
            <Button> Edytuj</Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
