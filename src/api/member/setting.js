import request from '@/utils/request'
// 会员设置
const url = '/admin/member.Setting/'
/**
 * Token设置信息
 * @param {array} params 请求参数
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
 * @param {array} params 请求参数
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
 * @param {array} params 请求参数
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
 * @param {array} params 请求参数
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
 * 登录注册设置信息
 * @param {array} params 请求参数
 */
export function logregInfo(params) {
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
export function logregEdit(data) {
  return request({
    url: url + 'logregEdit',
    method: 'post',
    data
  })
}
/**
 * 自定义设置信息
 * @param {array} params 请求参数
 */
export function diyInfo(params) {
  return request({
    url: url + 'diyInfo',
    method: 'get',
    params: params
  })
}
/**
 * 自定义设置修改
 * @param {array} data 请求数据
 */
export function diyEdit(data) {
  return request({
    url: url + 'diyEdit',
    method: 'post',
    data
  })
}
