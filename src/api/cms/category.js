import request from '@/utils/request'
const url = '/admin/cms.Category/'
// ---------------内容分类-----------------
/**
 * 内容分类列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: url + 'list',
    method: 'get',
    params: params
  })
}
/**
 * 内容分类信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: url + 'info',
    method: 'get',
    params: params
  })
}
/**
 * 内容分类添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: url + 'add',
    method: 'post',
    data
  })
}
/**
 * 内容分类修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: url + 'edit',
    method: 'post',
    data
  })
}
/**
 * 内容分类删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: url + 'dele',
    method: 'post',
    data
  })
}
/**
 * 内容分类设置父级
 * @param {array} data 请求数据
 */
export function pid(data) {
  return request({
    url: url + 'pid',
    method: 'post',
    data
  })
}
/**
 * 内容分类是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: url + 'ishide',
    method: 'post',
    data
  })
}
