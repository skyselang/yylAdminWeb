import request from '@/utils/request'
// 系统设置接口
const url = '/admin/system.Setting/'

/**
 * 系统设置信息
 * @param {array} params 请求参数
 */
export function systemInfoApi(params) {
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
export function systemEditApi(data) {
  return request({
    url: url + 'systemEdit',
    method: 'post',
    data
  })
}

/**
 * 验证码设置信息
 * @param {array} params 请求参数
 */
export function captchaInfoApi(params) {
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
export function captchaEditApi(data) {
  return request({
    url: url + 'captchaEdit',
    method: 'post',
    data
  })
}

/**
 * 日志设置信息
 * @param {array} params 请求参数
 */
export function logInfoApi(params) {
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
export function logEditApi(data) {
  return request({
    url: url + 'logEdit',
    method: 'post',
    data
  })
}

/**
 * 缓存设置信息
 * @param {array} params 请求参数
 */
export function cacheInfoApi(params) {
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
export function cacheClearApi(data) {
  return request({
    url: url + 'cacheClear',
    method: 'post',
    data
  })
}

/**
 * 邮箱设置信息
 * @param {array} params 请求参数
 */
export function emailInfoApi(params) {
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
export function emailEditApi(data) {
  return request({
    url: url + 'emailEdit',
    method: 'post',
    data
  })
}

/**
 * 接口设置信息
 * @param {array} params 请求参数
 */
export function apiInfoApi(params) {
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
export function apiEditApi(data) {
  return request({
    url: url + 'apiEdit',
    method: 'post',
    data
  })
}

/**
 * Token设置信息
 * @param {array} params 请求参数
 */
export function tokenInfoApi(params) {
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
export function tokenEditApi(data) {
  return request({
    url: url + 'tokenEdit',
    method: 'post',
    data
  })
}

/**
 * 服务器信息
 * @param {array} params 请求参数
 */
export function serverInfoApi(params) {
  return request({
    url: url + 'serverInfo',
    method: 'get',
    params: params
  })
}
