import { defineStore } from 'pinia'
import { store } from '@/store'
import defaultSettings from '@/settings'

export const useSettingsStore = defineStore('setting', () => {
  const loginBgUrl = useStorage('loginBgUrl', defaultSettings.loginBgUrl)
  const loginBgColor = useStorage('loginBgColor', defaultSettings.loginBgColor)
  const systemName = useStorage('systemName', defaultSettings.systemName)
  const pageTitle = useStorage('pageTitle', defaultSettings.pageTitle)
  const faviconUrl = useStorage('faviconUrl', defaultSettings.faviconUrl)
  const logoUrl = useStorage('logoUrl', defaultSettings.logoUrl)
  const sidebarLogo = useStorage('sidebarLogo', defaultSettings.sidebarLogo)
  const sidebarName = useStorage('sidebarName', defaultSettings.sidebarName)
  const fixedHeader = useStorage('fixedHeader', defaultSettings.fixedHeader)
  const tagsView = useStorage('tagsView', defaultSettings.tagsView)
  const layout = useStorage('layout', defaultSettings.layout)
  const theme = useStorage('theme', defaultSettings.theme)
  const themeColor = useStorage('themeColor', defaultSettings.themeColor)
  const tokenType = useStorage('tokenType', defaultSettings.tokenType)
  const tokenName = useStorage('tokenName', defaultSettings.tokenName)
  const pageLimit = useStorage('pageLimit', defaultSettings.pageLimit)

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
    pageLimit
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
    changeSetting
  }
})

// 非setup
export function useSettingsStoreHook() {
  return useSettingsStore(store)
}
