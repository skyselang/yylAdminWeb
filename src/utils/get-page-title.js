import defaultSettings from '@/settings'

const pageTitle = defaultSettings.pageTitle

export default function getPageTitle(pageName) {
  if (pageName) {
    return `${pageTitle} - ${pageName}`
  }
  return `${pageTitle}`
}
