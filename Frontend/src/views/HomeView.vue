<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { features } from '../constants/imageFeatures'
import { useClerkAuth } from '@/composabes/useClerkAuth'
import { SignedOut } from '@clerk/vue'

const { signIn } = useClerkAuth()
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-orange-lightest flex flex-col items-center px-6 md:px-12 lg:px-20 py-12"
  >
    <div
      v-motion
      :initial="{ opacity: 0, y: -30 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 800, easing: 'ease-out' } }"
      class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center w-full mx-auto"
    >
      <div class="text-center lg:text-left">
        <h1 class="text-3xl md:text-5-xl font-extrabold tracking-tight text-slate-600 font-lato">
          Zacznij planować swój budżet już dziś i zyskaj kontrolę nad swoimi finansami
        </h1>
        <div class="mt-8">
          <SignedOut>
            <Button
              @click="signIn"
              size="lg"
              class="rounded-2xl px-10 py-6 shadow-lg bg-orange-light btn-primary text-xl"
            >
              Rozpocznij teraz
            </Button>
          </SignedOut>
        </div>
        <p class="mt-4 text-slate-600 text-lg md:text-xl">
          Proste narzędzie, które pomoże Ci zarządzać wydatkami, oszczędzać i realizować cele
          finansowe.
        </p>
      </div>
      <div class="flex justify-center lg:justify-end">
        <img
          src="@/assets/image/homeMain.jpg"
          alt="budżet"
          class="mt-8 rounded-2xl w-full max-w-2xl mx-auto"
        />
      </div>
    </div>

    <div class="mt-20 grid grid-cols-1 lg:grid-cols-4 gap-10 w-full">
      <div
        v-for="(item, i) in features"
        :key="i"
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visible="{ opacity: 1, y: 0, transition: { delay: i * 200, duration: 600 } }"
        class="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
      >
        <img :src="item.img" alt="" class="w-full" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
        <p class="text-gray-600 text-sm">{{ item.desc }}</p>
      </div>
    </div>
    <div
      v-motion
      :initial="{ opacity: 0, y: 40 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 700 } }"
      class="mt-10 text-center space-y-8"
    >
      <h2 class="text-2xl md:text-3xl font-bold text-slate-600 mt-6 items-center text-center">
        Dołącz do tysięcy użytkowników i zacznij świadomie zarządzać finansami
      </h2>
      <SignedOut>

        <Button
        @click="signIn"
        size="lg"
        class="text-white bg-orange-light rounded-2xl px-12 py-8 shadow-md hover:shadow-xl transition-all btn-primary text-3xl"
        >
        Załóż konto
      </Button>
    </SignedOut>
    </div>
  </div>
</template>
