import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/marketing',
      name: 'marketing',
      component: () => import('../views/MarketingView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductListView.vue'),
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      props: true
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/auth/:tab?',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      props: true,
      meta: { 
        guestOnly: true 
      }
    },
    {
      path: '/login',
      name: 'login',
      redirect: { name: 'auth', params: { tab: 'login' } }
    },
    {
      path: '/register',
      name: 'register',
      redirect: { name: 'auth', params: { tab: 'register' } }
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      redirect: { name: 'auth', params: { tab: 'forgotPassword' } }
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      redirect: { name: 'auth', params: { tab: 'resetPassword' } }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView
    }
  ],
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // Redirect authenticated users away from guest-only pages
  if (to.meta.guestOnly && userStore.isAuthenticated) {
    next({ path: '/' })
    return
  }
  
  // Redirect unauthenticated users away from protected pages
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ 
      name: 'login', 
      query: { redirect: to.fullPath } 
    })
    return
  }
  
  next()
})

export default router
