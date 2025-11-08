import { watch, type Ref } from 'vue'
import Swal, { type SweetAlertResult } from 'sweetalert2'

export const useSprending = () => {
  const useSpendingWarning = (percentage: Ref<number>) => {
    watch(percentage, (value) => {
      if (value > 80) {
        Swal.fire({
          icon: 'warning',
          title: 'Uwaga!',
          text: 'Twoje wydatki przekraczają 80% zarobków!',
          confirmButtonText: 'Rozumiem',
          confirmButtonColor: '#f97316',
        })
      }
    })
  }

  const useSprendingDelete = async (): Promise<SweetAlertResult> => {
    return await Swal.fire({
      title: 'Czy na pewno chcesz usunąć?',
      text: 'Ta operacja jest nieodwracalna.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Tak, usuń',
      cancelButtonText: 'Anuluj',
    })
  }

  const showSuccess = (message = 'Pomyślnie usunięto.') => {
    Swal.fire({
      title: 'Usunięto',
      text: message,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
  }

  const showError = (
    message = 'Wystąpił błąd podczas usuwania. Spróbuj ponownie później.',
  ) => {
    Swal.fire('Błąd', message, 'error')
  }
  return {
    useSpendingWarning,
    useSprendingDelete,
    showSuccess,
    showError,
  }
}
