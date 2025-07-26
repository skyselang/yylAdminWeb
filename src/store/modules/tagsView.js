import { defineStore } from 'pinia'
import { store } from '@/store'
import router from '@/router'

export const useTagsViewStore = defineStore('tagsView', () => {
  // state
  const visitedViews = ref([])
  const cachedViews = ref([])

  // actions

  /**
   * 添加已访问视图到已访问视图列表中
   */
  function addVisitedView(view) {
    // 如果已经存在于已访问的视图列表中，则不再添加
    if (visitedViews.value.some((v) => v.fullPath === view.fullPath)) {
      return
    }
    // 如果视图是固定的（affix），则在已访问的视图列表的开头添加
    if (view.affix) {
      visitedViews.value.unshift(view)
    } else {
      // 如果视图不是固定的，则在已访问的视图列表的末尾添加
      visitedViews.value.push(view)
    }
  }

  /**
   * 添加缓存视图到缓存视图列表中
   */
  function addCachedView(view) {
    const viewName = view.name
    // 如果缓存视图名称已经存在于缓存视图列表中，则不再添加
    if (cachedViews.value.includes(viewName)) {
      return
    }

    // 如果视图需要缓存（keepAlive），则将其路由名称添加到缓存视图列表中
    if (view.keepAlive) {
      cachedViews.value.push(viewName)
    }
  }

  /**
   * 从已访问视图列表中删除指定的视图
   */
  function delVisitedView(view) {
    return new Promise((resolve) => {
      for (const [i, v] of visitedViews.value.entries()) {
        // 找到与指定视图路径匹配的视图，在已访问视图列表中删除该视图
        if (v.path === view.path) {
          visitedViews.value.splice(i, 1)
          break
        }
      }
      resolve([...visitedViews.value])
    })
  }

  function delCachedView(view) {
    const viewName = view.name
    return new Promise((resolve) => {
      const index = cachedViews.value.indexOf(viewName)
      index > -1 && cachedViews.value.splice(index, 1)
      resolve([...cachedViews.value])
    })
  }

  function delOtherVisitedViews(view) {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter((v) => {
        return v?.affix || v.path === view.path
      })
      resolve([...visitedViews.value])
    })
  }

  function delOtherCachedViews(view) {
    const viewName = view.name
    return new Promise((resolve) => {
      const index = cachedViews.value.indexOf(viewName)
      if (index > -1) {
        cachedViews.value = cachedViews.value.slice(index, index + 1)
      } else {
        // 如果index=-1，则没有缓存的标签
        cachedViews.value = []
      }
      resolve([...cachedViews.value])
    })
  }

  function updateVisitedView(view) {
    for (let v of visitedViews.value) {
      if (v.fullPath === view.fullPath) {
        v = Object.assign(v, view)
        break
      }
    }
  }

  function addView(view) {
    addVisitedView(view)
    addCachedView(view)
  }

  function delView(view) {
    return new Promise((resolve) => {
      delVisitedView(view)
      delCachedView(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  function delOtherViews(view) {
    return new Promise((resolve) => {
      delOtherVisitedViews(view)
      delOtherCachedViews(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  function delLeftViews(view) {
    return new Promise((resolve) => {
      const currIndex = visitedViews.value.findIndex((v) => v.path === view.path)
      if (currIndex === -1) {
        return
      }
      visitedViews.value = visitedViews.value.filter((item, index) => {
        if (index >= currIndex || item?.affix) {
          return true
        }

        const cacheIndex = cachedViews.value.indexOf(item.name)
        if (cacheIndex > -1) {
          cachedViews.value.splice(cacheIndex, 1)
        }
        return false
      })
      resolve({
        visitedViews: [...visitedViews.value]
      })
    })
  }
  function delRightViews(view) {
    return new Promise((resolve) => {
      const currIndex = visitedViews.value.findIndex((v) => v.path === view.path)
      if (currIndex === -1) {
        return
      }
      visitedViews.value = visitedViews.value.filter((item, index) => {
        if (index <= currIndex || item?.affix) {
          return true
        }
      })
      resolve({
        visitedViews: [...visitedViews.value]
      })
    })
  }

  function delAllViews() {
    return new Promise((resolve) => {
      const affixTags = visitedViews.value.filter((tag) => tag?.affix)
      visitedViews.value = affixTags
      cachedViews.value = []
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value]
      })
    })
  }

  function delAllVisitedViews() {
    return new Promise((resolve) => {
      const affixTags = visitedViews.value.filter((tag) => tag?.affix)
      visitedViews.value = affixTags
      resolve([...visitedViews.value])
    })
  }

  function delAllCachedViews() {
    return new Promise((resolve) => {
      cachedViews.value = []
      resolve([...cachedViews.value])
    })
  }

  function closeView(route) {
    const view = { path: route.path, fullPath: route.fullPath, name: route.name, title: route.meta.title }
    delView(view).then((res) => {
      const latestView = res.visitedViews.slice(-1)[0]
      if (latestView && latestView.fullPath) {
        router.push(latestView.fullPath)
      } else {
        if (view?.name === 'Dashboard') {
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
    })
  }

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    delOtherVisitedViews,
    delOtherCachedViews,
    updateVisitedView,
    addView,
    delView,
    delOtherViews,
    delLeftViews,
    delRightViews,
    delAllViews,
    delAllVisitedViews,
    delAllCachedViews,
    closeView
  }
})

// 非setup
export function useTagsViewStoreHook() {
  return useTagsViewStore(store)
}
