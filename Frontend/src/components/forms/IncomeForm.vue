<template>
  <form @submit.prevent="handleSubmit" class="mb-8">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">Dodaj Zarobki</h2>
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
            class="pointer-events-none absolute inset-y-0 right-0 flex px-2 text-gray-700 items-center"
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
          v-for="income in store.monthlyIncomes"
          :key="income.id"
          class="border-b border-gray-200"
        >
          <td class="py-3 px-4 whitespace-nowrap">
            {{ formatDate(income.date) }}
          </td>

          <td class="py-3 px-4 whitespace-nowrap">
            {{ income.category }}
          </td>
          <td class="py-3 px-4">
            {{ income.description }}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            {{ income.amount.toFixed(2) }}
            zł
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            <v-icon
              name="fa-trash-alt"
              scale="1.2"
              fill="red"
              class="cursor-pointer hover:scale-125 transition-transform"
              @click="handleDelete(income.id)"
            />
          </td>
        </tr>
        <tr v-if="store.monthlyIncomes?.length === 0">
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
import { onMounted, ref } from 'vue'
import { earningCategories } from '@/constants/categories'
import Swal from 'sweetalert2'
import { useIncomeStore } from '@/stores/incomeStore'

const date = ref('')
const amount = ref<number | null>(null)
const description = ref('')
const category = ref('')

const store = useIncomeStore()

onMounted(() => {
  store.fetchMonthlyIncomes()
  console.log('Fetched yearly incomes', store.yearlyIncomes)
})

const handleSubmit = async () => {
  if (!date.value || amount.value === null || !category.value || !description.value) return

  const newIncome: Income = {
    id: '',
    date: new Date(date.value).toISOString(),
    amount: amount.value,
    category: category.value,
    description: description.value,
  }

  try {
    await store.addNewIncome(newIncome)

    // Reset
    date.value = ''
    amount.value = 0
    category.value = ''
    description.value = ''
  } catch (e) {
    console.error('Błąd przy dodawaniu przychodu', e)
    alert('Wystąpił błąd podczas dodawania przychodu. Spróbuj ponownie później.')
  }
}

const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: 'Czy na pewno chcesz usunąć ten przychód?',
    text: 'Ta operacja jest nieodwracalna.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e3342f',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Tak, usuń',
    cancelButtonText: 'Anuluj',
  })
  if (result.isConfirmed) {
  }
  try {
    await store.removeIncome(id)
    Swal.fire({
      title: 'Usunięto przychód',
      text: 'Przychód został pomyślnie usunięty.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
  } catch (e) {
    Swal.fire(
      'Błąd',
      'Wystąpił błąd podczas usuwania przychodu. Spróbuj ponownie później.',
      'error',
    )
    console.error('Błąd przy usuwaniu przychodu', e)
  }
}

const formatDate = (dateStr: string | Date) =>
  new Date(dateStr).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
</script>
