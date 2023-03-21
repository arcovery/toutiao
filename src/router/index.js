import Vue from 'vue'
import VueRouter from 'vue-router'

import users from './modules/users'
import store from '@/store'

Vue.use(VueRouter)

const routes = [...users]

const router = new VueRouter({
  // mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
  // scrollBehavior() {
  //   return { x: 0, y: 0 }
  // },
})
// 前置路由
router.beforeEach((to, from, next) => {
  if (to.meta.isLogin) {
    if (store.state.users.token.token) {
      next()
    } else {
      next({
        name: 'login',
        query: {
          back: to.path,
        },
      })
    }
  } else {
    next()
  }
})
// 解决3.1版本后在控制台出现的警告
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}
export default router
