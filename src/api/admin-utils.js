import request from '@/utils/request'

// ----------------实用工具----------------
/**
 * 接口文档
 * @param {array} data 请求数据
 */
export function apidoc(data) {
  return request({
    url: '/admin/AdminUtils/apidoc',
    method: 'get',
    params: data
  })
}
/**
 * 表单构建
 * @param {array} data 请求数据
 */
export function formbuild(data) {
  return request({
    url: '/admin/AdminUtils/form',
    method: 'get',
    params: data
  })
}
/**
 * 服务器信息
 * @param {array} data 请求数据
 */
export function server(data) {
  return request({
    url: '/admin/AdminUtils/server',
    method: 'get',
    params: data
  })
}
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
 * 生成二维码
 * @param {array} data 请求数据
 */
export function qrcode(data) {
  return request({
    url: '/admin/AdminUtils/qrcode',
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
