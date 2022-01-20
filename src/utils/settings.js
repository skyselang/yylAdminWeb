import Cookies from 'js-cookie'

const SystemNameKey = 'yylAdminSystemName'
export function setSystemName(SystemName) {
  return Cookies.set(SystemNameKey, SystemName)
}
export function getSystemName() {
  return Cookies.get(SystemNameKey)
}
export function delSystemName() {
  return Cookies.remove(SystemNameKey)
}

const PageTitleKey = 'yylAdminPageTitle'
export function setPageTitle(PageTitle) {
  return Cookies.set(PageTitleKey, PageTitle)
}
export function getPageTitle() {
  return Cookies.get(PageTitleKey)
}
export function delPageTitle() {
  return Cookies.remove(PageTitleKey)
}

const LogoUrlKey = 'yylAdminLogoUrl'
export function setLogoUrl(LogoUrl) {
  return Cookies.set(LogoUrlKey, LogoUrl)
}
export function getLogoUrl() {
  return Cookies.get(LogoUrlKey)
}
export function delLogoUrl() {
  return Cookies.remove(LogoUrlKey)
}

const FaviconUrlKey = 'yylAdminFaviconUrl'
export function setFaviconUrl(FaviconUrl) {
  return Cookies.set(FaviconUrlKey, FaviconUrl)
}
export function getFaviconUrl() {
  return Cookies.get(FaviconUrlKey)
}
export function delFaviconUrl() {
  return Cookies.remove(FaviconUrlKey)
}

const NoticeKey = 'yylAdminNotice'
export function setNotice(notice) {
  return Cookies.set(NoticeKey, notice)
}
export function getNotice() {
  return Cookies.get(NoticeKey)
}
export function delNotice() {
  return Cookies.remove(NoticeKey)
}
