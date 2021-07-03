import request from '@/utils/request'

// ---------------下载分类-----------------
/**
 * 下载分类列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/DownloadCategory/list',
    method: 'get',
    params: params
  })
}
/**
 * 下载分类信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/DownloadCategory/info',
    method: 'get',
    params: params
  })
}
/**
 * 下载分类添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/DownloadCategory/add',
    method: 'post',
    data
  })
}
/**
 * 下载分类修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/DownloadCategory/edit',
    method: 'post',
    data
  })
}
/**
 * 下载分类删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/DownloadCategory/dele',
    method: 'post',
    data
  })
}
/**
 * 下载分类是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/DownloadCategory/ishide',
    method: 'post',
    data
  })
}
