import { defineStore } from 'pinia'
import { store } from '@/store'
import defaultSettings from '@/settings'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import es from 'element-plus/es/locale/lang/es'

// setup
export const useAppStore = defineStore('app', () => {
  // state
  const storePrefix = defaultSettings.storePrefix
  const device = useStorage(storePrefix + 'device', 'desktop')
  const size = useStorage(storePrefix + 'size', defaultSettings.size)
  const language = useStorage(storePrefix + 'language', defaultSettings.language)
  const activeTopMenu = useStorage(storePrefix + 'activeTop', '')
  const sidebarStatus = useStorage(storePrefix + 'sidebarStatus', 'closed')
  const sidebar = reactive({ opened: sidebarStatus.value != 'closed', withoutAnimation: false })
  // 语言包
  const locale = computed(() => {
    if (language?.value) {
      return getLang('element-plus')
    }
  })

  // actions
  // 获取语言、包
  function getLang(component = '') {
    let lang = language.value
    // 第三方组件处理
    if (component === 'element-plus') {
      if (lang === 'zh-cn') {
        return zhCn
      } else if (lang === 'en') {
        return en
      } else if (lang === 'es') {
        return es
      }
    } else if (component === 'wangeditor') {
      if (lang === 'zh-cn') {
        return 'zh-CN'
      }
    } else if (component === 'aieditor') {
      if (lang === 'zh-cn') {
        return 'zh'
      }
    }
    return lang
  }

  function toggleSidebar() {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = false
    if (sidebar.opened) {
      sidebarStatus.value = 'opened'
    } else {
      sidebarStatus.value = 'closed'
    }
  }

  function closeSideBar(withoutAnimation) {
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
    sidebarStatus.value = 'closed'
  }

  function openSideBar(withoutAnimation) {
    sidebar.opened = true
    sidebar.withoutAnimation = withoutAnimation
    sidebarStatus.value = 'opened'
  }

  function toggleDevice(val) {
    device.value = val
  }

  function changeSize(val) {
    size.value = val
  }
  // 切换语言
  function changeLanguage(val) {
    language.value = val
  }
  // 切换混合模式
  function changeTopActive(val) {
    activeTopMenu.value = val
  }
  // 获取组件大小的高度
  function getSizeHeight(unit = true) {
    const sizeMap = {
      large: 40,
      default: 32,
      small: 24
    }
    let height = sizeMap[size.value] || 32
    if (unit) {
      height = height + 'px'
    }
    return height
  }

  return {
    device,
    sidebar,
    language,
    locale,
    size,
    activeTopMenu,
    toggleDevice,
    changeSize,
    changeLanguage,
    getLang,
    toggleSidebar,
    closeSideBar,
    openSideBar,
    changeTopActive,
    getSizeHeight
  }
})

// 非setup
export function useAppStoreHook() {
  return useAppStore(store)
}
