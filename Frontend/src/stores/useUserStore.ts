import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<{ id: string; email: string; role: string; isSignedIn: boolean } | null>(null)

  const setUser = (userData: { id: string; email: string; role: string }) => {
    user.value = { ...userData, isSignedIn: true }
  }
  const clearUser = () => {
    user.value = null
  }

  const isSignIn = computed(() => !!user.value === true)
  const role = computed(() => user.value?.role || 'member')
  return { user, setUser, clearUser, isSignIn, role }
})
