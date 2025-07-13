<template>
  <form @submit.prevent="handleSubmit" class="mb-8">
    <h2 class="tex-xl font-semibold text-gray-800 mb-6">Dodaj Zarobki</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="">
        <label for="earningDate" class="block text-gray-700 mb-2">Data</label>
        <input
          type="date"
          id="earningDate"
          v-model="date"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
        />
      </div>
      <div class="">
        <label for="earningAmount" class="block text-gray-700 mb-2">Kwota (zł)</label>
        <input
          type="number"
          id="earningAmount"
          v-model="amount"
          required
          min="0.01"
          step="0.01"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
        />
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="">
        <label for="earningCategory" class="block text-gray-700 mb-2">Kategoria</label>
        <div class="relative">
          <select
            id="earningCategory"
            v-model="category"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
          >
            <option value="" disabled>Wybierz kategorie</option>
            <option v-for="category in earningCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items center px-2 text-gray-700 items-center"
          >
            <v-icon name="la-angle-double-down-solid" scale="1" fill="#FFB347" animation="float" />
          </div>
        </div>
      </div>
      <div class="">
        <label for="earningDescription" class="block text-gray-700 mb-2">Opis</label>
        <input
          type="text"
          id="earningDescription"
          v-model="description"
          placeholder="Krótki opis"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
        />
      </div>
    </div>
    <button
      type="submit"
      class="bg-[#FFB347] text-white py-2 px-6 rounded-lg hover:bg-[#FFA533] transition-colors cursor-pointer whitespace-nowrap !rounded-button"
    >
      <v-icon name="px-plus" scale="1.5" animation="pulse" hover />
    </button>
  </form>
  <!-- Recent Earnings -->
  <h3 class="text-lg font-semibold text-gray-800 mb-4">Ostatnie zarobki</h3>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white">
      <thead>
        <tr class="bg-gray-100 text-gray-700">
          <th class="py-3 px-4 text-left">Data</th>
          <th class="py-3 px-4 text-left">Kategoria</th>
          <th class="py-3 px-4 text-left">Opis</th>
          <th class="py-3 px-4 text-left">Kwota</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in localEarnings" :key="index" class="border-b border-gray-200">
          <td class="py-3 px-4">
            {{ new Date(item.date).toISOString().split('T')[0] }}
          </td>

          <td class="py-3 px-4">
            {{ item.category }}
          </td>
          <td class="py-3 px-4">
            {{ item.description }}
          </td>
          <td class="py-3 px-4">
            {{ item.amount.toFixed(2) }}
            zł
          </td>
        </tr>
        <tr v-if="localEarnings.length === 0">
          <td colspan="4" class="py-4 text-center text-gray-500">
            Nie odnotowano jeszcze żadnych zarobków.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { Income } from '@/types'
import { ref } from 'vue'
import { useBudgetService } from '../../api/budgetService'
import { earningCategories } from '@/constants/categories'
const emit = defineEmits<{
  (e: 'added', value: Income): void
}>()

const date = ref('')
const amount = ref<number | null>(null)
const description = ref('')
const category = ref('')
const { addIncome } = useBudgetService()
const localEarnings = ref<Income[]>([])

const handleSubmit = async () => {
  if (!date.value || amount.value === null || !category.value || !description.value) return

  const newIncome: Income = {
    date: new Date(date.value).toISOString(),
    amount: amount.value,
    category: category.value,
    description: description.value,
  }

  try {
    await addIncome(newIncome)
    localEarnings.value.unshift(newIncome) 
    emit('added', newIncome)

    // Reset
    date.value = ''
    amount.value = null
    category.value = ''
    description.value = ''
  } catch (e) {
    console.error('Błąd przy dodawaniu przychodu', e)
  }
}
</script>
