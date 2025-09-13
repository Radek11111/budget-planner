<script setup lang="ts">
import SignIn from './SignIn.vue'

defineProps<{
  isSideBarOpen: boolean
  isUserSignedIn: boolean
}>()

const emit = defineEmits<{
  (e: 'closeSidebar'): void
  (e: 'navigate', path: string): void
}>()

const handleNavigation = (path: string) => {
  emit('navigate', path)
  emit('closeSidebar')
}
</script>

<template>
  <!-- SideBar -->
  <transition name="slide">
    <aside
      v-if="isSideBarOpen"
      class="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-lg z-50 p-6 flex flex-col items-center justify-center"
    >
      <v-icon
        @click="emit('closeSidebar')"
        name="la-window-close"
        scale="1.6"
        fill="#f57c00"
        class="absolute top-4 right-4"
      ></v-icon>
      <div class="flex flex-col gap-6 text-2xl">
        <button
          class="flex items-center gap-2 hover:text-zinc-500 transition-colors cursor-pointer"
          @click="handleNavigation('/')"
        >
          <v-icon name="ri-home-heart-fill" scale="1.4" fill="#f57c00"></v-icon> Home
        </button>
        <button
          v-if="isUserSignedIn"
          class="flex items-center gap-2 hover:text-zinc-500 transition-colors cursor-pointer"
          @click="handleNavigation('/dashboard')"
        >
          <v-icon name="fa-user" scale="1.4" fill="#f57c00"></v-icon> Panel Użytkownika
        </button>
      </div>
      <div class="absolute bottom-4 right-4">
        <div class="flex items-center gap-2">
          
          <SignIn />
        </div>
      </div>
    </aside>
  </transition>
</template>
