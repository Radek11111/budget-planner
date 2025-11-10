<script setup lang="ts">
import type { Expense } from '@/types'
import { onMounted, ref } from 'vue'
import { expenseCategories } from '@/constants/categories'
import Swal from 'sweetalert2'
import { useExpenseStore } from '../../stores/expenseStore'
import ReceiptUploader from '../ReceiptUploader.vue'
import { useOcrParser } from '@/composabes/useOcrParser'
import { formatDate } from '../../utils/dateFormatter'
import { useSprending } from '@/composabes/useSprending'

const date = ref('')
const amount = ref<number | null>(null)
const description = ref('')
const category = ref('')
const { handleOcrParsed } = useOcrParser()
const { useSprendingDelete, showSuccess, showError } = useSprending()

const store = useExpenseStore()
onMounted(() => {
  store.fetchMonthlyExpenses()
})

const handleSubmit = async () => {
  if (!date.value || amount.value === null || !description.value || !category.value) return
  const newExpense: Expense = {
    id: '',
    date: new Date(date.value).toISOString(),
    amount: amount.value,
    description: description.value,
    category: category.value,
  }
  try {
    await store.addNewExpense(newExpense)

    // Reset
    date.value = ''
    amount.value = 0
    description.value = ''
    category.value = ''
  } catch (e) {
    console.error('Błąd podczas dodawania wydatku:', e)
    alert('Wystąpił błąd podczas dodawania wydatku. Spróbuj ponownie.')
  }
}
const handleDelete = async (id: string) => {
  const result = await useSprendingDelete()
  if (result.isConfirmed) {
  }
  try {
    await store.removeExpense(id)
    showSuccess()
  } catch (e) {
    showError()
    console.error('Błąd przy usuwaniu wydatku', e)
  }
}
</script>
<template>
  <form class="mb-8" @submit.prevent="handleSubmit">
    <h2 class="tex-xl font-semibold text-gray-800 mb-6">Dodaj Wydatki</h2>

    <div class="flex items-center gap-4 mb-6">
      <ReceiptUploader @Parsed="handleOcrParsed" />
      <span class="text-gray-600">Lub wprowadź ręcznie</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="">
        <label for="expenseDate" class="block text-gray-700 mb-2">Data</label>
        <input
          type="date"
          id="expenseDate"
          v-model="date"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
        />
      </div>
      <div class="">
        <label for="expenseAmount" class="block text-gray-700 mb-2">Kwota (zł)</label>
        <input
          type="number"
          id="expenseAmount"
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
        <label for="expenseCategory" class="block text-gray-700 mb-2">Kategoria</label>
        <div class="relative">
          <select
            id="expenseCategory"
            v-model="category"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
          >
            <option value="" disabled>Wybierz kategorie</option>
            <option v-for="category in expenseCategories" :key="category" :value="category">
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
        <label for="expenseDescription" class="block text-gray-700 mb-2">Opis</label>
        <input
          type="text"
          id="expenseDescription"
          v-model="description"
          placeholder="Krótki opis"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
        />
      </div>
    </div>
    <div class="flex items-center gap-4 mb-6">
      <button
        type="submit"
        class="bg-[#FFB347] text-white py-2 px-6 rounded-lg hover:bg-[#FFA533] transition-colors cursor-pointer whitespace-nowrap !rounded-button"
      >
        <v-icon name="px-plus" scale="1" animation="pulse" hover />
      </button>
    </div>
  </form>
  <!-- Recent Expenses -->
  <h3 class="text-lg font-semibold text-gray-800 mb-4">Ostatnie wydatki</h3>
  <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
    <div v-if="store.isLoading" class="p-4">Ładowanie...</div>
    <div v-else-if="store.error" class="p-4 text-red-500">{{ store.error }}</div>
    <table class="w-full min-w-[700px] bg-white text-sm">
      <thead>
        <tr class="bg-gray-100 text-gray-700">
          <th class="py-3 px-4 text-left whitespace-nowrap">Data</th>
          <th class="py-3 px-4 text-left whitespace-nowrap">Kategoria</th>
          <th class="py-3 px-4 text-left">Opis</th>
          <th class="py-3 px-4 text-left whitespace-nowrap">Kwota</th>
          <th class="py-3 px-4 text-left whitespace-nowrap">Akcja</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="expense in store.monthlyExpenses"
          :key="expense.id"
          class="border-b border-gray-200"
        >
          <td class="py-3 px-4 whitespace-nowrap">
            {{ formatDate(expense.date) }}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            {{ expense.category }}
          </td>
          <td class="py-3 px-4">
            {{ expense.description }}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">{{ expense.amount.toFixed(2) }} zł</td>
          <td class="py-3 px-4 whitespace-nowrap">
            <v-icon
              name="fa-trash-alt"
              scale="1.2"
              fill="red"
              class="cursor-pointer hover:scale-125 transition-transform"
              @click="handleDelete(expense.id)"
            />
          </td>
        </tr>
        <tr v-if="store.monthlyExpenses?.length === 0">
          <td colspan="4" class="py-4 text-center text-gray-500">
            Nie odnotowano jeszcze żadnych wydatków.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
