import request from '@/utils/request'
// 用户管理
const url = '/admin/system.User/'
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
 * 用户修改部门
 * @param {array} data 请求数据
 */
export function editdept(data) {
  return request({
    url: url + 'editdept',
    method: 'post',
    data
  })
}
/**
 * 用户修改职位
 * @param {array} data 请求数据
 */
export function editpost(data) {
  return request({
    url: url + 'editpost',
    method: 'post',
    data
  })
}
/**
 * 用户修改角色
 * @param {array} data 请求数据
 */
export function editrole(data) {
  return request({
    url: url + 'editrole',
    method: 'post',
    data
  })
}
/**
 * 用户重置密码
 * @param {array} data 请求数据
 */
export function repwd(data) {
  return request({
    url: url + 'repwd',
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
