import request from '@/utils/request'

// ----------------轮播管理----------------
/**
 * 轮播列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/Carousel/list',
    method: 'get',
    params: params
  })
}
/**
 * 轮播信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/Carousel/info',
    method: 'get',
    params: params
  })
}
/**
 * 轮播添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/Carousel/add',
    method: 'post',
    data
  })
}
/**
 * 轮播修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/Carousel/edit',
    method: 'post',
    data
  })
}
/**
 * 轮播删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/Carousel/dele',
    method: 'post',
    data
  })
}
/**
 * 轮播是否置顶
 * @param {array} data 请求数据
 */
export function istop(data) {
  return request({
    url: '/admin/Carousel/istop',
    method: 'post',
    data
  })
}
/**
 * 轮播是否热门
 * @param {array} data 请求数据
 */
export function ishot(data) {
  return request({
    url: '/admin/Carousel/ishot',
    method: 'post',
    data
  })
}
/**
 * 轮播是否推荐
 * @param {array} data 请求数据
 */
export function isrec(data) {
  return request({
    url: '/admin/Carousel/isrec',
    method: 'post',
    data
  })
}
/**
 * 轮播是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/Carousel/ishide',
    method: 'post',
    data
  })
}
/**
 * 轮播回收站
 * @param {array} data 请求参数
 */
export function recover(params) {
  return request({
    url: '/admin/Carousel/recover',
    method: 'get',
    params: params
  })
}
/**
 * 轮播回收站恢复
 * @param {array} data 请求数据
 */
export function recoverReco(data) {
  return request({
    url: '/admin/Carousel/recoverReco',
    method: 'post',
    data
  })
}
/**
 * 轮播回收站删除
 * @param {array} data 请求数据
 */
export function recoverDele(data) {
  return request({
    url: '/admin/Carousel/recoverDele',
    method: 'post',
    data
  })
}
