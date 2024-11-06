import request from '@/utils/request'
// 会员接口
const url = '/admin/member.Api/'
/**
 * 会员接口列表
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
 * 会员接口信息
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
 * 会员接口添加
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
 * 会员接口修改
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
 * 会员接口删除
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
 * 会员接口修改排序
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
 * 会员接口修改上级
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
 * 会员接口是否免登
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
 * 会员接口是否免权
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
 * 会员接口是否免限
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
 * 会员接口是否禁用
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
 * 会员接口分组列表
 * @param {array} params 请求参数
 */
export function groupList(params) {
  return request({
    url: url + 'groupList',
    method: 'get',
    params: params
  })
}
/**
 * 会员接口分组解除
 * @param {array} data 请求数据
 */
export function groupRemove(data) {
  return request({
    url: url + 'groupRemove',
    method: 'post',
    data
  })
}
