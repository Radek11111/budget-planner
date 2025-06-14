import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null as string | null,
    email: null as string | null,
    isSignIn: false,
  }),
  actions: {
    setUser(user: { id: string; email: string }) {
      this.id = user.id
      this.email = user.email
      this.isSignIn = true
    },
    clearUser() {
      this.id = null
      this.email = null
      this.isSignIn = false
    },
  },
})
