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
  return Math.max(0, (targetAmount.value ?? 0) - (currentAmount.value ?? 0))
})

const daysRemaining = computed(() => {
  if (!deadline.value) return 0
  const deadlineDate = new Date(deadline.value)
  const now = new Date()
  deadlineDate.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
})

const monthsRemaining = computed(() => {
  if (!deadline.value) return 0

  const deadlineDate = new Date(deadline.value)
  const now = new Date()

  let months = (deadlineDate.getFullYear() - now.getFullYear()) * 12
  months += deadlineDate.getMonth() - now.getMonth()

  if (deadlineDate.getDate() < now.getDate()) {
    months--
  }
  return Math.max(0, months)
})

const monthlyAmount = computed(() => {
  if (monthsRemaining.value === 0) return remainingAmount.value
  return Math.ceil(remainingAmount.value / monthsRemaining.value)
})

const dailyAmount = computed(() => {
  if (daysRemaining.value === 0) return remainingAmount.value
  return Math.ceil(remainingAmount.value / daysRemaining.value)
})

const progressPercentage = computed(() => {
  const target = targetAmount.value ?? 0
  if (target <= 0) return 0
  const current = currentAmount.value ?? 0
  return Math.min(100, Math.round((current / target) * 100))
})

const canCalculate = computed(() => {
  return goalName.value && targetAmount.value > 0 && deadline.value
})

const calculate = () => {
  if (canCalculate.value) {
    showResults.value = true
  }
}

watch([targetAmount, deadline, currentAmount, goalName], () => {
  if (showResults.value) {
    showResults.value = false
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
    <div class="">
      <Card>
        <CardContent class="p-6">
          <div class="flex justify-between">
            <h2 class="text-xl font-semibold">Kalkulator celu oszczędnościowego</h2>
            <div class="flex items-end justify-end">
              <v-icon name="io-calculator" fill="#f57c00" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-10 mt-6">
            <!-- Left form -->
            <div class="space-y-5">
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-600"> Nazwa celu</label>

                <input
                  type="text"
                  placeholder="Np.Wakacje, nowy telefon"
                  class="w-full border rounded-lg px-3 py-2"
                  v-model="goalName"
                />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-600 font-medium">Cel oszczędnościowy</label>
                <div class="flex items-center border rounded-lg px-3 bg-white">
                  <input
                    type="number"
                    class="w-full py-2 outline-none"
                    v-model.number="targetAmount"
                    placeholder="Np. 12000"
                  />
                  <span class="text-gray-500 mr-2">zł</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm text-gray-600 font-medium"> Data docelowa</label>

                <input
                  type="date"
                  placeholder="Np.10000"
                  class="w-full border rounded-lg px-3 py-2"
                  v-model="deadline"
                />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-600 font-medium">Już zaoszczędzone</label>
                <div class="flex items-center border rounded-lg px-3 bg-white">
                  <input
                    type="number"
                    class="w-full py-2 outline-none"
                    v-model.number="currentAmount"
                    placeholder="Np. 0"
                  />
                  <span class="text-gray-500 mr-2">zł</span>
                </div>
              </div>
              <Button
                @click="calculate"
                :disabled="!canCalculate"
                variant="default"
                class="w-full py-3 gradient-btn text-gray-700 font-medium rounded-lg shadow-sm cursor-pointer"
                >Oblicz plan oszczędzania</Button
              >
            </div>

            <!-- Right result display -->
            <div
              v-if="!showResults"
              class="flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border border-orange-100"
            >
              <h3 class="text-center text-lg text-gray-600">
                Wprowadź dane, aby zobaczyć swój plan oszczędzania
              </h3>
            </div>
            <div
              class="p-6 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border border-orange-100 rounded-xl"
              v-else
            >
              <div class="flex flex-col items-center text-center space-y-2">
                <h3 class="text-lg font-semibold mb-1">Twój plan oszczędzania:</h3>
                <p class="text-sm text-gray-600 mb-6">Do celu pozostało {{ daysRemaining }}</p>
              </div>

              <div class="p-4 bg-white rounded-lg">
                <p class="text-xs text-gray-500">Pozostało do zaoszczędzenia</p>
                <p class="text-xl font-bold text-orange-dark">{{ remainingAmount }} zł</p>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="p-4 bg-white rounded-lg">
                  <p class="text-xs text-gray-500">Miesięcznie</p>
                  <p class="text-xl font-bold text-orange-dark">{{ monthlyAmount }} zł</p>
                </div>

                <div class="p-4 bg-white rounded-lg">
                  <p class="text-xs text-gray-500">Dziennie</p>
                  <p class="text-xl font-bold text-orange-dark">{{ dailyAmount }} zł</p>
                </div>

                <div class="p-4 bg-white rounded-lg col-span-2">
                  <div class="flex justify-between mb-1">
                    <p class="text-xs text-gray-500 mb-1">Postęp</p>
                    <p class="text-right text-sm mt-1 text-gray-500">{{ progressPercentage }}%</p>
                  </div>

                  <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-orange-400"
                      :style="{ width: progressPercentage + '%' }"
                    ></div>
                  </div>
                </div>
            </div>
            <Button
              class="w-full py-3 gradient-btn text-gray-700 font-medium rounded-lg shadow-sm cursor-pointer mt-4"
            >
            </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
