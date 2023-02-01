import request from '@/utils/request'
// 内容分类
const url = '/admin/content.Category/'
/**
 * 内容分类列表
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
 * 内容分类信息
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
 * 内容分类添加
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
 * 内容分类修改
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
 * 内容分类删除
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
 * 内容分类修改上级
 * @param {array} data 请求数据
 */
export function editpid(data) {
  return request({
    url: url + 'editpid',
    method: 'post',
    data
  })
}
/**
 * 内容分类是否禁用
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
 * 内容分类内容
 * @param {array} params 请求参数
 */
export function content(params) {
  return request({
    url: url + 'content',
    method: 'get',
    params: params
  })
}
/**
 * 内容分类内容解除
 * @param {array} data 请求数据
 */
export function contentRemove(data) {
  return request({
    url: url + 'contentRemove',
    method: 'post',
    data
  })
}
