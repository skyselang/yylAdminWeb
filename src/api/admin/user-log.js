import request from '@/utils/request'
const url = '/admin/admin.UserLog/'
// ----------------用户日志----------------
/**
 * 用户日志列表
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
 * 用户日志信息
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
 * 用户日志删除
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
 * 用户日志清除
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
 * 用户日志统计
 * @param {array} data 请求数据
 */
export function stat(data) {
  return request({
    url: url + 'stat',
    method: 'post',
    data
  })
}
