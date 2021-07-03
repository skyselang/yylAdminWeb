import request from '@/utils/request'

// ----------------视频管理----------------
/**
 * 视频列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/Video/list',
    method: 'get',
    params: params
  })
}
/**
 * 视频分类列表
 * @param {array} params 请求参数
 */
export function category(params) {
  return request({
    url: '/admin/Video/category',
    method: 'get',
    params: params
  })
}
/**
 * 视频信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/Video/info',
    method: 'get',
    params: params
  })
}
/**
 * 视频添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/Video/add',
    method: 'post',
    data
  })
}
/**
 * 视频修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/Video/edit',
    method: 'post',
    data
  })
}
/**
 * 视频删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/Video/dele',
    method: 'post',
    data
  })
}
/**
 * 视频是否置顶
 * @param {array} data 请求数据
 */
export function istop(data) {
  return request({
    url: '/admin/Video/istop',
    method: 'post',
    data
  })
}
/**
 * 视频是否热门
 * @param {array} data 请求数据
 */
export function ishot(data) {
  return request({
    url: '/admin/Video/ishot',
    method: 'post',
    data
  })
}
/**
 * 视频是否推荐
 * @param {array} data 请求数据
 */
export function isrec(data) {
  return request({
    url: '/admin/Video/isrec',
    method: 'post',
    data
  })
}
/**
 * 视频是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/Video/ishide',
    method: 'post',
    data
  })
}
/**
 * 视频回收站
 * @param {array} data 请求参数
 */
export function recover(params) {
  return request({
    url: '/admin/Video/recover',
    method: 'get',
    params: params
  })
}
/**
 * 视频回收站恢复
 * @param {array} data 请求数据
 */
export function recoverReco(data) {
  return request({
    url: '/admin/Video/recoverReco',
    method: 'post',
    data
  })
}
/**
 * 视频回收站删除
 * @param {array} data 请求数据
 */
export function recoverDele(data) {
  return request({
    url: '/admin/Video/recoverDele',
    method: 'post',
    data
  })
}
