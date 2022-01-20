import Layout from '@/layout'

export const constant = [
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/admin/base/redirect')
      }
    ]
  },
  {
    path: '/login',
    meta: {
      title: '登录'
    },
    hidden: true,
    component: () => import('@/views/admin/login/login')
  },
  {
    path: '/404',
    meta: {
      title: '404'
    },
    hidden: true,
    component: () => import('@/views/admin/base/404')
  },
  {
    path: '/401',
    meta: {
      title: '401'
    },
    hidden: true,
    component: () => import('@/views/admin/base/401')
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: {
          title: '控制台',
          icon: 'el-icon-s-home',
          affix: true
        },
        component: () => import('@/views/index/index')
      }
    ]
  }
]
export default constant
