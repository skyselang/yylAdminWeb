import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* 路由模块 */

/**
 * 配置说明
 *
 * // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * hidden: true // (默认 false)
 *
 * //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * redirect: 'noRedirect'
 *
 * // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 * // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 * // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 * // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * alwaysShow: true
 *
 * name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta: {
 *   roles: ['admin', 'editor'] // 设置该路由进入的权限（菜单链接），支持多个权限叠加
 *   title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
 *   icon: 'el-icon-x' // 设置该路由的图标，element-ui 的 icon
 *   noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 *   breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
 *   affix: true // 若果设置为true，它则会固定在tags-view中(默认 false)
 *
 *   // 当路由设置了该属性，则会高亮相对应的侧边栏。
 *   // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
 *   // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
 *   activeMenu: '/article/list'
 * }
 */

/**
 * constantRoutes
 * 不需要动态判断权限的路由，如登录页、404、等页面
 * 所有用户都可以访问
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
          icon: 'el-icon-s-home',
          affix: true
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * 需要动态判断权限并通过 addRoutes 动态添加的页面
 * 需要分配相应权限才可以访问
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
      icon: 'el-icon-s-operation'
    },
    children: [
      {
        path: 'rule',
        component: () => import('@/views/admin/rule/index'),
        name: 'Rule',
        meta: {
          title: '权限管理',
          icon: 'el-icon-lock'
        },
        redirect: 'noRedirect',
        alwaysShow: true,
        children: [
          {
            path: 'menu',
            component: () => import('@/views/admin/rule/menu'),
            name: 'Menu',
            meta: {
              title: '菜单管理',
              icon: 'el-icon-menu',
              roles: ['admin/AdminMenu/menuList']
            }
          },
          {
            path: 'role',
            component: () => import('@/views/admin/rule/role'),
            name: 'Role',
            meta: {
              title: '角色管理',
              icon: 'el-icon-s-custom',
              roles: ['admin/AdminRole/roleList']
            }
          },
          {
            path: 'user',
            component: () => import('@/views/admin/rule/user'),
            name: 'User',
            meta: {
              title: '用户管理',
              icon: 'el-icon-user',
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
          icon: 'el-icon-date'
        },
        redirect: 'noRedirect',
        alwaysShow: true,
        children: [
          {
            path: 'logins',
            component: () => import('@/views/admin/log/logins'),
            name: 'Logins',
            meta: {
              title: '登录日志',
              icon: 'el-icon-date',
              roles: ['admin/AdminLog/logList']
            }
          },
          {
            path: 'action',
            component: () => import('@/views/admin/log/action'),
            name: 'Action',
            meta: {
              title: '操作日志',
              icon: 'el-icon-date',
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
          icon: 'el-icon-user-solid'
        },
        redirect: 'noRedirect',
        alwaysShow: true,
        children: [
          {
            path: 'info',
            component: () => import('@/views/admin/users/info'),
            name: 'Info',
            meta: {
              title: '个人信息',
              icon: 'el-icon-user-solid',
              roles: ['admin/AdminUsers/usersInfo']
            }
          },
          {
            path: 'edit',
            component: () => import('@/views/admin/users/edit'),
            name: 'Edit',
            meta: {
              title: '修改信息',
              icon: 'el-icon-user-solid',
              roles: ['admin/AdminUsers/usersEdit']
            }
          },
          {
            path: 'pwd',
            component: () => import('@/views/admin/users/pwd'),
            name: 'Pwd',
            meta: {
              title: '修改密码',
              icon: 'el-icon-user-solid',
              roles: ['admin/AdminUsers/usersPwd']
            }
          },
          {
            path: 'avatar',
            component: () => import('@/views/admin/users/avatar'),
            name: 'Avatar',
            meta: {
              title: '修改头像',
              icon: 'el-icon-user-solid',
              roles: ['admin/AdminUsers/usersAvatar']
            }
          },
          {
            path: 'logs',
            component: () => import('@/views/admin/users/logs'),
            name: 'Logs',
            meta: {
              title: '个人日志',
              icon: 'el-icon-user-solid',
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
          icon: 'el-icon-s-data'
        },
        redirect: 'noRedirect',
        alwaysShow: true,
        children: [
          {
            path: 'count',
            component: () => import('@/views/admin/visit/count'),
            name: 'Count',
            meta: {
              title: '数量统计',
              icon: 'el-icon-s-data',
              roles: ['admin/AdminVisit/visitCount']
            }
          },
          {
            path: 'date',
            component: () => import('@/views/admin/visit/date'),
            name: 'Date',
            meta: {
              title: '日期统计',
              icon: 'el-icon-s-data',
              roles: ['admin/AdminVisit/visitDate']
            }
          },
          {
            path: 'stats',
            component: () => import('@/views/admin/visit/stats'),
            name: 'Stats',
            meta: {
              title: '访问统计',
              icon: 'el-icon-s-data',
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
          icon: 'el-icon-setting'
        },
        redirect: 'noRedirect',
        alwaysShow: true,
        children: [
          {
            path: 'base',
            component: () => import('@/views/admin/setting/base'),
            name: 'Base',
            meta: {
              title: '基本设置',
              icon: 'el-icon-setting',
              roles: ['admin/AdminSetting/settingBase']
            }
          },
          {
            path: 'cache',
            component: () => import('@/views/admin/setting/cache'),
            name: 'Cache',
            meta: {
              title: '缓存设置',
              icon: 'el-icon-setting',
              roles: ['admin/AdminSetting/settingCache']
            }
          },
          {
            path: 'verify',
            component: () => import('@/views/admin/setting/verify'),
            name: 'Verify',
            meta: {
              title: '验证码设置',
              icon: 'el-icon-setting',
              roles: ['admin/AdminSetting/settingVerify']
            }
          },
          {
            path: 'token',
            component: () => import('@/views/admin/setting/token'),
            name: 'Token',
            meta: {
              title: 'Token设置',
              icon: 'el-icon-setting',
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
      icon: 'el-icon-fork-spoon'
    },
    children: [
      {
        path: 'gather',
        component: () => import('@/views/admin/tool/gather'),
        name: 'Gather',
        meta: {
          title: '实用工具合集',
          icon: 'el-icon-knife-fork',
          roles: ['admin/AdminTool/gather']
        }
      },
      {
        path: 'map',
        component: () => import('@/views/admin/tool/map'),
        name: 'Map',
        meta: {
          title: '地图坐标拾取',
          icon: 'el-icon-map-location',
          roles: ['admin/AdminTool/map']
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
      icon: 'el-icon-switch-button',
      roles: ['admin/AdminLogin/logout']
    }
  },

  // 404页面必须放在最后 !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // 去掉url中的#号，需要服务器支持
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
