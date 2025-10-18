import './assets/main.css'
import { clerkPlugin } from '@clerk/vue'
import { addIcons, OhVueIcon } from 'oh-vue-icons'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { MotionPlugin } from '@vueuse/motion'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
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
  BiFileArrowUpFill,
  BiFileArrowDownFill,
  IoWallet,
  MdLocalgrocerystoreRound,
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
  BiFileArrowDownFill,
  BiFileArrowUpFill,
  IoWallet,
  MdLocalgrocerystoreRound,
)

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
dayjs().locale('pl')
const app = createApp(App)
app.use(clerkPlugin, {
  publishableKey: clerkPubKey,
})
app.use(MotionPlugin)
app.use(VueSweetalert2)
app.use(createPinia())
app.use(router)
app.component('v-icon', OhVueIcon)
app.mount('#app')
