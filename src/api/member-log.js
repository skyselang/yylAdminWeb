import request from '@/utils/request'

// ----------------会员日志----------------
/**
 * 会员日志列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/MemberLog/list',
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
    url: '/admin/MemberLog/info',
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
    url: '/admin/MemberLog/dele',
    method: 'post',
    data
  })
}
/**
 * 会员日志统计
 * @param {array} data 请求数据
 */
export function stat(data) {
  return request({
    url: '/admin/MemberLog/stat',
    method: 'post',
    data
  })
}
