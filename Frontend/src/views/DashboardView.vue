<script setup lang="ts">
import { createBudgetAPI } from '@/api/budgetService'
import type { Budget } from '@/types'
import { useAuth } from '@clerk/vue'
import { computed, onMounted, ref } from 'vue'

const { getToken } = useAuth()
const token = ref<string>('')
const budgetAPI = ref<ReturnType<typeof createBudgetAPI>>()

// Dane formularza
const newDate = ref('')
const newAmount = ref<number | null>(null)
const newCategory = ref('')
const newDescription = ref('')
const transactionType = ref<'earning' | 'expense' | 'saving'>('earning')

// Stan aplikacji
const budgets = ref<Budget[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

// Inicjalizacja autentykacji i API
const initialize = async () => {
  try {
    const tokenFn = getToken.value // Pobieramy funkcję z ComputedRef
    const fetchedToken = await tokenFn() // Wywołujemy funkcję

    if (!fetchedToken) {
      throw new Error('Brak tokenu autoryzacyjnego')
    }

    token.value = fetchedToken
    budgetAPI.value = createBudgetAPI(token.value)
    await loadBudgets()

    // Ustaw dzisiejszą datę jako domyślną
    const today = new Date().toISOString().split('T')[0]
    newDate.value = today
  } catch (err) {
    error.value = 'Błąd inicjalizacji: ' + (err instanceof Error ? err.message : 'Nieznany błąd')
    console.error(err)
  }
}

// Pobieranie danych
const loadBudgets = async () => {
  if (!budgetAPI.value) return

  isLoading.value = true
  error.value = null
  try {
    budgets.value = await budgetAPI.value.fetchBudgets()
  } catch (err) {
    error.value = 'Wystąpił błąd podczas ładowania danych'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Walidacja formularza
const validateForm = (): boolean => {
  if (!newDate.value) {
    error.value = 'Data jest wymagana'
    return false
  }
  
  if (newAmount.value === null || newAmount.value <= 0) {
    error.value = 'Kwota musi być większa od 0'
    return false
  }
  
  if (!newCategory.value) {
    error.value = 'Kategoria jest wymagana'
    return false
  }
  
  error.value = null
  return true
}

// Dodawanie nowego wpisu
const handleAddBudget = async()  => {
  if(budgetAPI.value === null){
error.value = 'API nie zostało zainicjalizowane'
    return
  }
  if (!validateForm()) {
    return
  }
  try {
    const commonFiels = {
      date: new Date(newDate.value).toISOString(),
      amount: Number(newAmount.value),
      category: newCategory.value,
      description: newDescription.value,
    }
    if( transactionType.value === 'earning') {
      await budgetAPI.value.addIncome(commonFiels)
    
    }
  } catch (error) {
    
  }
}
 
// Usuwanie wpisu
const handleDeleteBudget = async (id: string) => {
  if (!budgetAPI.value) {
    error.value = 'API nie zostało zainicjalizowane'
    return
  }

  try {
    await budgetAPI.value.deleteBudget(id)
    await loadBudgets()
  } catch (err) {
    error.value =
      'Błąd podczas usuwania wpisu: ' + (err instanceof Error ? err.message : 'Nieznany błąd')
    console.error(err)
  }
}

// Filtrowane listy
const earnings = computed(() => budgets.value.filter((item) => item.type === 'earning'))
const expenses = computed(() => budgets.value.filter((item) => item.type === 'expense'))
const savings = computed(() => budgets.value.filter((item) => item.type === 'saving'))

// Sumy
const totalEarnings = computed(() => earnings.value.reduce((sum, item) => sum + item.amount, 0))
const totalExpenses = computed(() => expenses.value.reduce((sum, item) => sum + item.amount, 0))
const totalSavings = computed(() => savings.value.reduce((sum, item) => sum + item.amount, 0))

// Inicjalizacja komponentu
onMounted(() => {
  initialize()
})

// UI
const activeTab = ref('earnings')
const tabs = [
  { id: 'earnings', name: 'Zarobki', icon: 'io-wallet-outline' },
  { id: 'expenses', name: 'Wydatki', icon: 'fa-shopping-cart' },
  { id: 'savings', name: 'Oszczędności', icon: 'fa-piggy-bank' },
]

const earningCategories = ['Wynagrodzenie', 'Własna działaność', 'Inwestycje', 'Prezenty', 'Inne']
const expenseCategories = [
  'Mieszkanie',
  'Rachunki',
  'Kredyty',
  'Żywność',
  'Transport',
  'Media',
  'Rozrywka',
  'Opieka zdrowotna',
  'Zakupy',
  'Inne',
]
const savingCategories = [
  'Fundusz awaryjny',
  'Emerytura',
  'Wakacje',
  'Edukacja',
  'Zakup domu',
  'Inne',
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 p-4 py-3 rounded relative"
      role="alert"
    >
      <span class="">{{ error }}</span>
    </div>
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <v-icon name="la-spinner-solid" scale="3" fill="orange" animation="spin" />
    </div>
    <div v-else class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-orange">Planer Budżetu</h1>
        <p class="text-gray-600">Śledź swoje finanse i planuj przyszłość</p>
      </div>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Earnings Card -->
        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center mb-4">
            <v-icon
              name="io-wallet-outline"
              scale="1.5"
              fill="orange"
              animation="pulse"
              class="mr-3"
            />
            <h2 class="text-xl font-semibold text-gray-800">Zarobki</h2>
          </div>
          <p class="text-3xl font-bold text-gray-800 mb-2">Zarobki w zł</p>
          <p class="text-gray-600">tu funcja wyliczajaca</p>
        </div>
        <!-- Expenses Card -->
        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center mb-4">
            <v-icon
              name="fa-shopping-cart"
              scale="1.5"
              fill="orange"
              animation="pulse"
              class="mr-3"
            />
            <h2 class="text-xl font-semibold text-gray-800">Wydatki</h2>
          </div>
          <p class="text-3xl font-bold text-gray-800 mb-2">Zarobki w zł</p>
          <p class="text-gray-600">tu funcja wyliczajaca</p>
        </div>
        <!-- Savings Card -->
        <div
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center mb-4">
            <v-icon name="fa-piggy-bank" scale="1.5" fill="orange" animation="pulse" class="mr-3" />
            <h2 class="text-xl font-semibold text-gray-800">Oszczędności</h2>
          </div>
          <p class="text-3xl font-bold text-gray-800 mb-2">Zarobki w zł</p>
          <p class="text-gray-600">tu funcja wyliczajaca</p>
        </div>
      </div>
      <!-- Charts Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Wykres Finansów</h2>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="w-full md:w-2/3" style="height: 400px">wykres</div>
          <div class="w-full md:w-1/3 mt-6 md:mt-0">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-800 mb-2">Podsumowanie</h3>
              <p class="text-gray-600">Twoje podsumowanie bugdżetu na dzień</p>
            </div>
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="bg-orange-light w-4 h-4 rounded-full mr-3"></div>
                <div class="">
                  <p class="font-medium">Zarobki</p>
                  <p class="text-gray-600">tu funcja wyliczajaca</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="bg-orange-dark w-4 h-4 rounded-full mr-3"></div>
                <div class="">
                  <p class="font-medium">Wydatki</p>
                  <p class="text-gray-600">tu funcja wyliczajaca</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="bg-orange-light-medium w-4 h-4 rounded-full mr-3"></div>
                <div class="">
                  <p class="font-medium">Oszczędności</p>
                  <p class="text-gray-600">tu funcja wyliczajaca</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs section -->

      <div class="bg-white rounded-lg shadow-md">
        <div class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 py-4 px-6 text-center font-medium whitespace-nowrap cursor-pointer !rounded-button',
              activeTab === tab.id
                ? 'text-orange border-b-2 border-text-orange'
                : 'text-gray-600 hover:text-orange',
            ]"
          >
            <v-icon :name="tab.icon" class="inline-block mr-2" />
            {{ tab.name }}
          </button>
        </div>
        <!-- Tab Content -->
        <div class="p-6">
          <!-- Earnings Tab -->
          <div v-if="activeTab === 'earnings'" class="animate-fadeIn">
            <h2 class="tex-xl font-semibold text-gray-800 mb-6">Dodaj Zarobki</h2>
            <form @submit.prevent="handleAddBudget('earning')" class="mb-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="">
                  <label for="earningDate" class="block text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    id="earningDate"
                    v-model="newDate"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
                  />
                </div>
                <div class="">
                  <label for="earningAmount" class="block text-gray-700 mb-2">Kwota (zł)</label>
                  <input
                    type="number"
                    id="earningAmount"
                    v-model="newAmount"
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
                      v-model="newCategory"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
                    >
                      <option value="" disabled>Wybierz kategorie</option>
                      <option
                        v-for="category in earningCategories"
                        :key="category"
                        :value="category"
                      >
                        {{ category }}
                      </option>
                    </select>
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items center px-2 text-gray-700 items-center"
                    >
                      <v-icon
                        name="la-angle-double-down-solid"
                        scale="1"
                        fill="#FFB347"
                        animation="float"
                      />
                    </div>
                  </div>
                </div>
                <div class="">
                  <label for="earningDescription" class="block text-gray-700 mb-2">Opis</label>
                  <input
                    type="text"
                    id="earningDescription"
                    v-model="newDescription"
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
                  <tr
                    v-for="(item, index) in earnings"
                    :key="index"
                    class="border-b border-gray-200"
                  >
                    <td class="py-3 px-4">
                      {{
                        item.incomes && item.incomes[0]
                          ? new Date(item.incomes[0].date).toLocaleDateString()
                          : ''
                      }}
                    </td>
                    <td class="py-3 px-4">
                      {{ item.incomes && item.incomes[0] ? item.incomes[0].category : '' }}
                    </td>
                    <td class="py-3 px-4">
                      {{ item.incomes && item.incomes[0] ? item.incomes[0].description : '' }}
                    </td>
                    <td class="py-3 px-4">
                      {{ item.incomes && item.incomes[0] ? item.incomes[0].amount.toFixed(2) : '' }}
                      zł
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" class="py-4 text-center text-gray-500">
                      Nie odnotowano jeszcze żadnych zarobków.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- Expenses Tab -->
          <div v-if="activeTab === 'expenses'" class="animate-fadeIn">
            <h2 class="tex-xl font-semibold text-gray-800 mb-6">Dodaj Wydatki</h2>
            <form class="mb-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="">
                  <label for="expenseDate" class="block text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    id="expenseDate"
                    v-model="newDate"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
                  />
                </div>
                <div class="">
                  <label for="expenseAmount" class="block text-gray-700 mb-2">Kwota (zł)</label>
                  <input
                    type="number"
                    id="expenseAmount"
                    v-model="newAmount"
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
                      v-model="newCategory"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
                    >
                      <option value="" disabled>Wybierz kategorie</option>
                      <option
                        v-for="category in expenseCategories"
                        :key="category"
                        :value="category"
                      >
                        {{ category }}
                      </option>
                    </select>
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items center px-2 text-gray-700 items-center"
                    >
                      <v-icon
                        name="la-angle-double-down-solid"
                        scale="1"
                        fill="#FFB347"
                        animation="float"
                      />
                    </div>
                  </div>
                </div>
                <div class="">
                  <label for="expenseDescription" class="block text-gray-700 mb-2">Opis</label>
                  <input
                    type="text"
                    id="expenseDescription"
                    v-model="newDescription"
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
            <!-- Recent Expenses -->
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Ostatnie wydatki</h3>
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
                  <tr
                    v-for="(item, index) in earnings"
                    :key="index"
                    class="border-b border-gray-200"
                  >
                    <td class="py-3 px-4">
                      {{
                        item.incomes && item.incomes[0]
                          ? new Date(item.incomes[0].date).toLocaleDateString()
                          : ''
                      }}
                    </td>
                    <td class="py-3 px-4">
                      {{ item.incomes && item.incomes[0] ? item.incomes[0].category : '' }}
                    </td>
                    <td class="py-3 px-4">
                      {{ item.incomes && item.incomes[0] ? item.incomes[0].description : '' }}
                    </td>
                    <td class="py-3 px-4">
                      {{ item.incomes && item.incomes[0] ? item.incomes[0].amount.toFixed(2) : '' }}
                      zł
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" class="py-4 text-center text-gray-500">
                      Nie odnotowano jeszcze żadnych wydatków.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- Savings Tab -->
          <div v-if="activeTab === 'savings'" class="animate-fadeIn">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">Dodaj Oszczędności</h2>
            <form class="mb-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="">
                  <label for="savingsDate" class="block text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    id="savingsDate"
                    v-model="newDate"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
                  />
                </div>
                <div class="">
                  <label for="expenseAmount" class="block text-gray-700 mb-2">Kwota (zł)</label>
                  <input
                    type="number"
                    id="savingsAmount"
                    v-model="newAmount"
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
                      v-model="newCategory"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB347]"
                    >
                      <option value="" disabled>Wybierz kategorie</option>
                      <option
                        v-for="category in savingCategories"
                        :key="category"
                        :value="category"
                      >
                        {{ category }}
                      </option>
                    </select>
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items center px-2 text-gray-700 items-center"
                    >
                      <v-icon
                        name="la-angle-double-down-solid"
                        scale="1"
                        fill="#FFB347"
                        animation="float"
                      />
                    </div>
                  </div>
                </div>
                <div class="">
                  <label for="savingDescription" class="block text-gray-700 mb-2">Opis</label>
                  <input
                    type="text"
                    id="savingDescription"
                    v-model="newDescription"
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
                  <tr
                    v-for="(item, index) in earnings"
                    :key="index"
                    class="border-b border-gray-200"
                  >
                    <td class="py-3 px-4">
                      {{
                        item.incomes && item.incomes[0]
                          ? new Date(item.incomes[0].date).toLocaleDateString()
                          : ''
                      }}
                    </td>
                    <td class="py-3 px-4">
                      {{ item.incomes && item.incomes[0] ? item.incomes[0].category : '' }}
                    </td>
                    <td class="py-3 px-4">
                      {{ item.incomes && item.incomes[0] ? item.incomes[0].description : '' }}
                    </td>
                    <td class="py-3 px-4">
                      {{ item.incomes && item.incomes[0] ? item.incomes[0].amount.toFixed(2) : '' }}
                      zł
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" class="py-4 text-center text-gray-500">
                      Nie odnotowano jeszcze żadnych oszczędności.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
