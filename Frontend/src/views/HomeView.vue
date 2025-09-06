<script setup lang="ts">
const features = [
  {
    img: new URL('@/assets/image/home1.PNG', import.meta.url).href,
    title: 'Lepsza kontrola finansów',
    desc: 'Śledź i zarządzaj swoimi wydatkami w prosty sposób',
  },
  {
    img: new URL('@/assets/image/home2.PNG', import.meta.url).href,
    title: 'Unikaj nieplanowanych długów',
    desc: 'Zawsze krok przed wydatkami',
  },
  {
    img: new URL('@/assets/image/home3.PNG', import.meta.url).href,
    title: 'Oszczędzaj na swoje wymarzone cele',
    desc: 'Spełniaj swoje finansowe marzenia',
  },
  {
    img: new URL('@/assets/image/home4.PNG', import.meta.url).href,
    title: 'Świadome zakupy',
    desc: 'Podejmuj mądrzejsze decyzje zakupowe',
  },
]
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-orange-lightest flex flex-col items-center px-6 md:px-12 lg:px-20 py-12"
  >
    <h1 class="text-3xl md:text-5-xl font-extrabold tracking-tight text-gray-900 font-lato">
      Zacznij planować swój budżet już dziś i zyskaj kontrolę nad swoimi finansami
    </h1>
    <p class="mt-4 text-gray-600 text-lg md:text-xl">
      Proste narzędzie, które pomoże Ci zarządzać wydatkami, oszczędzać i realizować cele finansowe.
    </p>
    <div class="mt-6">
      <button class="rounded-2xl px-8 py-4 shadow-lg bg-orange-light btn-primary">
        Rozpocznij teraz
      </button>
    </div>
    <img
      src="@/assets/image/homeMain.jpg"
      alt="budżet"
      class="mt-8 rounded-2xl w-full max-w-2xl mx-auto"
    />

    <div class="mt-20 grid grid-cols-1 lg:grid-cols-4 gap-10 w-full ">
      <div
        v-for="(item, i) in features"
        :key="i"
        class="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
      >
        <img :src="item.img" alt="" class="w-full" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
        <p class="text-gray-600 text-sm">{{ item.desc }}</p>
      </div>
    </div>
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-6">
      Dołącz do tysięcy użytkowników i zacznij świadomie zarządzać finansami
    </h2>
    <div class="mt-6">
      <button class="rounded-2xl px-8 py-4 shadow-lg bg-orange-light btn-primary">
        Załóż konto
      </button>
    </div>
  </div>
</template>
