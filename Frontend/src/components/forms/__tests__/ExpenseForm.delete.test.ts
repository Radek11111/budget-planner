import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useHandleDeleteForms } from '@/composabes/usehandleDeleteForms'

const useSprendingDeleteMock = vi.fn()
const showSuccessMock = vi.fn()
const showErrorMock = vi.fn()
const removeExpenseMock = vi.fn()

vi.mock('@/composabes/useSprending', () => ({
  useSprending: () => ({
    useSprendingDelete: useSprendingDeleteMock,
    showSuccess: showSuccessMock,
    showError: showErrorMock,
  }),
}))

vi.mock('@/stores/expenseStore', () => ({
  useExpenseStore: () => ({
    removeExpense: removeExpenseMock,
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useHandleDeleteForms', () => {
  it('does not delete expense when confirm is cancelled', async () => {
    useSprendingDeleteMock.mockResolvedValue({ isConfirmed: false })

    const { handleDelete } = useHandleDeleteForms()
    await handleDelete('1')

    expect(removeExpenseMock).not.toHaveBeenCalled()
    expect(showSuccessMock).not.toHaveBeenCalled()
    expect(showErrorMock).not.toHaveBeenCalled()
  })

  it('deletes expense when confirm is accepted', async () => {
    useSprendingDeleteMock.mockResolvedValue({ isConfirmed: true })
    removeExpenseMock.mockResolvedValue(undefined)

    const { handleDelete } = useHandleDeleteForms()
    await handleDelete('123')

    expect(removeExpenseMock).toHaveBeenCalledWith('123')
    expect(showSuccessMock).toHaveBeenCalled()
  })

  it('shows error when delete fails', async () => {
    useSprendingDeleteMock.mockResolvedValue({ isConfirmed: true })
    removeExpenseMock.mockRejectedValue(new Error('fail'))

    const { handleDelete } = useHandleDeleteForms()
    await handleDelete('123')

    expect(showErrorMock).toHaveBeenCalledTimes(1)
    expect(showSuccessMock).not.toHaveBeenCalled()
  })
})
