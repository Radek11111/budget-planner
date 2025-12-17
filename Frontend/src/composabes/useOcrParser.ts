import { ref } from "vue"
import Swal from 'sweetalert2'

export const useOcrParser = () => {
  const date = ref('')
  const amount = ref<number | null>(null)
  const description = ref('')
  const category = ref('')

  const normalizeDate = (rawDate: string): string => {
    console.log('Normalizuję datę:', rawDate)

    if (rawDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return rawDate
    }

    const yyyyMmDdMatch = rawDate.match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/)
    if (yyyyMmDdMatch) {
      const [, year, month, day] = yyyyMmDdMatch
      const formattedMonth = month.padStart(2, '0')
      const formattedDay = day.padStart(2, '0')
      const result = `${year}-${formattedMonth}-${formattedDay}`
      console.log('Data po normalizacji (YYYY-MM-DD):', result)
      return result
    }

    const ddMmYyyyMatch = rawDate.match(/(\d{1,2})[-./](\d{1,2})[-./](\d{4})/)
    if (ddMmYyyyMatch) {
      const [, day, month, year] = ddMmYyyyMatch
      const formattedDay = day.padStart(2, '0')
      const formattedMonth = month.padStart(2, '0')
      const result = `${year}-${formattedMonth}-${formattedDay}`
      console.log('Data po normalizacji (DD-MM-YYYY):', result)
      return result
    }

    console.warn('Nieznany format daty:', rawDate)
    return ''
  }

  const handleOcrParsed = (data: {
    date: string
    amount: string
    description: string
    category: string
  }) => {
    console.log('OCR Parsed Data:', data)
    if (data.amount) {
      const cleanedAmount = parseFloat(data.amount.replace(/[^\d,.-]/g, '').replace(',', '.'))
      const parsedAmount = parseFloat(cleanedAmount.toFixed(2))
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        amount.value = parsedAmount
      } else {
        console.warn('Nieprawidłowa kwota z OCR:', data.amount)
      }
    }
    if (data.date) {
      console.log('Raw date from OCR:', data.date)
      const normalizedDate = normalizeDate(data.date)
      console.log('Normalized date:', normalizedDate)
      if (normalizedDate) {
        date.value = normalizedDate
      } else {
        console.warn('Nieprawidłowa data z OCR:', data.date)
      }
    }

    if (data.description) description.value = data.description
    if (data.category) category.value = data.category

    if (data.amount || data.date || data.description) {
      Swal.fire({
        title: 'Dane załadowane!',
        text: 'Sprawdź poprawność danych przed zapisaniem.',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  return {
    date,
    amount,
    description,
    category,
    normalizeDate,
    handleOcrParsed,
  }
}
