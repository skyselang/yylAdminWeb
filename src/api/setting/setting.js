import request from '@/utils/request'
// 设置管理
const url = '/admin/setting.Setting/'
/**
 * 设置信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: url + 'info',
    method: 'get',
    params: params
  })
}
/**
 * 设置修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: url + 'edit',
    method: 'post',
    data
  })
}
/**
 * 邮箱设置信息
 * @param {array} params 请求参数
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
