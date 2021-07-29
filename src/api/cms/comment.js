import request from '@/utils/request'
const url = '/admin/cms.Comment/'
// ----------------留言管理----------------
/**
 * 留言列表
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
 * 留言信息
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
 * 留言添加
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
 * 留言修改
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
 * 留言删除
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
 * 留言是否已读
 * @param {array} data 请求数据
 */
export function isread(data) {
  return request({
    url: url + 'isread',
    method: 'post',
    data
  })
}
/**
 * 留言回收站
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
 * 留言回收站恢复
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
 * 留言回收站删除
 * @param {array} data 请求数据
 */
export function recoverDele(data) {
  return request({
    url: url + 'recoverDele',
    method: 'post',
    data
  })
}
