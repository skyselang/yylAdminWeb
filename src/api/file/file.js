import request from '@/utils/request'
const url = '/admin/file.File/'
// ----------------文件管理----------------
/**
 * 分组列表
 * @param {array} params 请求参数
 */
export function group(params) {
  return request({
    url: url + 'group',
    method: 'get',
    params: params
  })
}
/**
 * 文件列表
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
 * 文件信息
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
 * 文件添加
 */
export function add() {
  return process.env.VUE_APP_BASE_API + url + 'add'
}
/**
 * 文件修改
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
 * 文件删除
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
 * 文件修改分组
 * @param {array} data 请求数据
 */
export function editgroup(data) {
  return request({
    url: url + 'editgroup',
    method: 'post',
    data
  })
}
/**
 * 文件修改类型
 * @param {array} data 请求数据
 */
export function edittype(data) {
  return request({
    url: url + 'edittype',
    method: 'post',
    data
  })
}
/**
 * 文件修改域名
 * @param {array} data 请求数据
 */
export function editdomain(data) {
  return request({
    url: url + 'editdomain',
    method: 'post',
    data
  })
}
/**
 * 文件是否禁用
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
 * 文件回收站
 * @param {array} data 请求参数
 */
export function recover(params) {
  return request({
    url: url + 'recover',
    method: 'get',
    params: params
  })
}
/**
 * 文件回收站恢复
 * @param {array} data 请求数据
 */
export function recoverReco(data) {
  return request({
    url: url + 'recoverReco',
    method: 'post',
    data
  })
}
/**
 * 文件回收站删除
 * @param {array} data 请求数据
 */
export function recoverDele(data) {
  return request({
    url: url + 'recoverDele',
    method: 'post',
    data
  })
}
