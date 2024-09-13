import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { store } from '@/store'
import { useStorage } from '@vueuse/core'
import { useSettingsStore } from '@/store/modules/settings'
import { login as loginApi, logout as logoutApi } from '@/api/system/login'
import { info as userInfoApi } from '@/api/system/user-center'
import defaultSettings from '@/settings'

export const useUserStore = defineStore('user', () => {
  const settingsStore = useSettingsStore()
  const storePrefix = defaultSettings.storePrefix
  const tokenName = settingsStore.tokenName
  const token = useStorage(storePrefix + tokenName, '')
  const user = reactive({
    username: '',
    nickname: '',
    avatar_url: '',
    roles: [],
    menus: []
  })

  // 登录
  function login(data) {
    return new Promise((resolve, reject) => {
      loginApi(data)
        .then((res) => {
          const data = res.data
          const tokenName = settingsStore.tokenName
          token.value = data[tokenName]
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 用户信息
  function userInfo() {
    return new Promise((resolve, reject) => {
      userInfoApi()
        .then(({ data }) => {
          if (!data) {
            reject('Verification failed, please Login again.')
            return
          }
          if (!data.roles || data.roles.length <= 0) {
            reject('userInfo: roles must be a non-null array!')
            return
          }
          user.nickname = data.nickname
          user.username = data.username
          user.avatar_url = data.avatar_url
          user.roles = data.roles
          user.menus = data.menus
          settingsStore.changeSetting({
            key: 'watermarkContent',
            value: settingsStore.systemName + '@' + data.nickname
          })
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 退出
  function logout() {
    return new Promise((resolve, reject) => {
      logoutApi()
        .then(() => {
          token.value = ''
          location.reload() // 清空路由
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 移除token
  function resetToken() {
    return new Promise((resolve) => {
      token.value = ''
      resetRouter()
      resolve()
    })
  }

  return {
    token,
    user,
    login,
    userInfo,
    logout,
    resetToken
  }
})

// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
