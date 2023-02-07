import request from '@/utils/request'
// 菜单管理
const url = '/admin/system.Menu/'
/**
 * 菜单列表
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
 * 菜单信息
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
 * 菜单添加
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
 * 菜单修改
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
 * 菜单删除
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
 * 菜单修改排序
 * @param {array} data 请求数据
 */
export function editsort(data) {
  return request({
    url: url + 'editsort',
    method: 'post',
    data
  })
}
/**
 * 菜单修改上级
 * @param {array} data 请求数据
 */
export function editpid(data) {
  return request({
    url: url + 'editpid',
    method: 'post',
    data
  })
}
/**
 * 菜单是否免登
 * @param {array} data 请求数据
 */
export function unlogin(data) {
  return request({
    url: url + 'unlogin',
    method: 'post',
    data
  })
}
/**
 * 菜单是否免权
 * @param {array} data 请求数据
 */
export function unauth(data) {
  return request({
    url: url + 'unauth',
    method: 'post',
    data
  })
}
/**
 * 菜单是否免限
 * @param {array} data 请求数据
 */
export function unrate(data) {
  return request({
    url: url + 'unrate',
    method: 'post',
    data
  })
}
/**
 * 菜单是否隐藏
 * @param {array} data 请求数据
 */
export function ishidden(data) {
  return request({
    url: url + 'hidden',
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
    url: url + 'disable',
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
    url: url + 'role',
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
    url: url + 'roleRemove',
    method: 'post',
    data
  })
}
