import Cookies from 'js-cookie'
const key_prefix = 'yaSettings'

const SystemNameKey = key_prefix + 'SystemName'
export function setSystemName(SystemName) {
  return Cookies.set(SystemNameKey, SystemName)
}
export function getSystemName() {
  return Cookies.get(SystemNameKey)
}
export function delSystemName() {
  return Cookies.remove(SystemNameKey)
}

const FaviconUrlKey = key_prefix + 'FaviconUrl'
export function setFaviconUrl(FaviconUrl) {
  return Cookies.set(FaviconUrlKey, FaviconUrl)
}
export function getFaviconUrl() {
  return Cookies.get(FaviconUrlKey)
}
export function delFaviconUrl() {
  return Cookies.remove(FaviconUrlKey)
}

const PageTitleKey = key_prefix + 'PageTitle'
export function setPageTitle(PageTitle) {
  return Cookies.set(PageTitleKey, PageTitle)
}
export function getPageTitle() {
  return Cookies.get(PageTitleKey)
}
export function delPageTitle() {
  return Cookies.remove(PageTitleKey)
}

const LogoUrlKey = key_prefix + 'LogoUrl'
export function setLogoUrl(LogoUrl) {
  return Cookies.set(LogoUrlKey, LogoUrl)
}
export function getLogoUrl() {
  return Cookies.get(LogoUrlKey)
}
export function delLogoUrl() {
  return Cookies.remove(LogoUrlKey)
}

const NoticeKey = key_prefix + 'Notice'
export function setNotice(notice) {
  return Cookies.set(NoticeKey, notice)
}
export function getNotice() {
  return Cookies.get(NoticeKey)
}
export function delNotice() {
  return Cookies.remove(NoticeKey)
}

const TokenNameKey = key_prefix + 'TokenName'
export function setTokenName(TokenName) {
  return Cookies.set(TokenNameKey, TokenName)
}
export function getTokenName() {
  return Cookies.get(TokenNameKey)
}
export function delTokenName() {
  return Cookies.remove(TokenNameKey)
}

const TokenTypeKey = key_prefix + 'TokenType'
export function setTokenType(TokenType) {
  return Cookies.set(TokenTypeKey, TokenType)
}
export function getTokenType() {
  return Cookies.get(TokenTypeKey)
}
export function delTokenType() {
  return Cookies.remove(TokenTypeKey)
}
