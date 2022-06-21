import request from '@/utils/request'
// 会员日志
const url = '/admin/member.Log/'
/**
 * 会员日志列表
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
 * 会员日志信息
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
 * 会员日志删除
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
 * 会员日志清除
 * @param {array} data 请求数据
 */
export function clear(data) {
  return request({
    url: url + 'clear',
    method: 'post',
    data
  })
}
/**
 * 会员日志清空
 * @param {array} data 请求数据
 */
export function clean(data) {
  return request({
    url: url + 'clean',
    method: 'post',
    data
  })
}
/**
 * 会员日志统计
 * @param {array} params 请求参数
 */
export function stat(params) {
  return request({
    url: url + 'stat',
    method: 'get',
    params: params
  })
}
