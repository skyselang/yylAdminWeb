import Cookies from 'js-cookie'
import variable from '@/styles/variables.scss'
import defaultSettings from '@/settings'
const keyPrefix = 'yaSettings'

const systemNameKey = keyPrefix + 'SystemName'
export function setSystemName(systemName) {
  return Cookies.set(systemNameKey, systemName)
}
export function getSystemName() {
  return Cookies.get(systemNameKey)
}
export function delSystemName() {
  return Cookies.remove(systemNameKey)
}

const faviconUrlKey = keyPrefix + 'FaviconUrl'
export function setFaviconUrl(faviconUrl) {
  return Cookies.set(faviconUrlKey, faviconUrl)
}
export function getFaviconUrl() {
  return Cookies.get(faviconUrlKey)
}
export function delFaviconUrl() {
  return Cookies.remove(faviconUrlKey)
}

const pageTitleKey = keyPrefix + 'PageTitle'
export function setPageTitle(pageTitle) {
  return Cookies.set(pageTitleKey, pageTitle)
}
export function getPageTitle() {
  return Cookies.get(pageTitleKey)
}
export function delPageTitle() {
  return Cookies.remove(pageTitleKey)
}

const logoUrlKey = keyPrefix + 'LogoUrl'
export function setLogoUrl(logoUrl) {
  return Cookies.set(logoUrlKey, logoUrl)
}
export function getLogoUrl() {
  return Cookies.get(logoUrlKey)
}
export function delLogoUrl() {
  return Cookies.remove(logoUrlKey)
}

const loginBgImgKey = keyPrefix + 'LoginBgImg'
export function setLoginBgImg(loginBgImg) {
  return Cookies.set(loginBgImgKey, loginBgImg)
}
export function getLoginBgImg() {
  return Cookies.get(loginBgImgKey)
}
export function delLoginBgImg() {
  return Cookies.remove(logoUrlKey)
}

const noticeKey = keyPrefix + 'Notice'
export function setNotice(notice) {
  return Cookies.set(noticeKey, notice)
}
export function getNotice() {
  return Cookies.get(noticeKey)
}
export function delNotice() {
  return Cookies.remove(noticeKey)
}

const tokenNameKey = keyPrefix + 'TokenName'
export function setTokenName(tokenName) {
  return Cookies.set(tokenNameKey, tokenName)
}
export function getTokenName() {
  return Cookies.get(tokenNameKey)
}
export function delTokenName() {
  return Cookies.remove(tokenNameKey)
}

const tokenTypeKey = keyPrefix + 'TokenType'
export function setTokenType(tokenType) {
  return Cookies.set(tokenTypeKey, tokenType)
}
export function getTokenType() {
  return Cookies.get(tokenTypeKey)
}
export function delTokenType() {
  return Cookies.remove(tokenTypeKey)
}

const elementSizeKey = keyPrefix + 'ElementSize'
export function setElementSize(elementSize) {
  return Cookies.set(elementSizeKey, elementSize)
}
export function getElementSize() {
  let elementSize = Cookies.get(elementSizeKey)
  if (elementSize === undefined || !elementSize) {
    elementSize = defaultSettings.elementSize
    setElementSize(elementSize)
  }
  return elementSize
}
export function delElementSize() {
  return Cookies.remove(elementSizeKey)
}

export function getPageLimit(defaultLimit = '') {
  if (defaultLimit !== '') {
    return defaultLimit
  }
  return defaultSettings.pageLimit
}

const themeColorKey = keyPrefix + 'ThemeColor'
export function setThemeColor(themeColor) {
  return Cookies.set(themeColorKey, themeColor)
}
export function getThemeColor() {
  return Cookies.get(themeColorKey)
}
export function delThemeColor() {
  return Cookies.remove(themeColorKey)
}

const loginBgKey = keyPrefix + 'LoginBgColor'
export function setLoginBgColor(loginBgColor) {
  return Cookies.set(loginBgKey, loginBgColor)
}
export function getLoginBgColor() {
  let loginBgColor = Cookies.get(loginBgKey)
  if (loginBgColor === undefined || !loginBgColor) {
    loginBgColor = variable.loginBgColor
    setLoginBgColor(loginBgColor)
  }
  return loginBgColor
}
export function delLoginBgColor() {
  return Cookies.remove(loginBgKey)
}

const tagsViewKey = keyPrefix + 'TagsView'
export function setTagsView(tagsView) {
  return Cookies.set(tagsViewKey, tagsView)
}
export function getTagsView() {
  return Cookies.get(tagsViewKey)
}
export function delTagsView() {
  return Cookies.remove(tagsViewKey)
}

const fixedHeaderKey = keyPrefix + 'FixedHeader'
export function setFixedHeader(fixedHeader) {
  return Cookies.set(fixedHeaderKey, fixedHeader)
}
export function getFixedHeader() {
  return Cookies.get(fixedHeaderKey)
}
export function delFixedHeader() {
  return Cookies.remove(fixedHeaderKey)
}

const sidebarLogoKey = keyPrefix + 'SidebarLogo'
export function setSidebarLogo(sidebarLogo) {
  return Cookies.set(sidebarLogoKey, sidebarLogo)
}
export function getSidebarLogo() {
  return Cookies.get(sidebarLogoKey)
}
export function delSidebarLogo() {
  return Cookies.remove(sidebarLogoKey)
}
