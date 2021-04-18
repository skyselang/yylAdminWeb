import request from '@/utils/request'

// ----------------接口环境----------------
/**
 * 接口环境列表
 * @param {array} params 请求参数
 */
export function list(params) {
  return request({
    url: '/admin/ApiEnv/list',
    method: 'get',
    params: params
  })
}
/**
 * 接口环境信息
 * @param {array} data 请求数据
 */
export function info(data) {
  return request({
    url: '/admin/ApiEnv/info',
    method: 'get',
    params: data
  })
}
/**
 * 接口环境添加
 * @param {array} data 请求数据
 */
export function add(data) {
  return request({
    url: '/admin/ApiEnv/add',
    method: 'post',
    data
  })
}
/**
 * 接口环境修改
 * @param {array} data 请求数据
 */
export function edit(data) {
  return request({
    url: '/admin/ApiEnv/edit',
    method: 'post',
    data
  })
}
/**
 * 接口环境删除
 * @param {array} data 请求数据
 */
export function dele(data) {
  return request({
    url: '/admin/ApiEnv/dele',
    method: 'post',
    data
  })
}
