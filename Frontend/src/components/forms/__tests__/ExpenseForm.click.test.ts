import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpenseForm from '@/components/forms/ExpenseForm.vue'

const handleDeleteMock = vi.fn()
const fetchMonthlyExpensesMock = vi.fn()
const removeExpenseMock = vi.fn()

vi.mock('@/composabes/usehandleDeleteForms', () => ({
  useHandleDeleteForms: () => ({
    handleDelete: handleDeleteMock,
  }),
}))

vi.mock('@/stores/expenseStore', () => ({
  useExpenseStore: () => ({
    fetchMonthlyExpenses: fetchMonthlyExpensesMock,
    removeExpense: removeExpenseMock,
    monthlyExpenses: [
      {
        id: 'expense-123',
        amount: 50,
        description: 'Groceries',
        date: '2024-06-15',
        category: 'Food',
      },
    ],
  }),
}))

describe('ExpenseForm - Delete Button Click', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('calls handleDelete when delete button is clicked', async () => {
    const wrapper = mount(ExpenseForm, {
      props: {
        expenseId: 'expense-123',
      },
    })
    await wrapper.find('[data-testid="delete-expense"]').trigger('click')

    expect(handleDeleteMock).toHaveBeenCalledTimes(1)
    expect(handleDeleteMock).toHaveBeenCalledWith('expense-123')
  })
})
