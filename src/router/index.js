import { createRouter, createWebHashHistory } from 'vue-router'
export const Layout = () => import('@/layout/index.vue')

/**
 * 静态路由
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/system/components/SystemRedirect.vue')
      }
    ]
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/system/login.vue'),
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
        component: () => import('@/views/system/index.vue'),
        meta: {
          title: 'dashboard',
          icon: 'home-filled',
          affix: true,
          keepAlive: true,
          alwaysShow: false
        }
      },
      {
        path: 'setting',
        component: () => import('@/views/system/components/SystemSetting.vue'),
        name: 'Setting',
        meta: { title: 'System setting', hidden: true }
      },
      {
        path: '401',
        name: '401',
        component: () => import('@/views/system/components/System401.vue'),
        meta: { title: '401', hidden: true }
      },
      {
        path: '404',
        name: '404',
        component: () => import('@/views/system/components/System404.vue'),
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
