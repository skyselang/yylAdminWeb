import { defineStore } from 'pinia'
import { store } from '@/store'
import { constantRoutes } from '@/router/index'
import { hasPerm } from '@/utils/index'
import frontRoutes from '@/router/front'
import defaultSettings from '@/settings'

const modules = import.meta.glob('../../views/**/**.vue')
const Layout = () => import('@/layout/index.vue')

/**
 * 递归生成异步(动态)路由
 * @param routes 接口返回的异步(动态)路由
 * @returns 异步(动态)路由
 */
const filterAsyncRoutes = (routes) => {
  const asyncRoutes = []
  routes.forEach((route) => {
    const tmpRoute = { ...route } // ES6扩展运算符复制新对象
    if (tmpRoute.component?.toString() == 'Layout') {
      tmpRoute.component = Layout
    } else {
      if (tmpRoute?.component) {
        const component = modules[`../../views/${tmpRoute.component}.vue`]
        if (component) {
          tmpRoute.component = component
        } else {
          tmpRoute.component = modules[`../../views/system/system/404.vue`]
        }
      } else {
        tmpRoute.component = ''
      }
    }

    if (tmpRoute.children) {
      tmpRoute.children = filterAsyncRoutes(tmpRoute.children)
    }

    asyncRoutes.push(tmpRoute)
  })

  return asyncRoutes
}

/**
 * @param routes
 */
export function filterFrontRoutes(routes) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPerm(route.meta.roles)) {
      if (tmp.children) {
        tmp.children = filterFrontRoutes(tmp.children)
      }
      res.push(tmp)
    }
  })

  return res
}

// setup
export const usePermissionStore = defineStore('permission', () => {
  // state
  // 路由
  const routes = ref([])
  // 混合模式左侧菜单
  const mixLeftMenu = ref([])

  // actions

  /**
   * 设置路由
   */
  function setRoutes(newRoutes) {
    routes.value = constantRoutes.concat(newRoutes)
  }
  /**
   * 生成路由
   */
  function generateRoutes(menus) {
    return new Promise((resolve, reject) => {
      if (defaultSettings.frontRouter) {
        const accessedRoutes = filterFrontRoutes(frontRoutes)
        setRoutes(accessedRoutes)
        resolve(accessedRoutes)
      } else {
        const asyncRoutes = menus
        const accessedRoutes = filterAsyncRoutes(asyncRoutes)
        setRoutes(accessedRoutes)
        resolve(accessedRoutes)
      }
    })
  }
  /**
   * 获取混合模式左侧菜单
   */
  function getMixLeftMenu(activeTop) {
    routes.value.forEach((item) => {
      if (item.path === activeTop) {
        mixLeftMenu.value = item.children || []
      }
    })
  }
  return { routes, mixLeftMenu, setRoutes, generateRoutes, getMixLeftMenu }
})

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
