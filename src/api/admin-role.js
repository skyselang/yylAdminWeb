import request from '@/utils/request'

// ----------------角色管理----------------
/**
 * 角色列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/AdminRole/list',
    method: 'get',
    params: params
  })
}
/**
 * 角色信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/AdminRole/info',
    method: 'get',
    params: params
  })
}
/**
 * 角色添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/AdminRole/add',
    method: 'post',
    data
  })
}
/**
 * 角色修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/AdminRole/edit',
    method: 'post',
    data
  })
}
/**
 * 角色删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/AdminRole/dele',
    method: 'post',
    data
  })
}
/**
 * 角色禁用
 * @param {array} data 请求数据
 */
export function disable(data) {
  return request({
    url: '/admin/AdminRole/disable',
    method: 'post',
    data
  })
}
/**
 * 角色管理员
 * @param {array} params 请求参数
 */
export function user(params) {
  return request({
    url: '/admin/AdminRole/user',
    method: 'get',
    params: params
  })
}
/**
 * 角色管理员解除
 * @param {array} data 请求数据
 */
export function userRemove(data) {
  return request({
    url: '/admin/AdminRole/userRemove',
    method: 'post',
    data
  })
}
