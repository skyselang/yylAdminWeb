import request from '@/utils/request'

// ----------------文章管理----------------
/**
 * 文章列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/Download/list',
    method: 'get',
    params: params
  })
}
/**
 * 文章分类列表
 * @param {array} params 请求参数
 */
export function category(params) {
  return request({
    url: '/admin/Download/category',
    method: 'get',
    params: params
  })
}
/**
 * 文章信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/Download/info',
    method: 'get',
    params: params
  })
}
/**
 * 文章添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/Download/add',
    method: 'post',
    data
  })
}
/**
 * 文章修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/Download/edit',
    method: 'post',
    data
  })
}
/**
 * 文章删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/Download/dele',
    method: 'post',
    data
  })
}
/**
 * 文章是否置顶
 * @param {array} data 请求数据
 */
export function istop(data) {
  return request({
    url: '/admin/Download/istop',
    method: 'post',
    data
  })
}
/**
 * 文章是否热门
 * @param {array} data 请求数据
 */
export function ishot(data) {
  return request({
    url: '/admin/Download/ishot',
    method: 'post',
    data
  })
}
/**
 * 文章是否推荐
 * @param {array} data 请求数据
 */
export function isrec(data) {
  return request({
    url: '/admin/Download/isrec',
    method: 'post',
    data
  })
}
/**
 * 文章是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/Download/ishide',
    method: 'post',
    data
  })
}
/**
 * 文章回收站
 * @param {array} data 请求参数
 */
export function recover(params) {
  return request({
    url: '/admin/Download/recover',
    method: 'get',
    params: params
  })
}
/**
 * 文章回收站恢复
 * @param {array} data 请求数据
 */
export function recoverReco(data) {
  return request({
    url: '/admin/Download/recoverReco',
    method: 'post',
    data
  })
}
/**
 * 文章回收站删除
 * @param {array} data 请求数据
 */
export function recoverDele(data) {
  return request({
    url: '/admin/Download/recoverDele',
    method: 'post',
    data
  })
}
