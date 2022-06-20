import request from '@/utils/request'
// 角色管理
const url = '/admin/admin.Role/'
/**
 * 角色列表
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
 * 角色信息
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
 * 角色添加
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
 * 角色修改
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
 * 角色删除
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
 * 角色是否禁用
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
 * 角色用户
 * @param {array} params 请求参数
 */
export function user(params) {
  return request({
    url: url + 'user',
    method: 'get',
    params: params
  })
}
/**
 * 角色用户解除
 * @param {array} data 请求数据
 */
export function userRemove(data) {
  return request({
    url: url + 'userRemove',
    method: 'post',
    data
  })
}
