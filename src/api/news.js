import request from '@/utils/request'

// ----------------新闻管理----------------
/**
 * 新闻列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/News/list',
    method: 'get',
    params: params
  })
}
/**
 * 新闻分类列表
 * @param {array} params 请求参数
 */
export function category(params) {
  return request({
    url: '/admin/News/category',
    method: 'get',
    params: params
  })
}
/**
 * 新闻信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/News/info',
    method: 'get',
    params: params
  })
}
/**
 * 新闻添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/News/add',
    method: 'post',
    data
  })
}
/**
 * 新闻修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/News/edit',
    method: 'post',
    data
  })
}
/**
 * 新闻删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/News/dele',
    method: 'post',
    data
  })
}
/**
 * 新闻是否置顶
 * @param {array} data 请求数据
 */
export function istop(data) {
  return request({
    url: '/admin/News/istop',
    method: 'post',
    data
  })
}
/**
 * 新闻是否热门
 * @param {array} data 请求数据
 */
export function ishot(data) {
  return request({
    url: '/admin/News/ishot',
    method: 'post',
    data
  })
}
/**
 * 新闻是否推荐
 * @param {array} data 请求数据
 */
export function isrec(data) {
  return request({
    url: '/admin/News/isrec',
    method: 'post',
    data
  })
}
/**
 * 新闻是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/News/ishide',
    method: 'post',
    data
  })
}
