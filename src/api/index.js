import request from '@/utils/request'
const url = '/admin/Index/'
// ----------------控制台-----------------
/**
 * 首页
 * @param {array} params 请求参数
 */
export function index(params) {
  return request({
    url: url + 'index',
    method: 'get',
    params: params
  })
}
/**
 * 总数统计
 * @param {array} params 请求参数
 */
export function count(params) {
  return request({
    url: url + 'count',
    method: 'get',
    params: params
  })
}
/**
 * 会员统计
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
 * 内容统计
 * @param {array} params 请求参数
 */
export function cms(params) {
  return request({
    url: url + 'cms',
    method: 'get',
    params: params
  })
}
/**
 * 文件统计
 * @param {array} params 请求参数
 */
export function file(params) {
  return request({
    url: url + 'file',
    method: 'get',
    params: params
  })
}
