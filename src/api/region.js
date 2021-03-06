import request from '@/utils/request'

// ----------------地区管理----------------
/**
 * 地区列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/Region/list',
    method: 'get',
    params: params
  })
}
/**
 * 地区信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/Region/info',
    method: 'get',
    params: params
  })
}
/**
 * 地区添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/Region/add',
    method: 'post',
    data
  })
}
/**
 * 地区修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/Region/edit',
    method: 'post',
    data
  })
}
/**
 * 地区删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/Region/dele',
    method: 'post',
    data
  })
}
