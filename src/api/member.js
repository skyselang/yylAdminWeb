import request from '@/utils/request'

// ----------------会员管理----------------
/**
 * 会员列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/Member/list',
    method: 'get',
    params: params
  })
}
/**
 * 会员信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/Member/info',
    method: 'get',
    params: params
  })
}
/**
 * 会员添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/Member/add',
    method: 'post',
    data
  })
}
/**
 * 会员修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/Member/edit',
    method: 'post',
    data
  })
}
/**
 * 会员删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/Member/dele',
    method: 'post',
    data
  })
}
/**
 * 会员重置密码
 * @param {array} data 请求数据
 */
export function pwd(data) {
  return request({
    url: '/admin/Member/pwd',
    method: 'post',
    data
  })
}
/**
 * 会员是否禁用
 * @param {array} data 请求数据
 */
export function disable(data) {
  return request({
    url: '/admin/Member/disable',
    method: 'post',
    data
  })
}
