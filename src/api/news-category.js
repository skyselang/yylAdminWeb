import request from '@/utils/request'

// ---------------新闻分类-----------------
/**
 * 新闻分类列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/NewsCategory/list',
    method: 'get',
    params: params
  })
}
/**
 * 新闻分类信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/NewsCategory/info',
    method: 'get',
    params: params
  })
}
/**
 * 新闻分类添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/NewsCategory/add',
    method: 'post',
    data
  })
}
/**
 * 新闻分类修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/NewsCategory/edit',
    method: 'post',
    data
  })
}
/**
 * 新闻分类删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/NewsCategory/dele',
    method: 'post',
    data
  })
}
/**
 * 新闻分类是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/NewsCategory/ishide',
    method: 'post',
    data
  })
}
