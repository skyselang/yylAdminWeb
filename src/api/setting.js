import request from '@/utils/request'

// ----------------基础管理----------------
/**
 * Token信息
 * @param {array} params 请求数据
 */
export function tokenInfo(params) {
  return request({
    url: '/admin/Setting/tokenInfo',
    method: 'get',
    params: params
  })
}
/**
 * Token修改
 * @param {array} data 请求数据
 */
export function tokenEdit(data) {
  return request({
    url: '/admin/Setting/tokenEdit',
    method: 'post',
    data
  })
}
/**
 * 验证码信息
 * @param {array} params 请求数据
 */
export function verifyInfo(params) {
  return request({
    url: '/admin/Setting/verifyInfo',
    method: 'get',
    params: params
  })
}
/**
 * 验证码修改
 * @param {array} data 请求数据
 */
export function verifyEdit(data) {
  return request({
    url: '/admin/Setting/verifyEdit',
    method: 'post',
    data
  })
}
