import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ExpenseForm from '@/components/forms/ExpenseForm.vue'
import { useExpenseStore } from '@/stores/expenseStore'
import { ref } from 'vue'

const addExpenseMock = vi.fn()

vi.mock('@/api/useExpenses', () => ({
  useExpenses: () => ({
    deleteExpense: vi.fn(),
    getExpenses: vi.fn(),
    addExpense: addExpenseMock,
  }),
}))

vi.mock('@/composabes/useOcrParser', () => ({
  useOcrParser: () => ({
    date: ref('2025-01-10'),
    amount: ref(100),
    description: ref('Groceries'),
    category: ref('Food'),
    handleOcrParsed: vi.fn(),
  }),
}))

describe('ExpenseForm Integration- addNewExpense', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('adds new expense afeter form submit', async () => {
    const store = useExpenseStore()

    addExpenseMock.mockResolvedValueOnce({
      id: 'expense-1',
      amount: 100,
      category: 'Food',
      date: '2025-01-10',
      description: 'Groceries',
    })

    const wrapper = mount(ExpenseForm, {
      global: {
        plugins: [createPinia()],
        stubs: ['v-icon'],
      },
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(addExpenseMock).toHaveBeenCalledTimes(1)
    expect(store.error).toBeNull()
  })

  it('handles error when adding new expense fails', async () => {
    const store = useExpenseStore()
    addExpenseMock.mockRejectedValueOnce(new Error('API Error'))
    const wrapper = mount(ExpenseForm, {
      global: {
        plugins: [createPinia()],
        stubs: ['v-icon'],
      },
    })
    await wrapper.find('form').trigger('submit.prevent')

    expect(addExpenseMock).toHaveBeenCalledTimes(1)
  })
})
