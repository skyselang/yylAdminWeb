import request from '@/utils/request'

// ----------------产品管理----------------
/**
 * 产品列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/Product/list',
    method: 'get',
    params: params
  })
}
/**
 * 产品分类列表
 * @param {array} params 请求参数
 */
export function category(params) {
  return request({
    url: '/admin/Product/category',
    method: 'get',
    params: params
  })
}
/**
 * 产品信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/Product/info',
    method: 'get',
    params: params
  })
}
/**
 * 产品添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/Product/add',
    method: 'post',
    data
  })
}
/**
 * 产品修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/Product/edit',
    method: 'post',
    data
  })
}
/**
 * 产品删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/Product/dele',
    method: 'post',
    data
  })
}
/**
 * 产品是否置顶
 * @param {array} data 请求数据
 */
export function istop(data) {
  return request({
    url: '/admin/Product/istop',
    method: 'post',
    data
  })
}
/**
 * 产品是否热门
 * @param {array} data 请求数据
 */
export function ishot(data) {
  return request({
    url: '/admin/Product/ishot',
    method: 'post',
    data
  })
}
/**
 * 产品是否推荐
 * @param {array} data 请求数据
 */
export function isrec(data) {
  return request({
    url: '/admin/Product/isrec',
    method: 'post',
    data
  })
}
/**
 * 产品是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/Product/ishide',
    method: 'post',
    data
  })
}
/**
 * 产品回收站
 * @param {array} data 请求参数
 */
export function recover(params) {
  return request({
    url: '/admin/Product/recover',
    method: 'get',
    params: params
  })
}
/**
 * 产品回收站恢复
 * @param {array} data 请求数据
 */
export function recoverReco(data) {
  return request({
    url: '/admin/Product/recoverReco',
    method: 'post',
    data
  })
}
/**
 * 产品回收站删除
 * @param {array} data 请求数据
 */
export function recoverDele(data) {
  return request({
    url: '/admin/Product/recoverDele',
    method: 'post',
    data
  })
}
