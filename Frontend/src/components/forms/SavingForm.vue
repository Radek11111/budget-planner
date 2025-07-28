<template>
  <form @submit.prevent="handleSubmit" class="mb-8">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">Dodaj Oszczędności</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="">
        <label for="savingsDate" class="block text-gray-700 mb-2">Data</label>
        <input
          type="date"
          id="savingsDate"
          v-model="date"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
        />
      </div>
      <div class="">
        <label for="savingAmount" class="block text-gray-700 mb-2">Kwota (zł)</label>
        <input
          type="number"
          id="savingAmount"
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
        <label for="savingsCategory" class="block text-gray-700 mb-2">Kategoria</label>
        <div class="relative">
          <select
            id="savingsCategory"
            v-model="category"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
          >
            <option value="" disabled>Wybierz kategorie</option>
            <option v-for="category in savingCategories" :key="category" :value="category">
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
        <label for="savingDescription" class="block text-gray-700 mb-2">Opis</label>
        <input
          type="text"
          id="savingDescription"
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
  <!-- Recent Savings -->
  <h3 class="text-lg font-semibold text-gray-800 mb-4">Ostatnie Oszczędności</h3>
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
        <tr v-for="saving in store.savings" :key="saving.id" class="border-b border-gray-200">
          <td class="py-3 px-4 whitespace-nowrap">
            {{ formatDate(saving.date) }}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            {{ saving.category }}
          </td>
          <td class="py-3 px-4">
            {{ saving.description }}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            {{ saving.amount.toFixed(2) }}
            zł
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            <v-icon
              name="fa-trash-alt"
              scale="1.2"
              fill="red"
              class="cursor-pointer hover:text-red-600 transition-colors"
              @click="handleDelete(saving.id)"
            />
          </td>
        </tr>
      <tr v-if="store.savings?.length === 0">
          <td colspan="4" class="py-4 text-center text-gray-500">
            Nie odnotowano jeszcze żadnych oszczędności.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { useSavingStore } from '@/stores/savingStore'
import { onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import { savingCategories } from '@/constants/categories'
import type { Saving } from '@/types'

const date = ref('')
const amount = ref(0)
const category = ref('')
const description = ref('')
const store = useSavingStore()

onMounted(() => {
  store.fetchSavings()
})
const handleSubmit = async () => {
  if (!date.value || amount.value === null || !category.value || !description.value) return
  const newSaving: Saving = {
    id: '',
    date: new Date(date.value).toISOString(),
    amount: amount.value,
    category: category.value,
    description: description.value,
  }
  try {
    await store.addNewSaving(newSaving)
    // Reset
    date.value = ''
    amount.value = 0
    category.value = ''
    description.value = ''
  } catch (e) {
    console.error('Błąd podczas dodawania oszczędności:', e)
    alert('Wystąpił błąd podczas dodawania oszczędności. Spróbuj ponownie.')
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
    await store.removeSaving(id)
    Swal.fire({
      title: 'Usunięto oszczędność',
      text: 'Oszczędność została pomyślnie usunięta.',
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
