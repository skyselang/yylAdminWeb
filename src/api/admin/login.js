import request from '@/utils/request'
const url = '/admin/admin.Login/'
// ----------------登录退出-----------------
/**
 * 验证码
 *  @param {array} params 请求参数
 */
export function captcha(params) {
  return request({
    url: url + 'captcha',
    method: 'get',
    params: params
  })
}
/**
 * 设置
 *  @param {array} params 请求参数
 */
export function setting(params) {
  return request({
    url: url + 'setting',
    method: 'get',
    params: params
  })
}
/**
 * 登录
 * @param {array} data 请求数据
 */
export function login(data) {
  return request({
    url: url + 'login',
    method: 'post',
    data
  })
}
/**
 * 退出
 * @param {array} data 请求数据
 */
export function logout(data) {
  return request({
    url: url + 'logout',
    method: 'post',
    data
  })
}
