<script setup lang="ts">
import SignIn from '@/components/SignIn.vue'
import { useAuth, useUser } from '@clerk/vue'
import { useUserStore } from './stores/user'
import { onMounted, watch } from 'vue'

const { user } = useUser()
const userStore = useUserStore()
const { isSignedIn } = useAuth()

onMounted(() => {
  if (isSignedIn.value && user.value) {
    userStore.setUser({
      id: user.value.id,
      email: user.value.primaryEmailAddress?.emailAddress || '',
    })
  } else {
    userStore.clearUser()
  }
})

watch(isSignedIn, (SignedIn) => {
  if (!SignedIn) userStore.clearUser()
})
</script>

<template>
  <div id="app">
    <header class="p-4 border-b">
      <div class="container mx-auto flex justify-end gap-4">
        <router-link
          v-if="userStore.isSignIn && $route.path !== '/dashboard'"
          to="/dashboard"
          class="bg-blue-600 text-white px-4 py-2 rounded gap-2"
          >Panel Użytkownika</router-link
        >
        <SignIn />
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
