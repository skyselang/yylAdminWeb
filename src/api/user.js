import request from '@/utils/request'

// ----------------用户管理----------------
/**
 * 用户列表
 * @param {array} params 请求参数
 */
export function userList(params) {
  return request({
    url: '/admin/User/userList',
    method: 'get',
    params: params
  })
}
/**
   * 用户信息
   * @param {array} params 请求参数
   */
export function userInfo(params) {
  return request({
    url: '/admin/User/userInfo',
    method: 'get',
    params: params
  })
}
/**
   * 用户添加
   * @param {array} data 请求数据
   */
export function userAdd(data, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/User/userAdd',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/User/userAdd',
      method: 'post',
      data
    })
  }
}
/**
   * 用户修改
   * @param {array} data 请求数据
   */
export function userEdit(data, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/User/userEdit',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/User/userEdit',
      method: 'post',
      data
    })
  }
}
/**
   * 用户删除
   * @param {array} data 请求数据
   */
export function userDele(data) {
  return request({
    url: '/admin/User/userDele',
    method: 'post',
    data
  })
}
/**
   * 用户密码重置
   * @param {array} data 请求数据
   */
export function userPassword(data) {
  return request({
    url: '/admin/User/userPassword',
    method: 'post',
    data
  })
}
/**
   * 用户是否禁用
   * @param {array} data 请求数据
   */
export function userDisable(data) {
  return request({
    url: '/admin/User/userDisable',
    method: 'post',
    data
  })
}

// ----------------用户日志----------------
/**
 * 用户日志列表
 * @param {array} params 请求参数
 */
export function userLogList(params) {
  return request({
    url: '/admin/UserLog/userLogList',
    method: 'get',
    params: params
  })
}
/**
   * 用户日志信息
   * @param {array} params 请求参数
   */
export function userLogInfo(params) {
  return request({
    url: '/admin/UserLog/userLogInfo',
    method: 'get',
    params: params
  })
}
/**
   * 用户日志删除
   * @param {array} data 请求数据
   */
export function userLogDele(data) {
  return request({
    url: '/admin/UserLog/userLogDele',
    method: 'post',
    data
  })
}
/**
   * 用户日志统计
   * @param {array} data 请求数据
   */
export function userLogSta(data) {
  return request({
    url: '/admin/UserLog/userLogSta',
    method: 'post',
    data
  })
}
