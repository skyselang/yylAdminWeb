import request from '@/utils/request'

// ----------------会员日志管理----------------
/**
 * 会员日志列表
 * @param {array} params 请求参数
 */
export function logList(params) {
  return request({
    url: '/admin/Log/logList',
    method: 'get',
    params: params
  })
}
/**
   * 会员日志信息
   * @param {array} params 请求参数
   */
export function logInfo(params) {
  return request({
    url: '/admin/Log/logInfo',
    method: 'get',
    params: params
  })
}
/**
   * 会员日志删除
   * @param {array} data 请求数据
   */
export function logDele(data) {
  return request({
    url: '/admin/Log/logDele',
    method: 'post',
    data
  })
}
/**
   * 会员日志统计
   * @param {array} data 请求数据
   */
export function logStatistic(data) {
  return request({
    url: '/admin/Log/logStatistic',
    method: 'post',
    data
  })
}
