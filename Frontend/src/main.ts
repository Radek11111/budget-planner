import './assets/main.css'
import { clerkPlugin } from '@clerk/vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const app = createApp(App)
app.use(clerkPlugin, {
  publishableKey: clerkPubKey,
})

app.use(createPinia())
app.use(router)

app.mount('#app')
