import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { store } from '@/store'
import { useSettingsStore } from '@/store/modules/settings'
import { loginApi, logoutApi } from '@/api/system/login'
import { infoApi as userInfoApi } from '@/api/system/user-center'
import { tokenValue } from '@/utils/index'

export const useUserStore = defineStore('user', () => {
  const settingsStore = useSettingsStore()
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
          tokenValue(data[tokenName])
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
          data.setting.watermark_content = settingsStore.systemName + '@' + data.nickname
          settingsStore.setSetting(data.setting)
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
          tokenValue('')
          location.reload() // 清空路由
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 获取token
  function getToken() {
    return tokenValue()
  }

  // 移除token
  function resetToken() {
    return new Promise((resolve) => {
      tokenValue('')
      resetRouter()
      resolve()
    })
  }

  return {
    user,
    login,
    userInfo,
    logout,
    getToken,
    resetToken
  }
})

// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
