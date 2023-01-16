import request from '@/utils/request'
// 内容管理
const url = '/admin/content.Content/'
/**
 * 内容列表
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
 * 内容信息
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
 * 内容添加
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
 * 内容修改
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
 * 内容删除
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
 * 内容修改分类
 * @param {array} data 请求数据
 */
export function editcate(data) {
  return request({
    url: url + 'editcate',
    method: 'post',
    data
  })
}
/**
 * 内容修改标签
 * @param {array} data 请求数据
 */
export function edittag(data) {
  return request({
    url: url + 'edittag',
    method: 'post',
    data
  })
}
/**
 * 内容是否置顶
 * @param {array} data 请求数据
 */
export function istop(data) {
  return request({
    url: url + 'istop',
    method: 'post',
    data
  })
}
/**
 * 内容是否热门
 * @param {array} data 请求数据
 */
export function ishot(data) {
  return request({
    url: url + 'ishot',
    method: 'post',
    data
  })
}
/**
 * 内容是否推荐
 * @param {array} data 请求数据
 */
export function isrec(data) {
  return request({
    url: url + 'isrec',
    method: 'post',
    data
  })
}
/**
 * 内容是否禁用
 * @param {array} data 请求数据
 */
export function disable(data) {
  return request({
    url: url + 'disable',
    method: 'post',
    data
  })
}
