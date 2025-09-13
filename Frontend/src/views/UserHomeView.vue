<script setup lang="ts">
import router from '@/router';

import { useAuth } from '@clerk/vue';
import { watch } from 'vue';




const { isLoaded, isSignedIn } = useAuth()

watch(
  () => isSignedIn.value,
  (signedIn) => {
    if (isLoaded.value && signedIn && router.currentRoute.value.path === '/') {
      router.replace('/user')
    }
  },
  { immediate: true },
)

</script>


<template></template>