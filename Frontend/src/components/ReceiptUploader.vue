<script setup lang="ts">
import { categoryOCRMap } from '@/constants/categories'
import { ref } from 'vue'
const emit = defineEmits<{
  (
    e: 'parsed',
    payload: { amount: string; date: string; description: string; category: string },
  ): void
}>()

const isLoading = ref(false)
const selectedFile = ref<File | null>(null)

const handleFile = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Proszę wybrać plik graficzny.')
    return
  }
  selectedFile.value = file
  isLoading.value = true

  try {
    const optimizedImage = await optimizeImage(file)
    const base64Image = await readFileAsBase64(optimizedImage)
    await extractDataFromReceipt(base64Image)
  } catch (error) {
    console.error('Błąd przetwarzania pliku:', error)
    emit('parsed', { amount: '', date: '', description: '', category: '' })
  } finally {
    isLoading.value = false
  }
}

const optimizeImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    img.onload = () => {
      const maxWidth = 800
      const scale = maxWidth / img.width
      const width = img.width * scale
      const height = img.height * scale

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          const optimizedFile = new File([blob!], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(optimizedFile)
        },
        'image/jpeg',
        0.7,
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const extractDataFromReceipt = async (base64Image: string) => {
  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('base64Image', `data:image/jpeg;base64,${base64Image}`)
    formData.append('language', 'pol')
    formData.append('isTable', 'true')
    formData.append('OCREngine', '2')
    formData.append('scale', 'true')
    formData.append('isOverlayRequired', 'false')
    formData.append('detectOrientation', 'true')

    const apiKey = import.meta.env.VITE_OCR_API_KEY ?? ''
    formData.append('apikey', apiKey)

    const res = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      throw new Error(`OCR API error: ${res.statusText}`)
    }

    const data = await res.json()

    if (data?.IsErroredOnProcessing) {
      throw new Error(`OCR Processing Error: ${data?.ErrorMessage?.[0] || 'Unknown error'}`)
    }

    const text = data?.ParsedResults?.[0]?.ParsedText || ''
    console.log('Tekst z OCR:', text)

    parseReceiptText(text)
  } catch (err) {
    console.error('Błąd OCR:', err)
    emit('parsed', { amount: '', date: '', description: '', category: '' })
  } finally {
    isLoading.value = false
  }
}

const parseReceiptText = (text: string) => {
  const amountRegex =
    /(?:PLN|zł|zl|price|kwota|suma)[:\s]*([\d\s]+[.,]\d{2})|([\d\s]+[.,]\d{2})\s*(?:PLN|zł)/i
  const dateRegex = /(\d{4})[-./](\d{1,2})[-./](\d{1,2})|(\d{1,2})[-./](\d{1,2})[-./](\d{4})/
  const storeRegex =
    /(Biedronka|Lidl|Żabka|Carrefour|Auchan|Netto|Lewiatan|Kaufland|Tesco|Aldi|BP|Shell|Orlen|Poczta|Poczta Polska|InPost|DHL|UPS)/i

  const amountMatch = text.match(amountRegex)
  const dateMatch = text.match(dateRegex)
  const descriptionMatch = text.match(storeRegex)
  const categoryMatch = categoryOCRMap

  const amount = amountMatch ? amountMatch[1].replace(',', '.') : ''
  let date = ''
  if (dateMatch) {
    if (dateMatch[1]) {
      date = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`
    } else if (dateMatch[4]) {
      date = `${dateMatch[6]}-${dateMatch[5].padStart(2, '0')}-${dateMatch[4].padStart(2, '0')}`
    }
  }
  const description = descriptionMatch ? descriptionMatch[1] : ''
  let category = 'Inne'
  if (descriptionMatch) {
    const storeName = descriptionMatch[1]
    const normalizedStoreName = storeName.charAt(0).toUpperCase() + storeName.slice(1).toLowerCase()
    category = categoryMatch[normalizedStoreName] || 'Inne'
  }

  console.log('Sparsowane dane:', { amount, date, description, category })
  emit('parsed', { amount, date, description, category: category })
}
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <label
      class="cursor-pointer bg-[#FFB347] text-white px-4 py-2 rounded-lg hover:bg-[#FFA533] transition"
    >
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
