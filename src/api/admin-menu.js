import request from '@/utils/request'

// ----------------菜单管理----------------
/**
 * 菜单列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/AdminMenu/list',
    method: 'get',
    params: params
  })
}
/**
 * 菜单信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/AdminMenu/info',
    method: 'get',
    params: params
  })
}
/**
 * 菜单添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/AdminMenu/add',
    method: 'post',
    data
  })
}
/**
 * 菜单修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/AdminMenu/edit',
    method: 'post',
    data
  })
}
/**
 * 菜单删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/AdminMenu/dele',
    method: 'post',
    data
  })
}
/**
 * 菜单是否禁用
 * @param {array} data 请求数据
 */
export function disable(data) {
  return request({
    url: '/admin/AdminMenu/disable',
    method: 'post',
    data
  })
}
/**
 * 菜单是否无需权限
 * @param {array} data 请求数据
 */
export function unauth(data) {
  return request({
    url: '/admin/AdminMenu/unauth',
    method: 'post',
    data
  })
}
/**
 * 菜单角色
 * @param {array} params 请求参数
 */
export function role(params) {
  return request({
    url: '/admin/AdminMenu/role',
    method: 'get',
    params: params
  })
}
/**
 * 菜单角色解除
 * @param {array} data 请求数据
 */
export function roleRemove(data) {
  return request({
    url: '/admin/AdminMenu/roleRemove',
    method: 'post',
    data
  })
}
/**
 * 菜单用户
 * @param {array} params 请求参数
 */
export function user(params) {
  return request({
    url: '/admin/AdminMenu/user',
    method: 'get',
    params: params
  })
}
/**
 * 菜单用户解除
 * @param {array} data 请求数据
 */
export function userRemove(data) {
  return request({
    url: '/admin/AdminMenu/userRemove',
    method: 'post',
    data
  })
}
