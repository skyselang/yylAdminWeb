import request from '@/utils/request'
// ----------------系统管理----------------
const url = '/admin/admin.Setting/'
/**
 * 缓存设置信息
 * @param {array} params 请求数据
 */
export function cacheInfo(params) {
  return request({
    url: url + 'cacheInfo',
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
    url: url + 'cacheClear',
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
    url: url + 'tokenInfo',
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
    url: url + 'tokenEdit',
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
    url: url + 'captchaInfo',
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
    url: url + 'captchaEdit',
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
    url: url + 'logInfo',
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
    url: url + 'logEdit',
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
    url: url + 'apiInfo',
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
    url: url + 'apiEdit',
    method: 'post',
    data
  })
}
/**
 * 系统设置信息
 * @param {array} params 请求数据
 */
export function systemInfo(params) {
  return request({
    url: url + 'systemInfo',
    method: 'get',
    params: params
  })
}
/**
 * 系统设置修改
 * @param {array} data 请求数据
 */
export function systemEdit(data) {
  return request({
    url: url + 'systemEdit',
    method: 'post',
    data
  })
}
/**
 * 邮箱设置信息
 * @param {array} params 请求数据
 */
export function emailInfo(params) {
  return request({
    url: url + 'emailInfo',
    method: 'get',
    params: params
  })
}
/**
 * 邮箱设置修改
 * @param {array} data 请求数据
 */
export function emailEdit(data) {
  return request({
    url: url + 'emailEdit',
    method: 'post',
    data
  })
}
/**
 * 邮箱设置测试
 * @param {array} data 请求数据
 */
export function emailTest(data) {
  return request({
    url: url + 'emailTest',
    method: 'post',
    data
  })
}
