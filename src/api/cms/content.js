import request from '@/utils/request'
const url = '/admin/cms.Content/'
// ----------------内容管理----------------
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
 * 内容分类列表
 * @param {array} params 请求参数
 */
export function category(params) {
  return request({
    url: url + 'category',
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
 * 内容是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: url + 'ishide',
    method: 'post',
    data
  })
}
/**
 * 内容回收站
 * @param {array} data 请求参数
 */
export function recover(params) {
  return request({
    url: url + 'recover',
    method: 'get',
    params: params
  })
}
/**
 * 内容回收站恢复
 * @param {array} data 请求数据
 */
export function recoverReco(data) {
  return request({
    url: url + 'recoverReco',
    method: 'post',
    data
  })
}
/**
 * 内容回收站删除
 * @param {array} data 请求数据
 */
export function recoverDele(data) {
  return request({
    url: url + 'recoverDele',
    method: 'post',
    data
  })
}
