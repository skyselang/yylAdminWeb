import request from '@/utils/request'

// ---------------文章分类-----------------
/**
 * 文章分类列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/ArticleCategory/list',
    method: 'get',
    params: params
  })
}
/**
 * 文章分类信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/ArticleCategory/info',
    method: 'get',
    params: params
  })
}
/**
 * 文章分类添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/ArticleCategory/add',
    method: 'post',
    data
  })
}
/**
 * 文章分类修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/ArticleCategory/edit',
    method: 'post',
    data
  })
}
/**
 * 文章分类删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/ArticleCategory/dele',
    method: 'post',
    data
  })
}
/**
 * 文章分类是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/ArticleCategory/ishide',
    method: 'post',
    data
  })
}
