import { login, logout } from '@/api/admin/login'
import { info as userInfo } from '@/api/admin/user-center'
import {
  setAdminToken,
  getAdminToken,
  delAdminToken,
  setUsername,
  delUsername,
  setNickname,
  delNickname,
  setAvatar,
  delAvatar
} from '@/utils/auth'
import router, {
  resetRouter
} from '@/router'

const state = {
  adminToken: getAdminToken(),
  username: '',
  nickname: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_ADMINTOKEN: (state, adminToken) => {
    state.adminToken = adminToken
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
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const {
      username,
      password,
      captcha_id,
      captcha_code
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username,
        password: password,
        captcha_id: captcha_id,
        captcha_code: captcha_code
      }).then(response => {
        const { data } = response
        commit('SET_ADMINTOKEN', data.admin_token)
        setAdminToken(data.admin_token)
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
          roles
        } = data

        // 权限必须是一个非空数组
        if (!roles || roles.length <= 0) {
          reject('获取权限失败, 请重新登录！')
        }

        commit('SET_USERNAME', username)
        commit('SET_NICKNAME', nickname)
        commit('SET_AVATAR', avatar_url)
        commit('SET_ROLES', roles)
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
        commit('SET_ADMINTOKEN', '')
        commit('SET_USERNAME', '')
        commit('SET_NICKNAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ROLES', [])
        delAdminToken()
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
  resetAdminToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_ADMINTOKEN', '')
      commit('SET_ROLES', [])
      delAdminToken()
      resolve()
    })
  },

  // 动态修改权限
  async changeRoles({ commit, dispatch }, role) {
    const adminToken = role + '-adminToken'

    commit('SET_ADMINTOKEN', adminToken)
    setAdminToken(adminToken)

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
