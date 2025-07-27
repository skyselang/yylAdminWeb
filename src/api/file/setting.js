import request from '@/utils/request'
// 文件设置接口
const url = '/admin/file.Setting/'

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
 * 限制设置信息
 * @param {array} params 请求参数
 */
export function limitInfoApi(params) {
  return request({
    url: url + 'limitInfo',
    method: 'get',
    params: params
  })
}

/**
 * 限制设置修改
 * @param {array} data 请求数据
 */
export function limitEditApi(data) {
  return request({
    url: url + 'limitEdit',
    method: 'post',
    data
  })
}

/**
 * 前台设置信息
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
 * 前台设置修改
 * @param {array} data 请求数据
 */
export function apiEditApi(data) {
  return request({
    url: url + 'apiEdit',
    method: 'post',
    data
  })
}
