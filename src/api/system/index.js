import request from '@/utils/request'
// 首页接口
const url = '/admin/system.Index/'

/**
 * 首页
 * @param {array} params 请求参数
 */
export function indexApi(params) {
  return request({
    url: url + 'index',
    method: 'get',
    params: params
  })
}

/**
 * 公告
 * @param {array} params 请求参数
 */
export function noticeApi(params) {
  return request({
    url: url + 'notice',
    method: 'get',
    params: params
  })
}

/**
 * 总数统计
 * @param {array} params 请求参数
 */
export function countApi(params) {
  return request({
    url: url + 'count',
    method: 'get',
    params: params
  })
}

/**
 * 会员统计
 * @param {array} params 请求参数
 */
export function memberApi(params) {
  return request({
    url: url + 'member',
    method: 'get',
    params: params
  })
}

/**
 * 内容统计
 * @param {array} params 请求参数
 */
export function contentApi(params) {
  return request({
    url: url + 'content',
    method: 'get',
    params: params
  })
}

/**
 * 文件统计
 * @param {array} params 请求参数
 */
export function fileApi(params) {
  return request({
    url: url + 'file',
    method: 'get',
    params: params
  })
}
