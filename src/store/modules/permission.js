import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'
import { store } from '@/store'

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
    if (!route.name) {
      tmpRoute.name = route.path
    }
    if (tmpRoute.component?.toString() == 'Layout') {
      tmpRoute.component = Layout
    } else {
      const component = modules[`../../views/${tmpRoute.component}.vue`]
      if (component) {
        tmpRoute.component = component
      } else {
        tmpRoute.component = modules[`../../views/system/components/System404.vue`]
      }
    }

    if (tmpRoute.children) {
      tmpRoute.children = filterAsyncRoutes(tmpRoute.children)
    }

    asyncRoutes.push(tmpRoute)
  })

  return asyncRoutes
}

// setup
export const usePermissionStore = defineStore('permission', () => {
  // state
  const routes = ref([])

  // actions
  function setRoutes(newRoutes) {
    routes.value = constantRoutes.concat(newRoutes)
  }
  /**
   * 生成动态路由
   */
  function generateRoutes(menus) {
    return new Promise((resolve, reject) => {
      const asyncRoutes = menus
      const accessedRoutes = filterAsyncRoutes(asyncRoutes)
      setRoutes(accessedRoutes)
      resolve(accessedRoutes)
    })
  }
  /**
   * 混合模式左侧菜单
   */
  const mixLeftMenu = ref([])
  function getMixLeftMenu(activeTop) {
    routes.value.forEach((item) => {
      if (item.path === activeTop) {
        mixLeftMenu.value = item.children || []
      }
    })
  }
  return { routes, setRoutes, generateRoutes, getMixLeftMenu, mixLeftMenu }
})

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
