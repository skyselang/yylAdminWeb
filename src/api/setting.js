import request from '@/utils/request'

// ----------------设置-------------------
/**
 * 设置信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/Setting/info',
    method: 'get',
    params: params
  })
}
/**
 * 验证码设置
 * @param {array} data 请求数据
 */
export function verify(data) {
  return request({
    url: '/admin/Setting/verify',
    method: 'post',
    data
  })
}
/**
 * Token设置
 * @param {array} data 请求数据
 */
export function token(data) {
  return request({
    url: '/admin/Setting/token',
    method: 'post',
    data
  })
}
