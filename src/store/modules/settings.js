import { defineStore } from 'pinia'
import { store } from '@/store'
import defaultSettings from '@/settings'

export const useSettingsStore = defineStore('setting', () => {
  const storePrefix = defaultSettings.storePrefix
  const notice = useStorage(storePrefix + 'notice', 0)
  const systemName = useStorage(storePrefix + 'systemName', defaultSettings.systemName)
  const pageTitle = useStorage(storePrefix + 'pageTitle', defaultSettings.pageTitle)
  const faviconUrl = useStorage(storePrefix + 'faviconUrl', defaultSettings.faviconUrl)
  const logoUrl = useStorage(storePrefix + 'logoUrl', defaultSettings.logoUrl)
  const loginBgUrl = useStorage(storePrefix + 'loginBgUrl', defaultSettings.loginBgUrl)
  const loginBgColor = useStorage(storePrefix + 'loginBgColor', defaultSettings.loginBgColor)
  const watermarkEnabled = useStorage(storePrefix + 'watermarkEnabled', defaultSettings.watermarkEnabled)
  const watermarkContent = useStorage(storePrefix + 'watermarkContent', defaultSettings.watermarkContent)
  const timeout = useStorage(storePrefix + 'timeout', defaultSettings.timeout)
  const tokenType = useStorage(storePrefix + 'tokenType', defaultSettings.tokenType)
  const tokenName = useStorage(storePrefix + 'tokenName', defaultSettings.tokenName)
  const sidebarLogo = useStorage(storePrefix + 'sidebarLogo', defaultSettings.sidebarLogo)
  const sidebarName = useStorage(storePrefix + 'sidebarName', defaultSettings.sidebarName)
  const fixedHeader = useStorage(storePrefix + 'fixedHeader', defaultSettings.fixedHeader)
  const tagsView = useStorage(storePrefix + 'tagsView', defaultSettings.tagsView)
  const layout = useStorage(storePrefix + 'layout', defaultSettings.layout)
  const theme = useStorage(storePrefix + 'theme', defaultSettings.theme)
  const themeColor = useStorage(storePrefix + 'themeColor', defaultSettings.themeColor)
  const sidebarColor = useStorage(storePrefix + 'sidebarColor', defaultSettings.sidebarColor)
  const pageLimit = useStorage(storePrefix + 'pageLimit', defaultSettings.pageLimit)
  const pageLimits = useStorage(storePrefix + 'pageLimits', defaultSettings.pageLimits)
  const addEditDialog = useStorage(storePrefix + 'addEditDialog', defaultSettings.addEditDialog)
  const rememberMe = useStorage(storePrefix + 'rememberMe', defaultSettings.rememberMe)

  const settingsMap = {
    notice,
    systemName,
    pageTitle,
    faviconUrl,
    logoUrl,
    loginBgUrl,
    loginBgColor,
    watermarkEnabled,
    watermarkContent,
    timeout,
    tokenType,
    tokenName,
    sidebarLogo,
    sidebarName,
    fixedHeader,
    tagsView,
    layout,
    theme,
    themeColor,
    sidebarColor,
    pageLimit,
    pageLimits,
    addEditDialog,
    rememberMe
  }

  // 监听器 - 侧边栏颜色变化
  watch(
    [sidebarColor],
    ([newSidebarColor]) => {
      changeSetting({ key: 'sidebarColor', value: newSidebarColor })
    },
    { immediate: true }
  )

  function setSetting(data) {
    systemName.value = data.system_name
    pageTitle.value = data.page_title
    faviconUrl.value = data.favicon_url
    logoUrl.value = data.logo_url
    loginBgUrl.value = data.login_bg_url
    loginBgColor.value = data.login_bg_color
    watermarkEnabled.value = data.is_watermark
    watermarkContent.value = data.watermark_content
    timeout.value = data.api_timeout
    tokenType.value = data.token_type
    tokenName.value = data.token_name
  }

  function changeSetting({ key, value }) {
    const setting = settingsMap[key]
    if (setting != undefined) {
      setting.value = value
      if (key === 'theme') {
        setTheme(value)
      } else if (key === 'themeColor') {
        setThemeColor(value, theme.value)
      } else if (key === 'faviconUrl') {
        setFaviconUrl(value)
      } else if (key === 'sidebarColor') {
        setSidebarColor(value)
      }
    }
  }

  // 将十六进制颜色转换为 RGB
  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16)
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
  }

  // 将 RGB 转换为十六进制颜色
  function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  /**
   * 加深颜色值
   * @param {String} color 颜色值字符串
   * @param {Number} level 加深的程度，限0-1之间
   * @returns {String} 返回处理后的颜色值
   */
  function getDarkColor(color, level) {
    const rgb = hexToRgb(color)
    for (let i = 0; i < 3; i++) rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level))
    return rgbToHex(rgb[0], rgb[1], rgb[2])
  }

  /**
   * 变浅颜色值
   * @param {String} color 颜色值字符串
   * @param {Number} level 加深的程度，限0-1之间
   * @returns {String} 返回处理后的颜色值
   */
  function getLightColor(color, level) {
    const rgb = hexToRgb(color)
    for (let i = 0; i < 3; i++) rgb[i] = Math.round(255 * level + rgb[i] * (1 - level))
    return rgbToHex(rgb[0], rgb[1], rgb[2])
  }

  /**
   * 设置主题
   * @param value 主题类型
   */
  function setTheme(value) {
    if (value === 'dark') {
      window.document.documentElement.classList.add('dark')
    } else {
      window.document.documentElement.classList.remove('dark')
    }
  }

  /**
   * 设置主题色
   * @param primary 主题色
   */
  function setThemeColor(primary) {
    window.document.documentElement.style.setProperty('--el-color-primary', primary)
    const themes = theme.value
    const colors = { primary }
    // 生成浅色变体
    for (let i = 1; i <= 9; i++) {
      colors[`primary-light-${i}`] =
        themes === 'light' ? `${getLightColor(primary, i / 10)}` : `${getDarkColor(primary, i / 10)}`
    }
    // 生成深色变体
    colors['primary-dark-2'] = themes === 'light' ? `${getLightColor(primary, 0.2)}` : `${getDarkColor(primary, 0.3)}`
    const el = window.document.documentElement
    Object.entries(colors).forEach(([key, value]) => {
      el.style.setProperty(`--el-color-${key}`, value)
    })
  }

  /**
   * 设置 faviconUrl
   * @param value faviconUrl
   */
  function setFaviconUrl(value) {
    if (value) {
      const favicon = window.document.querySelector("link[rel*='icon']") || window.document.createElement('link')
      favicon.href = value
      favicon.rel = 'shortcut icon'
      favicon.type = 'image/x-icon'
      window.document.getElementsByTagName('head')[0].appendChild(favicon)
    }
  }

  /**
   * 设置侧边栏颜色
   * @param value 侧边栏颜色
   */
  function setSidebarColor(value) {
    if (value === 'bule') {
      window.document.documentElement.classList.add('sidebar-color-bule')
    } else {
      window.document.documentElement.classList.remove('sidebar-color-bule')
    }
  }

  return {
    notice,
    systemName,
    pageTitle,
    faviconUrl,
    logoUrl,
    loginBgUrl,
    loginBgColor,
    watermarkEnabled,
    watermarkContent,
    timeout,
    tokenType,
    tokenName,
    sidebarLogo,
    sidebarName,
    fixedHeader,
    tagsView,
    layout,
    theme,
    themeColor,
    sidebarColor,
    pageLimit,
    pageLimits,
    addEditDialog,
    rememberMe,
    setSetting,
    changeSetting
  }
})

// 非setup
export function useSettingsStoreHook() {
  return useSettingsStore(store)
}
