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
 * // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * redirect: 'noRedirect'
 *
 * // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式
 * // 只有一个时，会将那个子路由当做根路由显示在侧边栏
 * // 若你想不管路由下面的 children 声明的个数多少都显示你的根路由
 * // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * alwaysShow: true
 *
 * // 设定路由的名字，一定要填写且与vue文件name一致，不然使用<keep-alive>时会出现各种问题
 * name: 'Index'
 * meta: {
 *   roles: ['admin/Index/index'] // 设置该路由进入的权限（菜单链接），支持多个权限叠加
 *   title: '控制台' // 设置该路由在侧边栏和面包屑中展示的名字
 *   icon: 'el-icon-s-home' // 设置该路由的图标，element-ui 的 icon
 *   noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 *   breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
 *   affix: true // 若果设置为true，它则会固定在tags-view中(默认 false)
 *   // 当路由设置了该属性，则会高亮相对应的侧边栏。
 *   // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
 *   // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
 *   activeMenu: '/article/list'
 * }
 */

/**
 * constantRoutes
 * 不需要动态判断权限的路由，如登录、404、401等页面
 * 所有用户都可以访问
 */
export const constantRoutes = [
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

/**
 * asyncRoutes
 * 需要动态判断权限并通过 addRoutes 动态添加的页面
 * 需要分配相应权限才可以访问
 */
export const asyncRoutes = [
  {
    path: '/member',
    name: 'member',
    meta: {
      title: '会员管理',
      icon: 'el-icon-user',
      roles: [
        'admin/Member/list',
        'admin/MemberLog/list',
        'admin/MemberLog/stat',
        'admin/Member/stat'
      ]
    },
    redirect: 'noRedirect',
    component: Layout,
    alwaysShow: true,
    children: [
      {
        path: 'member',
        name: 'Member',
        meta: {
          title: '会员管理',
          icon: 'el-icon-user',
          roles: ['admin/Member/list']
        },
        component: () => import('@/views/member/member')
      },
      {
        path: 'member-log',
        name: 'MemberLog',
        meta: {
          title: '会员日志',
          icon: 'el-icon-user',
          roles: ['admin/MemberLog/list']
        },
        component: () => import('@/views/member/member-log')
      },
      {
        path: 'member-stat',
        name: 'MemberStat',
        meta: {
          title: '会员统计',
          icon: 'el-icon-user',
          roles: ['admin/Member/stat']
        },
        component: () => import('@/views/member/member-stat')
      },
      {
        path: 'member-log-stat',
        name: 'MemberLogStat',
        meta: {
          title: '会员日志统计',
          icon: 'el-icon-user',
          roles: ['admin/MemberLog/stat']
        },
        component: () => import('@/views/member/member-log-stat')
      }
    ]
  },
  {
    path: '/cms',
    name: 'cms',
    meta: {
      title: '内容管理',
      icon: 'el-icon-reading',
      roles: [
        'admin/cms.Content/list',
        'admin/cms.Category/list',
        'admin/cms.Comment/list',
        'admin/cms.Setting/info'
      ]
    },
    redirect: 'noRedirect',
    component: Layout,
    alwaysShow: true,
    children: [
      {
        path: 'content',
        name: 'CmsContent',
        meta: {
          title: '内容管理',
          icon: 'el-icon-reading',
          roles: ['admin/cms.Content/list']
        },
        component: () => import('@/views/cms/content')
      },
      {
        path: 'category',
        name: 'CmsCategory',
        meta: {
          title: '内容分类',
          icon: 'el-icon-reading',
          roles: ['admin/cms.Category/list']
        },
        component: () => import('@/views/cms/category')
      },
      {
        path: 'comment',
        name: 'CmsComment',
        meta: {
          title: '留言管理',
          icon: 'el-icon-reading',
          roles: ['admin/cms.Comment/list']
        },
        component: () => import('@/views/cms/comment')
      },
      {
        path: 'setting',
        name: 'CmsSetting',
        meta: {
          title: '内容设置',
          icon: 'el-icon-reading',
          roles: ['admin/cms.Setting/info']
        },
        component: () => import('@/views/cms/setting')
      }
    ]
  },
  {
    path: '/file',
    name: 'file',
    meta: {
      title: '文件管理',
      icon: 'el-icon-folder',
      roles: [
        'admin/file.File/list',
        'admin/file.Group/list',
        'admin/file.Setting/info'
      ]
    },
    redirect: 'noRedirect',
    component: Layout,
    alwaysShow: true,
    children: [
      {
        path: 'file',
        name: 'FileFile',
        meta: {
          title: '文件管理',
          icon: 'el-icon-folder',
          roles: ['admin/file.File/list']
        },
        component: () => import('@/views/file/file')
      },
      {
        path: 'group',
        name: 'FileGroup',
        meta: {
          title: '文件分组',
          icon: 'el-icon-folder',
          roles: ['admin/file.Group/list']
        },
        component: () => import('@/views/file/group')
      },
      {
        path: 'setting',
        name: 'FileSetting',
        meta: {
          title: '文件设置',
          icon: 'el-icon-folder',
          roles: ['admin/file.Setting/info']
        },
        component: () => import('@/views/file/setting')
      }
    ]
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      title: '设置管理',
      icon: 'el-icon-setting',
      roles: [
        'admin/Api/list',
        'admin/Setting/tokenInfo',
        'admin/Setting/captchaInfo',
        'admin/Setting/logInfo',
        'admin/Setting/apiInfo',
        'admin/SettingWechat/offiInfo',
        'admin/SettingWechat/miniInfo',
        'admin/Region/list'
      ]
    },
    redirect: 'noRedirect',
    component: Layout,
    alwaysShow: true,
    children: [
      {
        path: 'api',
        name: 'SettingApi',
        meta: {
          title: '接口管理',
          icon: 'el-icon-setting',
          roles: ['admin/Api/list']
        },
        component: () => import('@/views/api/api')
      },
      {
        path: 'wechat',
        name: 'SettingWechat',
        meta: {
          title: '微信设置',
          icon: 'el-icon-setting',
          roles: ['admin/SettingWechat/offiInfo', 'admin/SettingWechat/miniInfo']
        },
        component: () => import('@/views/setting/wechat')
      },
      {
        path: 'region',
        name: 'SettingRegion',
        meta: {
          title: '地区管理',
          icon: 'el-icon-setting',
          roles: ['admin/Region/list']
        },
        component: () => import('@/views/region/region')
      },
      {
        path: 'base',
        name: 'SettingBase',
        meta: {
          title: '基础设置',
          icon: 'el-icon-setting',
          roles: [
            'admin/Setting/tokenInfo',
            'admin/Setting/captchaInfo',
            'admin/Setting/logInfo',
            'admin/Setting/apiInfo'
          ]
        },
        component: () => import('@/views/setting/base')
      }
    ]
  },

  {
    path: '/admin/rule',
    name: 'AdminRule',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock',
      roles: [
        'admin/admin.Menu/list',
        'admin/admin.Role/list',
        'admin/admin.User/list',
        'admin/admin.UserLog/list',
        'admin/admin.UserLog/stat',
        'admin/admin.UserCenter/info'
      ]
    },
    redirect: 'noRedirect',
    component: Layout,
    alwaysShow: true,
    children: [
      {
        path: 'menu',
        name: 'AdminMenu',
        meta: {
          title: '菜单管理',
          icon: 'el-icon-lock',
          roles: ['admin/admin.Menu/list']
        },
        component: () => import('@/views/admin/menu/menu')
      },
      {
        path: 'role',
        name: 'AdminRole',
        meta: {
          title: '角色管理',
          icon: 'el-icon-lock',
          roles: ['admin/admin.Role/list']
        },
        component: () => import('@/views/admin/role/role')
      },
      {
        path: 'user',
        name: 'AdminUser',
        meta: {
          title: '用户管理',
          icon: 'el-icon-lock',
          roles: ['admin/admin.User/list']
        },
        component: () => import('@/views/admin/user/user')
      },
      {
        path: 'user-log',
        name: 'AdminUserLog',
        meta: {
          title: '用户日志',
          icon: 'el-icon-lock',
          roles: ['admin/admin.UserLog/list']
        },
        component: () => import('@/views/admin/user/user-log')
      },
      {
        path: 'user-center',
        name: 'AdminUserCenter',
        meta: {
          title: '个人中心',
          icon: 'el-icon-lock',
          roles: ['admin/admin.UserCenter/info']
        },
        component: () => import('@/views/admin/user/user-center')
      },
      {
        path: 'user-log-stat',
        name: 'AdminUserLogStat',
        meta: {
          title: '用户日志统计',
          icon: 'el-icon-lock',
          roles: ['admin/admin.UserLog/stat']
        },
        component: () => import('@/views/admin/user/user-log-stat')
      }
    ]
  },

  {
    path: '/admin/system',
    name: 'AdminSystem',
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-tools',
      roles: [
        'admin/admin.Setting/cacheInfo',
        'admin/admin.Setting/tokenInfo',
        'admin/admin.Setting/captchaInfo',
        'admin/admin.Setting/logInfo',
        'admin/admin.Setting/apiInfo',
        'admin/admin.Apidoc/apidoc',
        'admin/admin.Utils/utils'
      ]
    },
    redirect: 'noRedirect',
    component: Layout,
    alwaysShow: true,
    children: [
      {
        path: 'setting',
        name: 'AdminSystemSetting',
        meta: {
          title: '设置管理',
          icon: 'el-icon-s-tools',
          roles: [
            'admin/admin.Setting/cacheInfo',
            'admin/admin.Setting/tokenInfo',
            'admin/admin.Setting/captchaInfo',
            'admin/admin.Setting/logInfo',
            'admin/admin.Setting/apiInfo',
            'admin/admin.Setting/systemInfo'
          ]
        },
        component: () => import('@/views/admin/setting/setting')
      },
      {
        path: 'apidoc',
        name: 'AdminSystemApidoc',
        meta: {
          title: '接口文档',
          icon: 'el-icon-s-tools',
          roles: ['admin/admin.Apidoc/apidoc']
        },
        component: () => import('@/views/admin/apidoc/apidoc')
      },
      {
        path: 'utils',
        name: 'AdminSystemUtils',
        meta: {
          title: '实用工具',
          icon: 'el-icon-s-tools',
          roles: ['admin/admin.Utils/utils']
        },
        component: () => import('@/views/admin/utils/utils')
      }
    ]
  },

  // 404页面必须放在最后!!!
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
