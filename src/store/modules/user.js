import {
  login,
  logout,
  userInfo
} from '@/api/admin'
import {
  setToken,
  getToken,
  delToken,
  setAdminUserId,
  getAdminUserId,
  delAdminUserId,
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
  username: '',
  nickname: '',
  avatar: '',
  remark: '',
  token: getToken(),
  roles: []
}

const mutations = {
  SET_ADMINUSERID: (state, adminUserId) => {
    state.adminUserId = adminUserId
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
  SET_REMARK: (state, remark) => {
    state.remark = remark
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        const {
          data
        } = response
        commit('SET_TOKEN', data.admin_token)
        commit('SET_ADMINUSERID', data.admin_user_id)
        setToken(data.admin_token)
        setAdminUserId(data.admin_user_id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  userInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      userInfo({
        admin_user_id: getAdminUserId()
      }).then(response => {
        const {
          data
        } = response

        if (!data) {
          reject('授权失败, 请重新登录！')
        }

        const {
          admin_user_id,
          username,
          nickname,
          avatar,
          remark,
          roles
        } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('获取权限失败, 请重新登录！')
        }

        commit('SET_ADMINUSERID', admin_user_id)
        commit('SET_NICKNAME', nickname)
        commit('SET_USERNAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_REMARK', remark)
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

  // user logout
  logout({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      logout({
        admin_user_id: getAdminUserId()
      }).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        delAdminUserId()
        delUsername()
        delNickname()
        delAvatar()
        delToken()
        resetRouter()

        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, {
          root: true
        })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      delAdminUserId()
      delToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({
    commit,
    dispatch
  }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const {
      roles
    } = await dispatch('userInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })

    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {
      root: true
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
