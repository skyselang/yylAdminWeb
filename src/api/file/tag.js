import request from '@/utils/request'
// 文件标签
const url = '/admin/file.Tag/'
/**
 * 文件标签列表
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
 * 文件标签信息
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
 * 文件标签添加
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
 * 文件标签修改
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
 * 文件标签删除
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
 * 文件标签是否禁用
 * @param {array} data 请求数据
 */
export function disable(data) {
  return request({
    url: url + 'disable',
    method: 'post',
    data
  })
}
/**
 * 文件标签文件列表
 * @param {array} params 请求参数
 */
export function fileList(params) {
  return request({
    url: url + 'fileList',
    method: 'get',
    params: params
  })
}
/**
 * 文件标签文件解除
 * @param {array} data 请求数据
 */
export function fileRemove(data) {
  return request({
    url: url + 'fileRemove',
    method: 'post',
    data
  })
}
