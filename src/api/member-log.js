import request from '@/utils/request'

// ----------------会员日志----------------
/**
 * 会员日志列表
 * @param {array} params 请求参数
 */
export function memberLogList(params) {
  return request({
    url: '/admin/MemberLog/memberLogList',
    method: 'get',
    params: params
  })
}
/**
   * 会员日志信息
   * @param {array} params 请求参数
   */
export function memberLogInfo(params) {
  return request({
    url: '/admin/MemberLog/memberLogInfo',
    method: 'get',
    params: params
  })
}
/**
   * 会员日志删除
   * @param {array} data 请求数据
   */
export function memberLogDele(data) {
  return request({
    url: '/admin/MemberLog/memberLogDele',
    method: 'post',
    data
  })
}
/**
   * 会员日志统计
   * @param {array} data 请求数据
   */
export function memberLogSta(data) {
  return request({
    url: '/admin/MemberLog/memberLogSta',
    method: 'post',
    data
  })
}
