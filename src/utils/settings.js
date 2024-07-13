import { useSettingsStoreHook } from '@/store/modules/settings'

const settingsStore = useSettingsStoreHook()

export function getPageLimit(defaultLimit = '') {
  if (defaultLimit !== '') {
    return defaultLimit
  }
  const settingsStore = useSettingsStoreHook()
  return settingsStore.pageLimit
}

export function setNotice(notice) {
  settingsStore.changeSetting({ key: 'notice', value: notice })
}
export function getNotice() {
  return settingsStore.notice
}
export function delNotice() {
  settingsStore.changeSetting({ key: 'notice', value: 0 })
}
