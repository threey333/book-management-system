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
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import(/* webpackChunkName: "Log" */ '@/views/Log/index.vue')
      },
      {
        path: 'reset/password',
        name: 'ResetPassword',
        component: () => import(/* webpackChunkName: "ResetPassword" */ '@/views/ResetPassword/index.vue')
      },
      {
        path: 'invite-code',
        name: 'InviteCode',
        component: () => import(/* webpackChunkName: "InviteCode" */ '@/views/InviteCode/index.vue')
      },
      {
        path: 'book-classify',
        name: 'BookClassify',
        component: () => import(/* webpackChunkName: "BookClassify" */ '@/views/BookClassify/index.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "Profile" */ '@/views/Profile/index.vue')
      },
      {
        path: 'dashboard',
        name: 'DashBoard',
        component: () => import(/* webpackChunkName: "DashBoard" */ '@/views/DashBoard/index.vue')
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
  const res = {}
  try {
    await service.user.getUserInfo()
  } catch (error) {
    if (error.message.includes('?????????????????????')) {
      res.code = 401
    }
  }
  const { code } = res
  if (code === 401) {
    if (to.path === '/auth') {
      next()
      return
    }
    message.error('??????????????????????????????')
    next('/auth')
    return
  }

  // 1.???????????????????????????
  if (!store.state.characterInfo.length) {
    await store.dispatch('getCharacterInfo')
  }

  const reqArr = []
  if (!store.state.userInfo.account) {
    reqArr.push(store.dispatch('getUserInfo'))
  }
  if (!store.state.bookClassify.length) {
    reqArr.push(store.dispatch('getBookClassify'))
  }

  await Promise.all(reqArr)
  console.log(store)

  if (isAuthPath(to)) {
    next('/books')
    return
  }

  next()
})

export default router
