import request from '@/utils/request'
// 会员管理
const url = '/admin/member.Member/'
/**
 * 会员列表
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
 * 会员信息
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
 * 会员添加
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
 * 会员修改
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
 * 会员删除
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
 * 会员修改所在地
 * @param {array} data 请求数据
 */
export function region(data) {
  return request({
    url: url + 'region',
    method: 'post',
    data
  })
}
/**
 * 会员修改标签
 * @param {array} data 请求数据
 */
export function edittag(data) {
  return request({
    url: url + 'edittag',
    method: 'post',
    data
  })
}
/**
 * 会员修改标签
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
 * 会员重置密码
 * @param {array} data 请求数据
 */
export function repwd(data) {
  return request({
    url: url + 'repwd',
    method: 'post',
    data
  })
}
/**
 * 会员是否超会
 * @param {array} data 请求数据
 */
export function issuper(data) {
  return request({
    url: url + 'super',
    method: 'post',
    data
  })
}
/**
 * 会员是否禁用
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
 * 会员导入
 * @param {array} data 请求数据
 */
export function imports(data) {
  return request({
    url: url + 'import',
    method: 'post',
    data
  })
}
/**
 * 会员统计
 * @param {array} params 请求参数
 */
export function statistic(params) {
  return request({
    url: url + 'statistic',
    method: 'get',
    params: params
  })
}
