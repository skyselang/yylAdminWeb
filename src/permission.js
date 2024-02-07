import router from '@/router'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { translateRouteTitle } from '@/utils/i18n'
import getPageTitle from '@/utils/page-title'
// 进度条
NProgress.configure({ showSpinner: false })

const userStore = useUserStoreHook()
const permissionStore = usePermissionStoreHook()

// 白名单路由
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(translateRouteTitle(to.meta.title))

  const hasToken = localStorage.getItem('AdminToken')
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，跳转首页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = userStore.user.roles && userStore.user.roles.length > 0
      if (hasRoles) {
        // 未匹配到任何路由，跳转404
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name }) : next('/404')
        } else {
          next()
        }
      } else {
        try {
          const { menus } = await userStore.userInfo()
          const accessRoutes = await permissionStore.generateRoutes(menus)
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          next({ ...to, replace: true })
        } catch (error) {
          // 移除 token 并跳转登录页
          await userStore.resetToken()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
