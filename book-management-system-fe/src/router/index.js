import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'
import { service } from '@/service'
import { message } from 'ant-design-vue'

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/index.vue')
  },
  {
    path: '/',
    name: 'BasicLayout',
    redirect: '/auth',
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

const isAuthPath = (to) => {
  const { path } = to
  return path === '/auth'
}

router.beforeEach(async (to, from, next) => {
  if (isAuthPath(to)) {
    next()
    return
  }
  try {
    await service.user.getUserInfo()
  } catch (error) {
    console.log(error.message)
    if (error.message.includes('未授权，请登录')) {
      console.log(2222222)
      message.error('认证失败，请重新登录')
      next('/auth')
      return
    }
  }

  if (!store.state.characterInfo.length) {
    await store.dispatch('getCharacterInfo')
  }
  console.log(store)

  await store.dispatch('getUserInfo')
  next()
})

export default router
