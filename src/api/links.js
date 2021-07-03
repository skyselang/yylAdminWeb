import request from '@/utils/request'

// ----------------友链管理----------------
/**
 * 友链列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/Links/list',
    method: 'get',
    params: params
  })
}
/**
 * 友链信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/Links/info',
    method: 'get',
    params: params
  })
}
/**
 * 友链添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/Links/add',
    method: 'post',
    data
  })
}
/**
 * 友链修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/Links/edit',
    method: 'post',
    data
  })
}
/**
 * 友链删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/Links/dele',
    method: 'post',
    data
  })
}
/**
 * 友链是否置顶
 * @param {array} data 请求数据
 */
export function istop(data) {
  return request({
    url: '/admin/Links/istop',
    method: 'post',
    data
  })
}
/**
 * 友链是否热门
 * @param {array} data 请求数据
 */
export function ishot(data) {
  return request({
    url: '/admin/Links/ishot',
    method: 'post',
    data
  })
}
/**
 * 友链是否推荐
 * @param {array} data 请求数据
 */
export function isrec(data) {
  return request({
    url: '/admin/Links/isrec',
    method: 'post',
    data
  })
}
/**
 * 友链是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/Links/ishide',
    method: 'post',
    data
  })
}
/**
 * 友链回收站
 * @param {array} data 请求参数
 */
export function recover(params) {
  return request({
    url: '/admin/Links/recover',
    method: 'get',
    params: params
  })
}
/**
 * 友链回收站恢复
 * @param {array} data 请求数据
 */
export function recoverReco(data) {
  return request({
    url: '/admin/Links/recoverReco',
    method: 'post',
    data
  })
}
/**
 * 友链回收站删除
 * @param {array} data 请求数据
 */
export function recoverDele(data) {
  return request({
    url: '/admin/Links/recoverDele',
    method: 'post',
    data
  })
}
