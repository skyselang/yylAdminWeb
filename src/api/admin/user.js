import request from '@/utils/request'
const url = '/admin/admin.User/'
// ----------------用户管理----------------
/**
 * 用户列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: url + 'list',
    method: 'get',
    params: params
  })
}
/**
 * 用户信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: url + 'info',
    method: 'get',
    params: params
  })
}
/**
 * 用户添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: url + 'add',
    method: 'post',
    data
  })
}
/**
 * 用户修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: url + 'edit',
    method: 'post',
    data
  })
}
/**
 * 用户删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: url + 'dele',
    method: 'post',
    data
  })
}
/**
 * 更换头像
 */
export function avatar() {
  return process.env.VUE_APP_BASE_API + url + 'avatar'
}
/**
 * 用户重置密码
 * @param {array} data 请求数据
 */
export function pwd(data) {
  return request({
    url: url + 'pwd',
    method: 'post',
    data
  })
}
/**
 * 用户分配权限
 * @param {array} data 请求数据
 */
export function rule(data, method = 'get') {
  if (method === 'post') {
    return request({
      url: url + 'rule',
      method: 'post',
      data
    })
  } else {
    return request({
      url: url + 'rule',
      method: 'get',
      params: data
    })
  }
}
/**
 * 用户是否禁用
 * @param {array} data 请求数据
 */
export function disable(data) {
  return request({
    url: url + 'disable',
    method: 'post',
    data
  })
}
/**
 * 用户是否超管
 * @param {array} data 请求数据
 */
export function issuper(data) {
  return request({
    url: url + 'super',
    method: 'post',
    data
  })
}
