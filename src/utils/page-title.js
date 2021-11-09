import store from '@/store'

export default function getPageTitle(pageName) {
  const pageTitle = store.getters.pageTitle
  if (pageName) {
    return `${pageName} - ${pageTitle}`
  }
  return `${pageTitle}`
}
