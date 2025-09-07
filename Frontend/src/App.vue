<script setup lang="ts">
import SignIn from '@/components/SignIn.vue'
import { useAuth, useUser } from '@clerk/vue'
import { useUserStore } from './stores/useUserStore'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from './router'
import SideBar from './components/SideBar.vue'

const route = useRoute()
const { user } = useUser()
const userStore = useUserStore()
const { isLoaded, isSignedIn } = useAuth()

watch(
  [isSignedIn, user],
  () => {
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
  },
  { immediate: true },
)

const isUserSignedIn = computed(() => userStore.isSignIn)
const isNotDashboard = computed(() => route.path !== '/dashboard')

const dashboardLink = computed(() => {
  if (!isUserSignedIn.value || !isNotDashboard.value) return null
  return userStore.role === 'admin'
    ? { to: '/admin', label: 'Panel Administratora' }
    : { to: '/dashboard', label: 'Panel Użytkownika' }
})

const isSideBarOpen = ref(false)
const toggleSidebar = () => {
  isSideBarOpen.value = !isSideBarOpen.value
}

const handleLinkClick = (path: string) => {
  router.push(path)
  isSideBarOpen.value = false
}
</script>

<template>
  <div class="bg-gradient-to-b from-orange-lightest to-orange-100 min-h-screen">
    <header class="p-4 bg-gradient-to-r from-orange-lightest to-orange-100 shadow-md z-50">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <router-link to="/">
            <img loading="lazy" src="@/assets/image/logo.png" alt="logo" class="h-30 w-45 mr-2" />
          </router-link>
        </div>
        <div v-if="isLoaded" class="hidden md:flex gap-4 items-center justify-end">
          <router-link
            v-if="dashboardLink"
            :to="dashboardLink.to"
            class="btn-primary bg-orange-light text-white font-bold px-5 py-2.5 rounded-lg gap-2"
          >
            {{ dashboardLink.label }}
          </router-link>
          <SignIn />
        </div>
        <div class="sm:hidden block relative">
          <button @click="toggleSidebar">
            <v-icon name="oi-three-bars" scale="2.1" fill="#f57c00"></v-icon>
          </button>
        </div>
      </div>
    </header>
    <transition name="fade">
      <div
        @click="toggleSidebar"
        v-if="isSideBarOpen"
        class="fixed inset-0 bg-black bg-opacity-40 z-40"
      ></div>
    </transition>

    <!-- SideBar -->
    <SideBar
      :isSideBarOpen="isSideBarOpen"
      @closeSidebar="isSideBarOpen = false"
      @navigate="handleLinkClick"
      :isUserSignedIn="isUserSignedIn"
    />

    <main>
      <router-view />
    </main>
  </div>
</template>
