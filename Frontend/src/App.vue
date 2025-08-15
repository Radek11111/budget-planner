<script setup lang="ts">
import SignIn from '@/components/SignIn.vue'
import { useAuth, useUser } from '@clerk/vue'
import { useUserStore } from './stores/user'
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { user } = useUser()
const userStore = useUserStore()
const { isLoaded, isSignedIn } = useAuth()

const updateUserStore = () => {
  if (isSignedIn.value && user.value) {
    userStore.setUser({
      id: user.value.id,
      email: user.value.emailAddresses[0]?.emailAddress || '',
      role:
        typeof user.value.publicMetadata.role === 'string'
          ? user.value.publicMetadata.role
          : 'member',
    })
  } else {
    userStore.clearUser()
  }
}

onMounted(updateUserStore)

watch(isSignedIn, updateUserStore, { immediate: true })

const isUserSignedIn = computed(() => userStore.isSignIn)
const isNotDashboard = computed(() => route.path !== '/dashboard')
</script>

<template>
  <div id="app">
    <header class="p-4 bg-orange-lightest shadow-md">
      <div class="container mx-auto flex items-center justify-between" v-if="isLoaded">
        <div class="flex items-center">
          <router-link to="/">
            <img src="@/assets/image/logo1.png" alt="logo" class="h-45 w-45 mr-2" />
          </router-link>
        </div>
        <div v-if="isLoaded" class="flex gap-4 items-center justify-end">
          <router-link
            v-if="isUserSignedIn && isNotDashboard && userStore.role !== 'admin'"
            to="/dashboard"
            class="bg-orange-dark text-slate-900 font-bold px-4 py-2 rounded gap-2"
            >Panel Użytkownika</router-link
          >
          <router-link
            v-if="isUserSignedIn && isNotDashboard && userStore.role === 'admin'"
            to="/admin"
            class="bg-orange-dark text-slate-900 font-bold px-4 py-2 rounded gap-2"
            >Panel Administratora</router-link
          >
          <SignIn />
        </div>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
