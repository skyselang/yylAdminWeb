import { defineStore } from 'pinia'
import { store } from '@/store'
import { useStorage } from '@vueuse/core'
import defaultSettings from '@/settings'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

// setup
export const useAppStore = defineStore('app', () => {
  const storePrefix = defaultSettings.storePrefix
  // state
  const device = useStorage(storePrefix + 'device', 'desktop')
  const size = useStorage(storePrefix + 'size', defaultSettings.size)
  const language = useStorage(storePrefix + 'language', defaultSettings.language)
  const activeTopMenu = useStorage(storePrefix + 'activeTop', '')
  const sidebarStatus = useStorage(storePrefix + 'sidebarStatus', 'closed')
  const sidebar = reactive({
    opened: sidebarStatus.value != 'closed',
    withoutAnimation: false
  })
  // 语言包
  const locale = computed(() => {
    if (language?.value == 'en') {
      return en
    } else {
      return zhCn
    }
  })

  // actions
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
    toggleSidebar,
    closeSideBar,
    openSideBar,
    changeTopActive
  }
})

// 非setup
export function useAppStoreHook() {
  return useAppStore(store)
}
