import request from '@/utils/request'

// ----------------控制台-----------------
/**
 * 首页
 * @param {array} params 请求参数
 */
export function index(params) {
  return request({
    url: '/admin/AdminIndex/index',
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
    url: '/admin/AdminIndex/member',
    method: 'get',
    params: params
  })
}
