import './assets/main.css'
import { clerkPlugin } from '@clerk/vue'
import { addIcons, OhVueIcon } from 'oh-vue-icons'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { motion } from 'framer-motion'
import {
  FaPiggyBank,
  FaShoppingCart,
  IoWalletOutline,
  LaAngleDoubleDownSolid,
  PxPlus,
  LaSpinnerSolid,
  FaTrashAlt,
  OiThreeBars,
  RiHomeHeartFill,
  FaUser,
  RiLogoutBoxLine,
  LaWindowClose,
} from 'oh-vue-icons/icons'
addIcons(
  IoWalletOutline,
  FaShoppingCart,
  FaPiggyBank,
  LaAngleDoubleDownSolid,
  PxPlus,
  LaSpinnerSolid,
  FaTrashAlt,
  OiThreeBars,
  RiHomeHeartFill,
  FaUser,
  RiLogoutBoxLine,
  LaWindowClose,
)

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const app = createApp(App)
app.use(clerkPlugin, {
  publishableKey: clerkPubKey,
})
app.use(VueSweetalert2)
app.use(createPinia())
app.use(router)
app.component('v-icon', OhVueIcon)
app.component('MotionDiv', motion.div)
app.mount('#app')
