import request from '@/utils/request'

// ----------------案例管理----------------
/**
 * 案例列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/Project/list',
    method: 'get',
    params: params
  })
}
/**
 * 案例分类列表
 * @param {array} params 请求参数
 */
export function category(params) {
  return request({
    url: '/admin/Project/category',
    method: 'get',
    params: params
  })
}
/**
 * 案例信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/Project/info',
    method: 'get',
    params: params
  })
}
/**
 * 案例添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/Project/add',
    method: 'post',
    data
  })
}
/**
 * 案例修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/Project/edit',
    method: 'post',
    data
  })
}
/**
 * 案例删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/Project/dele',
    method: 'post',
    data
  })
}
/**
 * 案例是否置顶
 * @param {array} data 请求数据
 */
export function istop(data) {
  return request({
    url: '/admin/Project/istop',
    method: 'post',
    data
  })
}
/**
 * 案例是否热门
 * @param {array} data 请求数据
 */
export function ishot(data) {
  return request({
    url: '/admin/Project/ishot',
    method: 'post',
    data
  })
}
/**
 * 案例是否推荐
 * @param {array} data 请求数据
 */
export function isrec(data) {
  return request({
    url: '/admin/Project/isrec',
    method: 'post',
    data
  })
}
/**
 * 案例是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/Project/ishide',
    method: 'post',
    data
  })
}
/**
 * 案例回收站
 * @param {array} data 请求参数
 */
export function recover(params) {
  return request({
    url: '/admin/Project/recover',
    method: 'get',
    params: params
  })
}
/**
 * 案例回收站恢复
 * @param {array} data 请求数据
 */
export function recoverReco(data) {
  return request({
    url: '/admin/Project/recoverReco',
    method: 'post',
    data
  })
}
/**
 * 案例回收站删除
 * @param {array} data 请求数据
 */
export function recoverDele(data) {
  return request({
    url: '/admin/Project/recoverDele',
    method: 'post',
    data
  })
}
