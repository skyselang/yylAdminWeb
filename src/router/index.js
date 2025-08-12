import { createRouter, createWebHashHistory } from 'vue-router'
export const Layout = () => import('@/layout/index.vue')

/**
 * 基础路由
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/system/system/redirect.vue')
      }
    ]
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/system/system/login.vue'),
    meta: { title: '登录', hidden: true }
  },

  {
    path: '/',
    name: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/system/system/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          affix: true,
          keepAlive: true,
          alwaysShow: false
        }
      },
      {
        path: 'user-center',
        component: () => import('@/views/system/user-center/index.vue'),
        name: 'UserCenter',
        meta: { title: '个人中心', hidden: true }
      },
      {
        path: 'user-message',
        component: () => import('@/views/system/user-center/component/Message.vue'),
        name: 'UserMessage',
        meta: { title: '我的消息', hidden: true }
      },
      {
        path: 'user-setting',
        component: () => import('@/views/system/system/setting.vue'),
        name: 'UserSetting',
        meta: { title: '我的设置', hidden: true }
      },
      {
        path: '401',
        name: '401',
        component: () => import('@/views/system/system/401.vue'),
        meta: { title: '401', hidden: true }
      },
      {
        path: '404',
        name: '404',
        component: () => import('@/views/system/system/404.vue'),
        meta: { title: '404', hidden: true }
      }
    ]
  }
]

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' })
}

export default router
