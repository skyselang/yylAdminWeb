import request from '@/utils/request'
// 公告管理
const url = '/admin/admin.Notice/'
/**
 * 公告列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: url + 'list',
    method: 'get',
    params: params
  })
}
/**
 * 公告信息
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
 * 公告添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: url + 'add',
    method: 'post',
    data
  })
}
/**
 * 公告修改
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
 * 公告删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: url + 'dele',
    method: 'post',
    data
  })
}
/**
 * 公告是否开启
 * @param {array} data 请求数据
 */
export function isopen(data) {
  return request({
    url: url + 'isopen',
    method: 'post',
    data
  })
}
/**
 * 公告开启时间
 * @param {array} data 请求数据
 */
export function opentime(data) {
  return request({
    url: url + 'opentime',
    method: 'post',
    data
  })
}
