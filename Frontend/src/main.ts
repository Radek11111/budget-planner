import './assets/main.css'
import { clerkPlugin } from '@clerk/vue'
import { addIcons, OhVueIcon } from 'oh-vue-icons'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import {
  FaPiggyBank,
  FaShoppingCart,
  IoWalletOutline,
  LaAngleDoubleDownSolid,
  PxPlus,
  LaSpinnerSolid,
} from 'oh-vue-icons/icons'
addIcons(IoWalletOutline, FaShoppingCart, FaPiggyBank, LaAngleDoubleDownSolid, PxPlus, LaSpinnerSolid)

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const app = createApp(App)
app.use(clerkPlugin, {
  publishableKey: clerkPubKey,
})

app.use(createPinia())
app.use(router)
app.component('v-icon', OhVueIcon)
app.mount('#app')
