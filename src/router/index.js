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
 * // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
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
        component: () => import('@/views/admin/index/index')
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
    path: '/members',
    name: 'Members',
    meta: {
      title: '会员管理',
      icon: 'el-icon-menu',
      roles: ['admin/Member/list', 'admin/MemberLog/list']
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
          icon: 'el-icon-s-grid',
          roles: ['admin/Member/list']
        },
        component: () => import('@/views/member/member')
      },
      {
        path: 'member-log',
        name: 'MemberLog',
        meta: {
          title: '会员日志',
          icon: 'el-icon-s-grid',
          roles: ['admin/MemberLog/list']
        },
        component: () => import('@/views/member/member-log')
      },
      {
        path: 'member-log-stat',
        name: 'MemberLogStat',
        meta: {
          title: '会员日志统计',
          icon: 'el-icon-s-grid',
          roles: ['admin/MemberLog/stat'],
          activeMenu: '/members/member-log'
        },
        component: () => import('@/views/member/member-log-stat'),
        hidden: true
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
        'admin/Article/list',
        'admin/ArticleCategory/list',
        'admin/Carousel/list',
        'admin/Download/list',
        'admin/DownloadCategory/list',
        'admin/News/list',
        'admin/NewsCategory/list',
        'admin/Product/list',
        'admin/ProductCategory/list',
        'admin/Project/list',
        'admin/ProjectCategory/list',
        'admin/Video/list',
        'admin/VideoCategory/list',
        'admin/Links/list',
        'admin/Comment/list',
        'admin/SettingCms/cmsInfo'
      ]
    },
    redirect: 'noRedirect',
    component: Layout,
    alwaysShow: true,
    children: [
      {
        path: 'article',
        name: 'Article',
        meta: {
          title: '文章管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/Article/list']
        },
        component: () => import('@/views/cms/article/article')
      },
      {
        path: 'article-category',
        name: 'ArticleCategory',
        meta: {
          title: '文章分类',
          icon: 'el-icon-menu',
          roles: ['admin/ArticleCategory/list']
        },
        component: () => import('@/views/cms/article/article-category')
      },
      {
        path: 'download',
        name: 'Download',
        meta: {
          title: '下载管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/Download/list']
        },
        component: () => import('@/views/cms/download/download')
      },
      {
        path: 'download-category',
        name: 'DownloadCategory',
        meta: {
          title: '下载分类',
          icon: 'el-icon-menu',
          roles: ['admin/DownloadCategory/list']
        },
        component: () => import('@/views/cms/download/download-category')
      },
      {
        path: 'news',
        name: 'News',
        meta: {
          title: '新闻管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/News/list']
        },
        component: () => import('@/views/cms/news/news')
      },
      {
        path: 'news-category',
        name: 'NewsCategory',
        meta: {
          title: '新闻分类',
          icon: 'el-icon-menu',
          roles: ['admin/NewsCategory/list']
        },
        component: () => import('@/views/cms/news/news-category')
      },
      {
        path: 'product',
        name: 'Product',
        meta: {
          title: '产品管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/Product/list']
        },
        component: () => import('@/views/cms/product/product')
      },
      {
        path: 'product-category',
        name: 'ProductCategory',
        meta: {
          title: '产品分类',
          icon: 'el-icon-menu',
          roles: ['admin/ProductCategory/list']
        },
        component: () => import('@/views/cms/product/product-category')
      },
      {
        path: 'project',
        name: 'Project',
        meta: {
          title: '案例管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/Project/list']
        },
        component: () => import('@/views/cms/project/project')
      },
      {
        path: 'project-category',
        name: 'ProjectCategory',
        meta: {
          title: '案例分类',
          icon: 'el-icon-menu',
          roles: ['admin/ProjectCategory/list']
        },
        component: () => import('@/views/cms/project/project-category')
      },
      {
        path: 'video',
        name: 'Video',
        meta: {
          title: '视频管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/Video/list']
        },
        component: () => import('@/views/cms/video/video')
      },
      {
        path: 'video-category',
        name: 'VideoCategory',
        meta: {
          title: '视频分类',
          icon: 'el-icon-menu',
          roles: ['admin/VideoCategory/list']
        },
        component: () => import('@/views/cms/video/video-category')
      },
      {
        path: 'links',
        name: 'Links',
        meta: {
          title: '友链管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/Links/list']
        },
        component: () => import('@/views/cms/links/links')
      },
      {
        path: 'carousel',
        name: 'Carousel',
        meta: {
          title: '轮播管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/Carousel/list']
        },
        component: () => import('@/views/cms/carousel/carousel')
      },
      {
        path: 'comment',
        name: 'Comment',
        meta: {
          title: '留言管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/Comment/list']
        },
        component: () => import('@/views/cms/comment/comment')
      },
      {
        path: 'setting-cms',
        name: 'SettingCms',
        meta: {
          title: '内容设置',
          icon: 'el-icon-setting',
          roles: [
            'admin/SettingCms/cmsInfo',
            'admin/SettingCms/cmsEdit'
          ]
        },
        component: () => import('@/views/cms/setting/cms')
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: {
      title: '设置管理',
      icon: 'el-icon-menu',
      roles: [
        'admin/Setting/tokenInfo',
        'admin/Setting/captchaInfo',
        'admin/Setting/logInfo',
        'admin/Setting/apiInfo',
        'admin/Api/list',
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
        path: 'base',
        name: 'Base',
        meta: {
          title: '基础设置',
          icon: 'el-icon-s-grid',
          roles: [
            'admin/Setting/tokenInfo',
            'admin/Setting/captchaInfo',
            'admin/Setting/logInfo',
            'admin/Setting/apiInfo'
          ]
        },
        component: () => import('@/views/setting/base')
      },
      {
        path: 'api',
        name: 'Api',
        meta: {
          title: '接口管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/Api/list']
        },
        component: () => import('@/views/api/api')
      },
      {
        path: 'wechat',
        name: 'Wechat',
        meta: {
          title: '微信设置',
          icon: 'el-icon-s-grid',
          roles: ['admin/SettingWechat/offiInfo', 'admin/SettingWechat/miniInfo']
        },
        component: () => import('@/views/setting/wechat')
      },
      {
        path: 'region',
        name: 'Region',
        meta: {
          title: '地区管理',
          icon: 'el-icon-s-grid',
          roles: ['admin/Region/list']
        },
        component: () => import('@/views/region/region')
      }
    ]
  },

  {
    path: '/admin/rule',
    name: 'Rule',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock',
      roles: [
        'admin/AdminMenu/list',
        'admin/AdminRole/list',
        'admin/AdminUser/list',
        'admin/AdminUserLog/list',
        'admin/AdminUserCenter/info'
      ]
    },
    redirect: 'noRedirect',
    component: Layout,
    alwaysShow: true,
    children: [
      {
        path: 'menu',
        name: 'Menu',
        meta: {
          title: '菜单管理',
          icon: 'el-icon-menu',
          roles: ['admin/AdminMenu/list']
        },
        component: () => import('@/views/admin/menu/menu')
      },
      {
        path: 'role',
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'el-icon-s-custom',
          roles: ['admin/AdminRole/list']
        },
        component: () => import('@/views/admin/role/role')
      },
      {
        path: 'user',
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'el-icon-user',
          roles: ['admin/AdminUser/list']
        },
        component: () => import('@/views/admin/user/user')
      },
      {
        path: 'user-log',
        name: 'UserLog',
        meta: {
          title: '日志管理',
          icon: 'el-icon-notebook-2',
          roles: ['admin/AdminUserLog/list']
        },
        component: () => import('@/views/admin/user/user-log')
      },
      {
        path: 'user-log-stat',
        name: 'UserLogStat',
        meta: {
          title: '日志管理统计',
          icon: 'el-icon-s-data',
          roles: ['admin/AdminUserLog/stat'],
          activeMenu: '/admin/rule/user-log'
        },
        component: () => import('@/views/admin/user/user-log-stat'),
        hidden: true
      },
      {
        path: 'user-center',
        name: 'UserCenter',
        meta: {
          title: '个人中心',
          icon: 'el-icon-user-solid',
          roles: ['admin/AdminUserCenter/info']
        },
        component: () => import('@/views/admin/user/user-center')
      }
    ]
  },

  {
    path: '/admin/system',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting',
      roles: [
        'admin/AdminSetting/cacheInfo',
        'admin/AdminSetting/tokenInfo',
        'admin/AdminSetting/captchaInfo',
        'admin/AdminSetting/logInfo',
        'admin/AdminSetting/apiInfo',
        'admin/AdminApidoc/apidoc',
        'admin/AdminUtils/utils'
      ]
    },
    redirect: 'noRedirect',
    component: Layout,
    alwaysShow: true,
    children: [
      {
        path: 'setting',
        name: 'Setting',
        meta: {
          title: '设置管理',
          icon: 'el-icon-s-tools',
          roles: [
            'admin/AdminSetting/cacheInfo',
            'admin/AdminSetting/tokenInfo',
            'admin/AdminSetting/captchaInfo',
            'admin/AdminSetting/logInfo',
            'admin/AdminSetting/apiInfo'
          ]
        },
        component: () => import('@/views/admin/setting/setting')
      },
      {
        path: 'apidoc',
        name: 'Apidoc',
        meta: {
          title: '接口文档',
          icon: 'el-icon-document',
          roles: ['admin/AdminApidoc/apidoc']
        },
        component: () => import('@/views/admin/apidoc/apidoc')
      },
      {
        path: 'utils',
        name: 'Utils',
        meta: {
          title: '实用工具',
          icon: 'el-icon-help',
          roles: ['admin/AdminUtils/utils']
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
