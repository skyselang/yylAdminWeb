import { login, logout } from '@/api/system/login'
import { info as userInfo } from '@/api/system/user-center'
import {
  setUserToken,
  getUserToken,
  delUserToken,
  setUsername,
  delUsername,
  setNickname,
  delNickname,
  setAvatar,
  delAvatar
} from '@/utils/auth'
import { getTokenName } from '@/utils/settings'
import router, { resetRouter } from '@/router'

const state = {
  userToken: getUserToken(),
  username: '',
  nickname: '',
  avatar: '',
  roles: [],
  menus: []
}

const mutations = {
  SET_USERTOKEN: (state, userToken) => {
    state.userToken = userToken
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const {
      username,
      password,
      captcha_id,
      captcha_code,
      ajcaptcha
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username,
        password: password,
        captcha_id: captcha_id,
        captcha_code: captcha_code,
        ajcaptcha: ajcaptcha
      }).then(response => {
        const { data } = response
        commit('SET_USERTOKEN', data[getTokenName()])
        setUserToken(data[getTokenName()])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  userInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      userInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('授权失败, 请重新登录！')
        }

        const {
          username,
          nickname,
          avatar_url,
          roles,
          menus
        } = data

        // 权限必须是一个非空数组
        if (!roles || roles.length <= 0) {
          reject('获取权限失败, 请重新登录！')
        }

        commit('SET_USERNAME', username)
        commit('SET_NICKNAME', nickname)
        commit('SET_AVATAR', avatar_url)
        commit('SET_ROLES', roles)
        commit('SET_MENUS', menus)
        setUsername(username)
        setNickname(nickname)
        setAvatar(avatar_url)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_USERTOKEN', '')
        commit('SET_USERNAME', '')
        commit('SET_NICKNAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ROLES', [])
        commit('SET_MENUS', [])
        delUserToken()
        delUsername()
        delNickname()
        delAvatar()
        resetRouter()

        // 重置访问的视图和缓存的视图
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 重置token
  resetUserToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_USERTOKEN', '')
      commit('SET_ROLES', [])
      delUserToken()
      resolve()
    })
  },

  // 动态修改权限
  async changeRoles({ commit, dispatch }, role) {
    const userToken = role + '-userToken'

    commit('SET_USERTOKEN', userToken)
    setUserToken(userToken)

    const { roles } = await dispatch('userInfo')

    resetRouter()

    // 根据权限生成可访问路由
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

    // 动态添加可访问路由
    router.addRoutes(accessRoutes)

    // 重置访问的视图和缓存的视图
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
