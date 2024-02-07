import Cookies from 'js-cookie'
import { useSettingsStoreHook } from '@/store/modules/settings'

const keyPrefix = 'yaSettings'

export function getPageLimit(defaultLimit = '') {
  if (defaultLimit !== '') {
    return defaultLimit
  }
  const settingsStore = useSettingsStoreHook()
  return settingsStore.pageLimit
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
