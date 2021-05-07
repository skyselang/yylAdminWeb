import request from '@/utils/request'

// ----------------微信设置-------------------
/**
 * 公众号信息
 * @param {array} params 请求参数
 */
export function offiInfo(params) {
  return request({
    url: '/admin/WechatSetting/offiInfo',
    method: 'get',
    params: params
  })
}
/**
 * 公众号修改
 * @param {array} data 请求数据
 */
export function offiEdit(data) {
  return request({
    url: '/admin/WechatSetting/offiEdit',
    method: 'post',
    data
  })
}
/**
 * 小程序信息
 * @param {array} params 请求参数
 */
export function miniInfo(params) {
  return request({
    url: '/admin/WechatSetting/miniInfo',
    method: 'get',
    params: params
  })
}
/**
 * 小程序修改
 * @param {array} data 请求数据
 */
export function miniEdit(data) {
  return request({
    url: '/admin/WechatSetting/miniEdit',
    method: 'post',
    data
  })
}
