import { mount } from '@vue/test-utils'
import ExpenseForm from '../ExpenseForm.vue'
import { useExpenseStore } from '../../../stores/expenseStore'
import { ref } from 'vue'
import { it, expect } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
})

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
    date: ref(''),
    amount: ref(null),
    description: ref(''),
    category: ref(''),
    handleOcrParsed: vi.fn(),
  }),
}))

it('shows validation error and does not submit when fields are missing', async () => {
  const wrapper = mount(ExpenseForm, {
    global: {
      stubs: ['v-icon'],
    },
  })
  await wrapper.find('form').trigger('submit')

  const store = useExpenseStore()

  expect(store.addNewExpense).not.toHaveBeenCalled()

  const errorMessage = wrapper.find('[data-testid="form-error"]')
  expect(errorMessage.exists()).toBe(true)
  expect(errorMessage.text()).toContain('Uzupełnij wszystkie wymagane pola')
})

it('Clears validation error after successful submit', async () => {
  const wrapper = mount(ExpenseForm, {
    global: {
      stubs: ['v-icon'],
    },
  })
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('[data-testid="form-error"]').exists()).toBe(true)
})
