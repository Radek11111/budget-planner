import { computed, type Ref } from 'vue'

export const useTotalAmount = (items: Ref<{ amount: number }[]>) =>
  computed(() => items.value.reduce((total, item) => total + item.amount, 0))
