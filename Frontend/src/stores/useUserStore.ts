import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<{ id: string; email: string; role: string } | null>(null)

  const setUser = (userData: { id: string; email: string; role: string }, userToken?: string) => {
    user.value = userData
 
  }
  const clearUser = () => {
    user.value = null

  }


  const isSignIn = computed(() => !!user.value)
  const role = computed(() => user.value?.role || 'member')
  return { user, setUser, clearUser, isSignIn, role, }
})
