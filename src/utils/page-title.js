import { useSettingsStore } from '@/store/modules/settings'
/**
 * 获取页面标题
 * @param {string} pageName 页面名称
 * @returns {string}
 */
export default function getPageTitle(pageName) {
  const settingsStore = useSettingsStore()
  const pageTitle = settingsStore.pageTitle
  if (pageName) {
    if (pageTitle) {
      return `${pageName} - ${pageTitle}`
    }
    return `${pageName}`
  }
  return `${pageTitle}`
}
