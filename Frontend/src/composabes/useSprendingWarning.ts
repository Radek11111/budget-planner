import { watch, type Ref } from "vue"
import Swal from 'sweetalert2'
export const useSpendingWarning = (percentage: Ref<number>) => {
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