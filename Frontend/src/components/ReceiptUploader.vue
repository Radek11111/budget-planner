<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits<{
  (e: 'parsed', payload: { amount: string; date: string; description: string; category: string }): void
}>()

const isLoading = ref(false)
const selectedFile = ref<File | null>(null)

const handleFile = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  selectedFile.value = file

  const reader = new FileReader()
  reader.onload = async () => {
    const base64Image = reader.result?.toString().split(',')[1]
    if (base64Image) {
      await extractDataFromReceipt(base64Image)
    }
  }
  reader.readAsDataURL(file)
}

const extractDataFromReceipt = async (base64Image: string) => {
  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('base64Image', `data:image/png;base64,${base64Image}`)
    formData.append('language', 'pol')
    formData.append('isTable', 'true')
    formData.append('OCREngine', '2')

    // użycie env var (Vite): VITE_OCR_API_KEY
    const apiKey = import.meta.env.VITE_OCR_API_KEY ?? ''
    formData.append('apikey', apiKey)

    const res = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    const text = data?.ParsedResults?.[0]?.ParsedText || ''
    parseReceiptText(text)
  } catch (err) {
    console.error('Błąd OCR:', err)
  } finally {
    isLoading.value = false
  }
}

const parseReceiptText = (text: string) => {
  const amountRegex = /(\d+[.,]\d{2})\s*(PLN|zł)?/i
  const dateRegex = /(\d{2}[./-]\d{2}[./-]\d{4})/
  const storeRegex = /(Biedronka|Lidl|Żabka|Carrefour|Auchan|Netto|Lewiatan|Kaufland)/i
  const categoryRegex = /(Zakupy|Żywność|Transport|Rachunki|Inne)/i

  const amountMatch = text.match(amountRegex)
  const dateMatch = text.match(dateRegex)
  const descriptionMatch = text.match(storeRegex)
  const categoryMatch = text.match(categoryRegex)

  const amount = amountMatch ? amountMatch[1].replace(',', '.') : ''
  const date = dateMatch ? dateMatch[1] : ''
  const description = descriptionMatch ? descriptionMatch[1] : ''
  const category = categoryMatch ? categoryMatch[1] : ''

  // emitujemy event z parsowanymi danymi
  emit('parsed', { amount, date, description, category: category || 'Inne' })
}
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <label class="cursor-pointer bg-[#FFB347] text-white px-4 py-2 rounded-lg hover:bg-[#FFA533] transition">
      📸 Zrób zdjęcie paragonu
      <input
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
        @change="handleFile"
      />
    </label>

    <p v-if="selectedFile" class="text-sm text-gray-700">Wybrano plik: {{ selectedFile.name }}</p>
    <p v-if="isLoading" class="text-sm text-gray-500">Przetwarzanie zdjęcia...</p>
  </div>
</template>
