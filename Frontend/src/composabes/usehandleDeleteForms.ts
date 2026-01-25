import { useSprending } from '@/composabes/useSprending'
import { useExpenseStore } from '../stores/expenseStore'

export const useHandleDeleteForms = () => {
  const store = useExpenseStore()
  const { useSprendingDelete, showSuccess, showError } = useSprending()

  const handleDelete = async (id: string) => {
    const result = await useSprendingDelete()
    if (!result.isConfirmed) {
      return
    }
    try {
      await store.removeExpense(id)
      showSuccess()
    } catch (e) {
      showError()
      console.error('Błąd przy usuwaniu wydatku', e)
    }
  }
  return {
    handleDelete,
  }
}
