import request from '@/utils/request'

// ----------------管理员管理----------------
/**
 * 管理员列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/AdminUser/list',
    method: 'get',
    params: params
  })
}
/**
 * 管理员信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/AdminUser/info',
    method: 'get',
    params: params
  })
}
/**
 * 管理员添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/AdminUser/add',
    method: 'post',
    data
  })
}
/**
 * 管理员修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/AdminUser/edit',
    method: 'post',
    data
  })
}
/**
 * 管理员删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/AdminUser/dele',
    method: 'post',
    data
  })
}
/**
 * 管理员重置密码
 * @param {array} data 请求数据
 */
export function pwd(data) {
  return request({
    url: '/admin/AdminUser/pwd',
    method: 'post',
    data
  })
}
/**
 * 管理员分配权限
 * @param {array} data 请求数据
 */
export function rule(data, method = 'get') {
  if (method === 'post') {
    return request({
      url: '/admin/AdminUser/rule',
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/admin/AdminUser/rule',
      method: 'get',
      params: data
    })
  }
}
/**
 * 管理员是否禁用
 * @param {array} data 请求数据
 */
export function disable(data) {
  return request({
    url: '/admin/AdminUser/disable',
    method: 'post',
    data
  })
}
/**
 * 管理员是否超管
 * @param {array} data 请求数据
 */
export function issuper(data) {
  return request({
    url: '/admin/AdminUser/super',
    method: 'post',
    data
  })
}
