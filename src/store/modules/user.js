import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { store } from '@/store'
import { useStorage } from '@vueuse/core'
import { useSettingsStore } from '@/store/modules/settings'
import defaultSettings from '@/settings'
import { login as loginApi, logout as logoutApi } from '@/api/system/login'
import { info as userInfoApi } from '@/api/system/user-center'

export const useUserStore = defineStore('user', () => {
  const token = useStorage('AdminToken', '')
  const dept = useStorage('dept', defaultSettings.dept)
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
          const settingsStore = useSettingsStore()
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
          //因为存在未配置科室的情况，需要事先判断是否有科室列表
          if (data.hasOwnProperty('dept_lists') && data.dept_lists.length > 0) {
            user.dept_lists = data.dept_lists
            if (data.default_dept_id > 0) {
              //如果存在默认科室，则默认选中
              for (let i = 0; i < data.dept_lists.length; i++) {
                if (data.dept_lists[i].dept_id === data.default_dept_id) {
                  changeDept(data.dept_lists[i])
                  break
                }
              }
            } else {
              //否则则默认选中第一个
              changeDept(data.dept_lists[0])
            }
          }
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
          dept.value = defaultSettings.dept
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

  // 切换科室
  function changeDept(val) {
    console.log('changeBeforDept', dept)
    dept.value = val
    dept.dept_id = val.dept_id
    dept.dept_name = val.dept_name
    // console.log('Dept', dept)
  }

  return {
    token,
    user,
    dept,
    login,
    userInfo,
    logout,
    resetToken,
    changeDept
  }
})

// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
