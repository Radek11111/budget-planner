<script setup lang="ts">
import { useAuth } from '@clerk/vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'

const users = ref<any[]>([])
const loading = ref(true)
const { getToken } = useAuth()

onMounted(async () => {
  try {
    const token = await getToken.value()
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    users.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Panel Administratora</h1>
    <div v-if="loading" class="">Ładowanie użytkowników...</div>
    <div v-else class="">
      <h2 class="text-xl font-bold mb-2">Lista użytkowników</h2>
      <table class="w-full border">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">ID</th>
            <th class="border p-2">Email</th>
            <th class="border p-2">Rola</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="border p-2">{{ user.id }}</td>
            <td class="border p-2">{{ user.email }}</td>
            <td class="border p-2">{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
