import request from '@/utils/request'
// 内容标签
const url = '/admin/content.Tag/'
/**
 * 内容标签列表
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
 * 内容标签信息
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
 * 内容标签添加
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
 * 内容标签修改
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
 * 内容标签删除
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
 * 内容标签是否禁用
 * @param {array} data 请求数据
 */
export function disable(data) {
  return request({
    url: url + 'disable',
    method: 'post',
    data
  })
}
/**
 * 内容标签内容列表
 * @param {array} params 请求参数
 */
export function contentList(params) {
  return request({
    url: url + 'contentList',
    method: 'get',
    params: params
  })
}
/**
 * 内容标签内容解除
 * @param {array} data 请求数据
 */
export function contentRemove(data) {
  return request({
    url: url + 'contentRemove',
    method: 'post',
    data
  })
}
