import request from '@/utils/request'

// ----------------基础管理----------------
/**
 * Token设置信息
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
 * Token设置修改
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
 * 验证码设置信息
 * @param {array} params 请求数据
 */
export function captchaInfo(params) {
  return request({
    url: '/admin/Setting/captchaInfo',
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
    url: '/admin/Setting/captchaEdit',
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
    url: '/admin/Setting/logInfo',
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
    url: '/admin/Setting/logEdit',
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
    url: '/admin/Setting/apiInfo',
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
    url: '/admin/Setting/apiEdit',
    method: 'post',
    data
  })
}
