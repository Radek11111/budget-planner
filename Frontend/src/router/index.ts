import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuth } from '@clerk/vue'

import { useUserStore } from '@/stores/useUserStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/admin',
      name: 'adminDashboad',
      component: () => import('../views/DashboardAdmin.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const { isSignedIn } = useAuth()
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !isSignedIn) {
    return next('/')
  }
  if (to.path.startsWith('/admin') && userStore.role !== 'admin') {
    return next('/')
  }
  next()
})

export default router
