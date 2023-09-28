import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getAdminToken } from '@/utils/auth' // 从cookie中获取token
import getPageTitle from '@/utils/page-title'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login', '/redirect'] // 免登录名单

router.beforeEach(async(to, from, next) => {
  // 进度条开始
  NProgress.start()

  // 设置favicon
  const faviconUrl = store.getters.faviconUrl
  if (faviconUrl) {
    const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link')
    favicon.type = 'image/x-icon'
    favicon.rel = 'shortcut icon'
    favicon.href = faviconUrl
    document.getElementsByTagName('head')[0].appendChild(favicon)
  }

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 判断用户是否已登录
  const hasToken = getAdminToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断用户是否获取了权限
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // 注意：权限必须是对象数组！例如：['admin/Index/index']
          const { roles } = await store.dispatch('user/userInfo')

          // 获取后台菜单
          const menus = filterAsyncRoutes(store.getters.menus ? store.getters.menus : [])

          // 根据权限生成可访问路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', { roles: roles, menus: menus })

          // 动态添加可访问路由
          for (const route of accessRoutes) {
            router.addRoute(route)
          }
          // router.addRoutes(accessRoutes)

          // 确保addRoutes完整的hack方法
          // 设置replace:true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除token并转到登录页面重新登录
          await store.dispatch('user/resetAdminToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRoutes(obj) {
  if (obj.length > 0) {
    const newObj = obj.map(item => {
      if (item.component === 'Layout') {
        item.component = Layout
      } else {
        // 这个判断非常重要
        if (typeof item.component === 'string') {
          item.component = loadView(item.component)
        }
      }
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoutes(item.children)
      }
      return item
    })
    return newObj
  } else {
    return []
  }
}

// 路由懒加载
export const loadView = (view) => {
  return resolve => require([`@/views/${view}`], resolve).catch(err => {
    Message.error('Router ' + err)
    // 进度条结束
    NProgress.done()
  })
}

router.afterEach(() => {
  // 进度条结束
  NProgress.done()
})
