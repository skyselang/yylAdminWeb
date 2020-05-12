import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/admin/redirect')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/admin/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/admin/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/admin/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/admin/index'),
      name: 'Dashboard',
      meta: {
        title: '控制台',
        icon: 'index',
        affix: true
      }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/admin',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: 'admin',
    meta: {
      title: '系统设置',
      icon: 'setting',
      roles: ['admin/AdminMenu/menuList', 'admin/AdminUser/userList', 'admin/AdminRule/ruleList', 'admin/AdminLog/logList', 'admin/AdminUser/userCenter']
    },
    children: [
      {
        path: 'menu',
        component: () => import('@/views/admin/menu'),
        name: 'menu',
        meta: {
          title: '菜单管理',
          icon: 'menu',
          roles: ['admin/AdminMenu/menuList']
        }
      },
      {
        path: 'user',
        component: () => import('@/views/admin/user'),
        name: 'user',
        meta: {
          title: '用户管理',
          icon: 'users',
          roles: ['admin/AdminUser/userList']
        }
      },
      {
        path: 'rule',
        component: () => import('@/views/admin/rule'),
        name: 'rule',
        meta: {
          title: '权限管理',
          icon: 'rule',
          roles: ['admin/AdminRule/ruleList']
        }
      },
      {
        path: 'log',
        component: () => import('@/views/admin/log'),
        name: 'log',
        meta: {
          title: '日志管理',
          icon: 'log',
          roles: ['admin/AdminLog/logList']
        }
      },
      {
        path: 'user-center',
        component: () => import('@/views/admin/user-center'),
        name: 'user-center',
        meta: {
          title: '个人中心',
          icon: 'user-center',
          roles: ['admin/AdminUser/userCenter']
        }
      }
    ]
  },

  {
    path: '/admin-tool',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: false,
    name: 'admin-tool',
    meta: {
      title: '实用工具',
      icon: 'tool',
      roles: ['admin/AdminTool/randomStr']
    },
    children: [
      {
        path: 'tool',
        component: () => import('@/views/admin-tool/tool'),
        name: 'tool',
        meta: {
          title: '实用工具',
          icon: 'tool',
          roles: ['admin/AdminTool/randomStr']
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
