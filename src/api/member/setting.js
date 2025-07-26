import request from '@/utils/request'
// 会员设置接口
const url = '/admin/member.Setting/'

/**
 * 基本设置信息
 * @param {array} params 请求参数
 */
export function basicInfoApi(params) {
  return request({
    url: url + 'basicInfo',
    method: 'get',
    params: params
  })
}

/**
 * 基本设置修改
 * @param {array} data 请求数据
 */
export function basicEditApi(data) {
  return request({
    url: url + 'basicEdit',
    method: 'post',
    data
  })
}

/**
 * 登录注册设置信息
 * @param {array} params 请求参数
 */
export function logregInfoApi(params) {
  return request({
    url: url + 'logregInfo',
    method: 'get',
    params: params
  })
}

/**
 * 登录注册设置修改
 * @param {array} data 请求数据
 */
export function logregEditApi(data) {
  return request({
    url: url + 'logregEdit',
    method: 'post',
    data
  })
}

/**
 * 第三方账号设置信息
 * @param {array} params 请求参数
 */
export function thirdInfoApi(params) {
  return request({
    url: url + 'thirdInfo',
    method: 'get',
    params: params
  })
}

/**
 * 第三方账号设置修改
 * @param {array} data 请求数据
 */
export function thirdEditApi(data) {
  return request({
    url: url + 'thirdEdit',
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
