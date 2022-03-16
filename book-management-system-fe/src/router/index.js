import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'
// import { service } from '@/service'
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
    const reqArr = []
    // 1.先获取角色权限信息和用户的信息
    if (!store.state.characterInfo.length) {
      reqArr.push(store.dispatch('getCharacterInfo'))
    }
    if (!store.state.userInfo.account) {
      reqArr.push(store.dispatch('getUserInfo'))
    }
    await Promise.all(reqArr)
    console.log(store)

    // await service.user.getUserInfo()
    // console.log(res)
  } catch (error) {
    if (error.message.includes('未授权，请登录')) {
      message.error('认证失败，请重新登录')
      next('/auth')
      return
    }
  }
  next()

  // if (!store.state.characterInfo.length) {
  //   await store.dispatch('getCharacterInfo')
  // }
  // console.log(store)

  // await store.dispatch('getUserInfo')
})

export default router
