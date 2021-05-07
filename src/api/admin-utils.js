import request from '@/utils/request'

// ----------------实用工具----------------
/**
 * 随机字符串
 * @param {array} data 请求数据
 */
export function strrand(data) {
  return request({
    url: '/admin/AdminUtils/strrand',
    method: 'post',
    data
  })
}
/**
 * 字符串转换
 * @param {array} data 请求数据
 */
export function strtran(data) {
  return request({
    url: '/admin/AdminUtils/strtran',
    method: 'post',
    data
  })
}
/**
 * 时间戳转换
 * @param {array} data 请求数据
 */
export function timestamp(data) {
  return request({
    url: '/admin/AdminUtils/timestamp',
    method: 'post',
    data
  })
}
/**
 * 字节转换
 * @param {array} data 请求数据
 */
export function bytetran(data) {
  return request({
    url: '/admin/AdminUtils/bytetran',
    method: 'post',
    data
  })
}
/**
 * IP信息
 * @param {array} data 请求数据
 */
export function ipinfo(data) {
  return request({
    url: '/admin/AdminUtils/ipinfo',
    method: 'post',
    data
  })
}
/**
 * 服务器信息
 * @param {array} params 请求参数
 */
export function server(params) {
  return request({
    url: '/admin/AdminUtils/server',
    method: 'get',
    params: params
  })
}
