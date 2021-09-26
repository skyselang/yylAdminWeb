import request from '@/utils/request'
const url = '/admin/admin.UserCenter/'
// ----------------个人中心----------------
/**
 * 我的信息
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
 * 修改信息
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
 * 修改密码
 * @param {array} data 请求数据
 */
export function pwd(data) {
  return request({
    url: url + 'pwd',
    method: 'post',
    data
  })
}
/**
 * 我的日志
 * @param {array} params 请求参数
 */
export function log(params) {
  return request({
    url: url + 'log',
    method: 'get',
    params: params
  })
}
