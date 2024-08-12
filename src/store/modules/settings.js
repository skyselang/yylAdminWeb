import { defineStore } from 'pinia'
import { store } from '@/store'
import defaultSettings from '@/settings'

export const useSettingsStore = defineStore('setting', () => {
  const storePrefix = defaultSettings.storePrefix
  const loginBgUrl = useStorage(storePrefix + 'loginBgUrl', defaultSettings.loginBgUrl)
  const loginBgColor = useStorage(storePrefix + 'loginBgColor', defaultSettings.loginBgColor)
  const systemName = useStorage(storePrefix + 'systemName', defaultSettings.systemName)
  const pageTitle = useStorage(storePrefix + 'pageTitle', defaultSettings.pageTitle)
  const faviconUrl = useStorage(storePrefix + 'faviconUrl', defaultSettings.faviconUrl)
  const logoUrl = useStorage(storePrefix + 'logoUrl', defaultSettings.logoUrl)
  const sidebarLogo = useStorage(storePrefix + 'sidebarLogo', defaultSettings.sidebarLogo)
  const sidebarName = useStorage(storePrefix + 'sidebarName', defaultSettings.sidebarName)
  const fixedHeader = useStorage(storePrefix + 'fixedHeader', defaultSettings.fixedHeader)
  const tagsView = useStorage(storePrefix + 'tagsView', defaultSettings.tagsView)
  const layout = useStorage(storePrefix + 'layout', defaultSettings.layout)
  const theme = useStorage(storePrefix + 'theme', defaultSettings.theme)
  const themeColor = useStorage(storePrefix + 'themeColor', defaultSettings.themeColor)
  const tokenType = useStorage(storePrefix + 'tokenType', defaultSettings.tokenType)
  const tokenName = useStorage(storePrefix + 'tokenName', defaultSettings.tokenName)
  const pageLimit = useStorage(storePrefix + 'pageLimit', defaultSettings.pageLimit)
  const notice = useStorage(storePrefix + 'notice', 0)

  const settingsMap = {
    loginBgUrl,
    loginBgColor,
    systemName,
    pageTitle,
    faviconUrl,
    logoUrl,
    sidebarLogo,
    sidebarName,
    fixedHeader,
    tagsView,
    layout,
    theme,
    themeColor,
    tokenType,
    tokenName,
    pageLimit,
    notice
  }

  function changeSetting({ key, value }) {
    const setting = settingsMap[key]
    if (setting != undefined) {
      setting.value = value
      if (key == 'layout') {
        window.document.body.setAttribute('layout', value)
      } else if (key == 'themeColor') {
        document.documentElement.style.setProperty('--el-color-primary', value)
      } else if (key == 'theme') {
        if (value == 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } else if (key == 'faviconUrl') {
        if (value) {
          const favicon =
            document.querySelector("link[rel*='icon']") || document.createElement('link')
          favicon.href = value
          favicon.rel = 'shortcut icon'
          favicon.type = 'image/x-icon'
          document.getElementsByTagName('head')[0].appendChild(favicon)
        }
      }
    }
  }

  return {
    loginBgUrl,
    loginBgColor,
    systemName,
    pageTitle,
    faviconUrl,
    logoUrl,
    sidebarLogo,
    sidebarName,
    fixedHeader,
    tagsView,
    layout,
    theme,
    themeColor,
    tokenType,
    tokenName,
    pageLimit,
    notice,
    changeSetting
  }
})

// 非setup
export function useSettingsStoreHook() {
  return useSettingsStore(store)
}
