import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { useUserStore } from '@/stores/useUserStore'
import { useAuth } from '@clerk/vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/user',
      name: 'userHome',
      component: () => import('../views/UserHomeView.vue'),
      meta: {
        requiresAuth: true,
      },
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
  const { isSignedIn, isLoaded } = useAuth()
  const userStore = useUserStore()
  if (!isLoaded.value) {
    return next()
  }

  if (to.meta.requiresAuth && !isSignedIn.value) {
    return next('/')
  }
  if (to.path === '/' && isSignedIn.value) {
    return next('/user')
  }

  if (to.path.startsWith('/admin') && userStore.role !== 'admin') {
    return next('/')
  }
  next()
})

export default router
