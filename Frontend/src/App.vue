
<script setup lang="ts">
import SignIn from '@/components/SignIn.vue' 
</script>

<template>
  <div id="app">
    <header class="p-4 border-b">
      <div class="container mx-auto flex justify-end">
        <SignIn />
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>