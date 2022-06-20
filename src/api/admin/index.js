import request from '@/utils/request'
// 控制台
const url = '/admin/Index/'
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
 * 公告
 * @param {array} params 请求参数
 */
export function notice(params) {
  return request({
    url: url + 'notice',
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
