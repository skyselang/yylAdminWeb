import request from '@/utils/request'

// ----------------用户日志----------------
/**
 * 用户日志列表
 * @param {array} params 请求参数
 */
export function userLogList(params) {
  return request({
    url: '/admin/UserLog/userLogList',
    method: 'get',
    params: params
  })
}
/**
   * 用户日志信息
   * @param {array} params 请求参数
   */
export function userLogInfo(params) {
  return request({
    url: '/admin/UserLog/userLogInfo',
    method: 'get',
    params: params
  })
}
/**
   * 用户日志删除
   * @param {array} data 请求数据
   */
export function userLogDele(data) {
  return request({
    url: '/admin/UserLog/userLogDele',
    method: 'post',
    data
  })
}
/**
   * 用户日志统计
   * @param {array} data 请求数据
   */
export function userLogSta(data) {
  return request({
    url: '/admin/UserLog/userLogSta',
    method: 'post',
    data
  })
}
