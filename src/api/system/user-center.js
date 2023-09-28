import request from '@/utils/request'
// 个人中心
const url = '/admin/system.UserCenter/'
/**
 * 我的信息
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
 * 修改信息
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
 * 修改密码
 * @param {array} data 请求数据
 */
export function pwd(data) {
  return request({
    url: url + 'pwd',
    method: 'post',
    data
  })
}
/**
 * 我的日志
 * @param {array} params 请求参数
 */
export function log(params) {
  return request({
    url: url + 'log',
    method: 'get',
    params: params
  })
}
/**
 * 我的日志详情
 * @param {array} params 请求参数
 */
export function logInfo(params) {
  return request({
    url: url + 'logInfo',
    method: 'get',
    params: params
  })
}
/**
 * 我的日志删除
 * @param {array} data 请求数据
 */
export function logDele(data) {
  return request({
    url: url + 'logDele',
    method: 'POST',
    data
  })
}
