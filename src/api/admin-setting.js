import request from '@/utils/request'

// ----------------设置管理----------------
/**
 * 缓存设置信息
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
 * 缓存设置清除
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
 * Token设置信息
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
 * Token设置修改
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
 * 验证码设置信息
 * @param {array} params 请求数据
 */
export function captchaInfo(params) {
  return request({
    url: '/admin/AdminSetting/captchaInfo',
    method: 'get',
    params: params
  })
}
/**
 * 验证码设置修改
 * @param {array} data 请求数据
 */
export function captchaEdit(data) {
  return request({
    url: '/admin/AdminSetting/captchaEdit',
    method: 'post',
    data
  })
}
/**
 * 日志设置信息
 * @param {array} params 请求数据
 */
export function logInfo(params) {
  return request({
    url: '/admin/AdminSetting/logInfo',
    method: 'get',
    params: params
  })
}
/**
 * 日志设置修改
 * @param {array} data 请求数据
 */
export function logEdit(data) {
  return request({
    url: '/admin/AdminSetting/logEdit',
    method: 'post',
    data
  })
}
/**
 * 接口设置信息
 * @param {array} params 请求数据
 */
export function apiInfo(params) {
  return request({
    url: '/admin/AdminSetting/apiInfo',
    method: 'get',
    params: params
  })
}
/**
 * 接口设置修改
 * @param {array} data 请求数据
 */
export function apiEdit(data) {
  return request({
    url: '/admin/AdminSetting/apiEdit',
    method: 'post',
    data
  })
}
