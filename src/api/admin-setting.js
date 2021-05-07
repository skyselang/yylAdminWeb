import request from '@/utils/request'

// ----------------设置管理----------------
/**
 * 缓存信息
 * @param {array} params 请求数据
 */
export function cacheInfo(params) {
  return request({
    url: '/admin/AdminSetting/cacheInfo',
    method: 'get',
    params: params
  })
}
/**
 * 缓存清除
 * @param {array} data 请求数据
 */
export function cacheClear(data) {
  return request({
    url: '/admin/AdminSetting/cacheClear',
    method: 'post',
    data
  })
}
/**
 * Token信息
 * @param {array} params 请求数据
 */
export function tokenInfo(params) {
  return request({
    url: '/admin/AdminSetting/tokenInfo',
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
    url: '/admin/AdminSetting/tokenEdit',
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
    url: '/admin/AdminSetting/verifyInfo',
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
    url: '/admin/AdminSetting/verifyEdit',
    method: 'post',
    data
  })
}
