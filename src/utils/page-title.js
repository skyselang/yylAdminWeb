import store from '@/store'

// 获取页面标题
export default function getPageTitle(pageName) {
  const pageTitle = store.getters.pageTitle
  if (pageName) {
    if (pageTitle) {
      return `${pageName} - ${pageTitle}`
    }
    return `${pageName}`
  }
  return `${pageTitle}`
}
