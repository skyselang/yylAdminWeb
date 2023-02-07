import Cookies from 'js-cookie'
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
