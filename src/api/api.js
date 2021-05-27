import request from '@/utils/request'

// ----------------接口管理----------------
/**
 * 接口列表
 * @param {array} params 请求参数
 */
export function list() {
  return request({
    url: '/admin/Api/list',
    method: 'get'
  })
}
/**
 * 接口信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/Api/info',
    method: 'get',
    params: params
  })
}
/**
 * 接口添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/Api/add',
    method: 'post',
    data
  })
}
/**
 * 接口修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/Api/edit',
    method: 'post',
    data
  })
}
/**
 * 接口删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/Api/dele',
    method: 'post',
    data
  })
}
/**
 * 接口是否禁用
 * @param {array} data 请求数据
 */
export function disable(data) {
  return request({
    url: '/admin/Api/disable',
    method: 'post',
    data
  })
}
/**
 * 接口是否无需登录
 * @param {array} data 请求数据
 */
export function unlogin(data) {
  return request({
    url: '/admin/Api/unlogin',
    method: 'post',
    data
  })
}
