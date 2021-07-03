import request from '@/utils/request'

// ---------------视频分类-----------------
/**
 * 视频分类列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/VideoCategory/list',
    method: 'get',
    params: params
  })
}
/**
 * 视频分类信息
 * @param {array} params 请求参数
 */
export function info(params) {
  return request({
    url: '/admin/VideoCategory/info',
    method: 'get',
    params: params
  })
}
/**
 * 视频分类添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/VideoCategory/add',
    method: 'post',
    data
  })
}
/**
 * 视频分类修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/VideoCategory/edit',
    method: 'post',
    data
  })
}
/**
 * 视频分类删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/VideoCategory/dele',
    method: 'post',
    data
  })
}
/**
 * 视频分类是否隐藏
 * @param {array} data 请求数据
 */
export function ishide(data) {
  return request({
    url: '/admin/VideoCategory/ishide',
    method: 'post',
    data
  })
}
