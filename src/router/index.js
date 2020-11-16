import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Checkout.vue')
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue')
  },
  {
    path: '/signup',
    name: 'Sign up',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/reset',
    name: 'Reset',
    component: () => import('../views/Reset.vue')
  },
  {
    path: '/:vendor',
    name: 'Vendor',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'auctions/:auction',
        name: 'Vendor auction',
        component: () => import('../views/Home.vue')
      }
    ]
  },
  {
    path: '/auctions/:auction',
    name: 'Auction',
    component: () => import('../views/Home.vue')
  }
]

const router = new VueRouter({
  scrollBehavior (to, from) {
    if (!from.path.includes('auctions') && !to.path.includes('auctions')) {
      return { x: 0, y: 0 }
    }
  },
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
