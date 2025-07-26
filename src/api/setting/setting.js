import request from '@/utils/request'
// 设置管理接口
const url = '/admin/setting.Setting/'

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
 * 联系设置信息
 * @param {array} params 请求参数
 */
export function contactInfoApi(params) {
  return request({
    url: url + 'contactInfo',
    method: 'get',
    params: params
  })
}

/**
 * 联系设置修改
 * @param {array} data 请求数据
 */
export function contactEditApi(data) {
  return request({
    url: url + 'contactEdit',
    method: 'post',
    data
  })
}
