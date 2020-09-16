import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/admin/redirect/redirect')
      }
    ],
    hidden: false
  },
  {
    path: '/login',
    component: () => import('@/views/admin/login/login'),
    meta: {
      title: 'login'
    },
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/admin/error/404'),
    meta: {
      title: '404'
    },
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/admin/error/401'),
    meta: {
      title: '401'
    },
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/admin/index/index'),
        name: 'Dashboard',
        meta: {
          title: '控制台',
          icon: 'index',
          affix: true
        }
      }
    ]
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
    name: 'Admin',
    meta: {
      title: '系统管理',
      icon: 'admin'
    },
    children: [
      {
        path: 'rule',
        component: () => import('@/views/admin/rule/index'),
        name: 'Rule',
        meta: {
          title: '权限管理',
          icon: 'rule'
        },
        alwaysShow: true,
        redirect: 'noRedirect',
        children: [
          {
            path: 'menu',
            component: () => import('@/views/admin/menu/menu'),
            name: 'Menu',
            meta: {
              title: '菜单管理',
              icon: 'rule',
              roles: ['admin/AdminMenu/menuList']
            }
          },
          {
            path: 'role',
            component: () => import('@/views/admin/role/role'),
            name: 'Role',
            meta: {
              title: '角色管理',
              icon: 'rule',
              roles: ['admin/AdminRole/roleList']
            }
          },
          {
            path: 'user',
            component: () => import('@/views/admin/user/user'),
            name: 'User',
            meta: {
              title: '用户管理',
              icon: 'rule',
              roles: ['admin/AdminUser/userList']
            }
          }]
      },
      {
        path: 'log',
        component: () => import('@/views/admin/log/index'),
        name: 'Log',
        meta: {
          title: '日志管理',
          icon: 'log'
        },
        children: [
          {
            path: 'login',
            component: () => import('@/views/admin/log/login'),
            name: 'Login',
            meta: {
              title: '登录日志',
              icon: 'log',
              roles: ['admin/AdminLog/logList']
            }
          },
          {
            path: 'action',
            component: () => import('@/views/admin/log/action'),
            name: 'Action',
            meta: {
              title: '操作日志',
              icon: 'log',
              roles: ['admin/AdminLog/logList']
            }
          }
        ]
      },
      {
        path: 'users',
        component: () => import('@/views/admin/users/index'),
        name: 'Users',
        meta: {
          title: '个人中心',
          icon: 'users'
        },
        alwaysShow: true,
        redirect: 'noRedirect',
        children: [
          {
            path: 'info',
            component: () => import('@/views/admin/users/info'),
            name: 'Info',
            meta: {
              title: '个人信息',
              icon: 'users',
              roles: ['admin/AdminUsers/usersInfo']
            }
          },
          {
            path: 'edit',
            component: () => import('@/views/admin/users/edit'),
            name: 'Edit',
            meta: {
              title: '修改信息',
              icon: 'users',
              roles: ['admin/AdminUsers/usersEdit']
            }
          },
          {
            path: 'pwd',
            component: () => import('@/views/admin/users/pwd'),
            name: 'Pwd',
            meta: {
              title: '修改密码',
              icon: 'users',
              roles: ['admin/AdminUsers/usersPwd']
            }
          },
          {
            path: 'avatar',
            component: () => import('@/views/admin/users/avatar'),
            name: 'Avatar',
            meta: {
              title: '修改头像',
              icon: 'users',
              roles: ['admin/AdminUsers/usersAvatar']
            }
          },
          {
            path: 'logs',
            component: () => import('@/views/admin/users/logs'),
            name: 'Logs',
            meta: {
              title: '个人日志',
              icon: 'users',
              roles: ['admin/AdminUsers/usersLog']
            }
          }
        ]
      },
      {
        path: 'visit',
        component: () => import('@/views/admin/visit/index'),
        name: 'Visit',
        meta: {
          title: '访问统计',
          icon: 'eye-open'
        },
        alwaysShow: true,
        redirect: 'noRedirect',
        children: [
          {
            path: 'count',
            component: () => import('@/views/admin/visit/count'),
            name: 'Count',
            meta: {
              title: '数量统计',
              icon: 'eye-open',
              roles: ['admin/AdminVisit/visitCount']
            }
          },
          {
            path: 'date',
            component: () => import('@/views/admin/visit/date'),
            name: 'Date',
            meta: {
              title: '日期统计',
              icon: 'eye-open',
              roles: ['admin/AdminVisit/visitDate']
            }
          },
          {
            path: 'stats',
            component: () => import('@/views/admin/visit/stats'),
            name: 'Stats',
            meta: {
              title: '访问统计',
              icon: 'eye-open',
              roles: ['admin/AdminVisit/visitStats']
            }
          }
        ]
      },
      {
        path: 'setting',
        component: () => import('@/views/admin/setting/index'),
        name: 'Setting',
        meta: {
          title: '系统设置',
          icon: 'setting'
        },
        alwaysShow: true,
        redirect: 'noRedirect',
        children: [
          {
            path: 'base',
            component: () => import('@/views/admin/setting/base'),
            name: 'Base',
            meta: {
              title: '基础设置',
              icon: 'setting',
              roles: ['admin/AdminSetting/settingBase']
            }
          },
          {
            path: 'cache',
            component: () => import('@/views/admin/setting/cache'),
            name: 'Cache',
            meta: {
              title: '缓存设置',
              icon: 'setting',
              roles: ['admin/AdminSetting/settingCache']
            }
          },
          {
            path: 'verify',
            component: () => import('@/views/admin/setting/verify'),
            name: 'Verify',
            meta: {
              title: '验证码设置',
              icon: 'setting',
              roles: ['admin/AdminSetting/settingVerify']
            }
          },
          {
            path: 'token',
            component: () => import('@/views/admin/setting/token'),
            name: 'Token',
            meta: {
              title: 'Token设置',
              icon: 'setting',
              roles: ['admin/AdminSetting/settingToken']
            }
          }
        ]
      }
    ]
  },

  {
    path: '/tool',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: 'Tool',
    meta: {
      title: '实用工具',
      icon: 'tool'
    },
    children: [
      {
        path: 'tools',
        component: () => import('@/views/admin/tool/tools'),
        name: 'Tools',
        meta: {
          title: '实用工具合集',
          icon: 'tools',
          roles: ['admin/AdminTool/tools']
        }
      },
      {
        path: 'map-point',
        component: () => import('@/views/admin/tool/map-point'),
        name: 'MapPoint',
        meta: {
          title: '地图坐标拾取',
          icon: 'mapPoint',
          roles: ['admin/AdminTool/mapPoint']
        }
      }
    ]
  },

  {
    path: '/logout',
    component: () => import('@/views/admin/login/logout'),
    alwaysShow: false,
    name: 'Logout',
    meta: {
      title: '退出',
      icon: 'logout',
      roles: ['admin/AdminLogin/logout']
    }
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
