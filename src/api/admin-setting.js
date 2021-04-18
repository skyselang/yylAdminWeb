import request from '@/utils/request'

// ----------------系统管理----------------
/**
 * 设置信息
 * @param {array} params 请求数据
 */
export function info(params) {
  return request({
    url: '/admin/AdminSetting/info',
    method: 'get',
    params: params
  })
}
/**
 * 缓存设置
 * @param {array} data 请求数据
 */
export function cache(data) {
  return request({
    url: '/admin/AdminSetting/cache',
    method: 'post',
    data
  })
}
/**
 * 验证码设置
 * @param {array} data 请求数据
 */
export function verify(data) {
  return request({
    url: '/admin/AdminSetting/verify',
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
    url: '/admin/AdminSetting/token',
    method: 'post',
    data
  })
}
