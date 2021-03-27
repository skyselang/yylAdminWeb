import { login, logout, myInfo } from '@/api/admin'
import {
  setAdminAdminId,
  getAdminAdminId,
  delAdminAdminId,
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
  adminUserId: '',
  adminToken: getAdminToken(),
  username: '',
  nickname: '',
  avatar: '',
  remark: '',
  roles: []
}

const mutations = {
  SET_ADMINUSERID: (state, adminUserId) => {
    state.adminUserId = adminUserId
  },
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
      verify_id,
      verify_code
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username,
        password: password,
        verify_id: verify_id,
        verify_code: verify_code
      }).then(response => {
        const { data } = response
        commit('SET_ADMINUSERID', data.admin_admin_id)
        commit('SET_ADMINTOKEN', data.admin_token)
        setAdminAdminId(data.admin_admin_id)
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
      myInfo({
        admin_admin_id: getAdminAdminId()
      }).then(response => {
        const { data } = response

        if (!data) {
          reject('授权失败, 请重新登录！')
        }

        const {
          admin_admin_id,
          username,
          nickname,
          avatar,
          roles
        } = data

        // 权限必须是一个非空数组
        if (!roles || roles.length <= 0) {
          reject('获取权限失败, 请重新登录！')
        }

        commit('SET_ADMINUSERID', admin_admin_id)
        commit('SET_USERNAME', username)
        commit('SET_NICKNAME', nickname)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        setUsername(data.username)
        setNickname(data.nickname)
        setAvatar(data.avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout({
        admin_admin_id: getAdminAdminId()
      }).then(() => {
        commit('SET_ADMINTOKEN', '')
        commit('SET_ROLES', [])
        delAdminAdminId()
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
      delAdminAdminId()
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
