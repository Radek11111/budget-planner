import { ref } from 'vue'
import { vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useExpenseStore } from '@/stores/expenseStore'

const fetchMonthlyExpenses = vi.fn()
const addNewExpense = vi.fn()
const removeExpense = vi.fn()

vi.mock('@/stores/expenseStore', () => ({
  useExpenseStore: () => ({
    fetchMonthlyExpenses,
    addNewExpense,
    removeExpense,
    monthlyExpenses: [],
    isLoading: false,
    error: null,
  }),
}))

vi.mock('@/composabes/useOcrParser', () => ({
  useOcrParser: () => ({
    date: ref('2025-01-01'),
    amount: ref(100),
    description: ref('Test expense'),
    category: ref('Food'),
    handleOcrParsed: vi.fn(),
  }),
}))

vi.mock('@/composabes/useSprending', () => ({
  useSprending: () => ({
    useSprendingDelete: vi.fn(() => Promise.resolve({ isConfirmed: true })),
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}))

vi.mock('../ReceiptUploader.vue', () => ({
  default: {
    template: '<div />',
  },
}))

import { mount } from '@vue/test-utils'
import ExpenseForm from '../ExpenseForm.vue'

describe('ExpenseForm', () => {
  it('renders correctly', () => {
    const wrapper = mount(ExpenseForm, {
      global: {
        stubs: ['v-icon'],
      },
    })

    expect(wrapper.text()).toContain('Dodaj Wydatki')
  })
})

it('fetches monthly expenses on mount', () => {
  mount(ExpenseForm, {
    global: {
      stubs: ['v-icon'],
    },
  })
  const store = useExpenseStore()
  expect(store.fetchMonthlyExpenses).toHaveBeenCalled()
})

it('submits form and calls addNewExpense', async () => {
  const wrapper = mount(ExpenseForm, {
    global: {
      stubs: ['v-icon'],
    },
  })

  await wrapper.find('form').trigger('submit')

  const store = useExpenseStore()

  expect(store.addNewExpense).toHaveBeenCalledWith(
    expect.objectContaining({
      amount: 100,
      description: 'Test expense',
      category: 'Food',
    }),
  )
})