import request from '@/utils/request'

// ---------------产品分类-----------------
/**
 * 产品分类列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/ProductCategory/list',
    method: 'get',
    params: params
  })
}
/**
 * 产品分类信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/ProductCategory/info',
    method: 'get',
    params: params
  })
}
/**
 * 产品分类添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/ProductCategory/add',
    method: 'post',
    data
  })
}
/**
 * 产品分类修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/ProductCategory/edit',
    method: 'post',
    data
  })
}
/**
 * 产品分类删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/ProductCategory/dele',
    method: 'post',
    data
  })
}
/**
 * 产品分类是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/ProductCategory/ishide',
    method: 'post',
    data
  })
}
