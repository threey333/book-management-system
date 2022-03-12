import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/index.vue')
  },
  {
    path: '/',
    name: 'BasicLayout',
    // redirect: '/auth',
    component: () => import(/* webpackChunkName: "BasicLayout" */ '@/layout/default.vue'),
    children: [
      {
        path: 'books',
        name: 'Book',
        component: () => import(/* webpackChunkName: "Book" */ '@/views/Books/index.vue')
      },
      {
        path: 'books/:id',
        name: 'BookDetail',
        component: () => import(/* webpackChunkName: "BookDetail" */ '@/views/BookDetail/index.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import(/* webpackChunkName: "User" */ '@/views/Users/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
