<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Button } from './ui/button'
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'

import { useSavingGoalStore } from '@/stores/savingGoalStore'
const store = useSavingGoalStore()

// Form state
const targetAmount = ref(0)
const deadline = ref('')
const currentAmount = ref(0)
const showResults = ref(false)
const goalName = ref('')

// Computed results
const remainingAmount = computed(() => {
  return Math.max(0, targetAmount.value - currentAmount.value)
})

const daysRemaining = computed(() => {
  if (!deadline.value) return 0
  const deadlineDate = new Date(deadline.value)
  const now = new Date()
  const diffTime = deadlineDate.getDate() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
})

const monthsRemaining = computed(() => {
  if (!deadline.value) return 0
  const deadlineDate = new Date(deadline.value)
  const now = new Date()
  let months =
    (deadlineDate.getFullYear() - now.getFullYear()) * 12 +
    (deadlineDate.getMonth() - now.getMonth())
  return Math.max(1, months)
})

const monthlyAmount = computed(() => {
  if (monthsRemaining.value === 0) return 0
  return Math.ceil(remainingAmount.value / monthsRemaining.value)
})

const dailyAmount = computed(() => {
  if (daysRemaining.value === 0) return 0
  return Math.ceil(remainingAmount.value / daysRemaining.value)
})

const progressPercentage = computed(() => {
  if (targetAmount.value <= 0) return 0
  return Math.min(100, Math.round((currentAmount.value / targetAmount.value) * 100))
})

const canCalculate = computed(() => {
  return goalName.value && targetAmount.value > 0 && deadline.value
})

watch([targetAmount, deadline, currentAmount], () => {
  if (showResults.value) {
  }
})
</script>
<template>
  <div class="space-y-8">
    <!-- Goal Grid -->
    <Card>
      <CardContent class="space-y-4">
        <h2 class="text-xl font-semibold">Nowy Cel Oszczędnościowy</h2>
      </CardContent>
    </Card>

    <!-- Saving calculator section -->
    <Card>
      <CardContent class="p-6">
        <h2 class="text-xl font-semibold mb-4">Kalkulator celu oszczędnościowego</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Left form -->
          <div class="space-y-4">
            <div class="">
              <label class="text-sm font-semibold"> Nazwa celu</label>

              <input
                type="text"
                placeholder="Np.Wakacje, nowy telefon"
                class="w-full border rounded-lg px-3 py-2"
                v-model="goalName"
              />
            </div>
            <div class="">
              <label class="text-sm font-semibold"> Cel oszczędnościowy</label>

              <input
                type="number"
                placeholder="Np.10000"
                class="w-full border rounded-lg px-3 py-2"
                v-model="targetAmount"
              />
            </div>
            <div class="">
              <label class="text-sm font-semibold"> Data docelowa</label>

              <input
                type="date"
                placeholder="Np.10000"
                class="w-full border rounded-lg px-3 py-2"
                v-model="deadline"
              />
            </div>
            <div class="">
              <label class="text-sm font-semibold">Już zaoszczędzone</label>

              <input
                type="number"
                placeholder="Np.2000"
                class="w-full border rounded-lg px-3 py-2"
                v-model="currentAmount"
              />
            </div>
            <Button
              @click="showResults = true"
              variant="default"
              class="bg-orange-dark text-white hover:bg-orange-medium"
              >Oblicz plan oszczędzania</Button
            >
          </div>

          <!-- Right result display -->
          <div
            v-if="!showResults"
            class="flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border border-orange-100"
          >
            <h3 class="text-gray-500 text-center">
              Wprowadź dane, aby zobaczyć swój plan oszczędzania
            </h3>
          </div>
          <div class="" v-else="showResults">
            <div class="">
              <h3>Twój plan oszczędzania:</h3>
              <div class="">
                <p>Pozostało dni:</p>
                <span>{{ daysRemaining }}</span>
              </div>
              <div class="">
                <p>Miesięcy pozostało:</p>
                <span>{{ monthsRemaining }}</span>
              </div>
              <div class="">
                <p>Pozostało do zaoszczędzenia:</p>
                <span>{{ remainingAmount }}</span>
              </div>
              <div class="">
                <p>Miesięcznie trzeba odłożyć:</p>
                <span>{{ monthlyAmount }}</span>
              </div>
              <div class="">
                <p>Dziennie trzeba odłożyć:</p>
                <span>{{ dailyAmount }}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
