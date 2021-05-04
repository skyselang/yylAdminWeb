import defaultSettings from '@/settings'

const pageTitle = defaultSettings.pageTitle

export default function getPageTitle(pageName) {
  if (pageName) {
    return `${pageName} - ${pageTitle}`
  }
  return `${pageTitle}`
}
