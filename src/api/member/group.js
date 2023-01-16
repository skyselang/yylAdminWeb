import request from '@/utils/request'
// 会员分组
const url = '/admin/member.Group/'
/**
 * 会员分组列表
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
 * 会员分组信息
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
 * 会员分组添加
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
 * 会员分组修改
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
 * 会员分组删除
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
 * 会员分组修改接口
 * @param {array} data 请求数据
 */
export function editapi(data) {
  return request({
    url: url + 'editapi',
    method: 'post',
    data
  })
}
/**
 * 会员分组是否默认
 * @param {array} data 请求数据
 */
export function defaults(data) {
  return request({
    url: url + 'defaults',
    method: 'post',
    data
  })
}
/**
 * 会员分组是否禁用
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
 * 会员分组会员
 * @param {array} params 请求参数
 */
export function member(params) {
  return request({
    url: url + 'member',
    method: 'get',
    params: params
  })
}
/**
 * 会员分组会员解除
 * @param {array} data 请求数据
 */
export function memberRemove(data) {
  return request({
    url: url + 'memberRemove',
    method: 'post',
    data
  })
}
