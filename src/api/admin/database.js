import request from '@/utils/request'
// 数据库管理
const url = '/admin/admin.Database/'
/**
 * 备份列表
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
 * 备份信息
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
 * 备份添加
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
 * 备份修改
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
 * 备份删除
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
 * 备份还原
 * @param {array} data 请求数据
 */
export function restore(data) {
  return request({
    url: url + 'restore',
    method: 'post',
    data
  })
}
/**
 * 备份下载
 * @param {array} data 请求数据
 */
export function down(data) {
  return request({
    url: url + 'down',
    method: 'post',
    responseType: 'blob',
    data
  })
}
/**
 * 优化表
 * @param {array} data 请求数据
 */
export function optimize(data) {
  return request({
    url: url + 'optimize',
    method: 'post',
    data
  })
}
/**
 * 修复表
 * @param {array} data 请求数据
 */
export function repair(data) {
  return request({
    url: url + 'repair',
    method: 'post',
    data
  })
}
