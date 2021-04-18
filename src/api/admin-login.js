import request from '@/utils/request'

// ----------------登录退出-----------------
/**
 * 验证码
 *  @param {array} params 请求参数
 */
export function verify(params) {
  return request({
    url: '/admin/AdminLogin/verify',
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
    url: '/admin/AdminLogin/login',
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
    url: '/admin/AdminLogin/logout',
    method: 'post',
    data
  })
}
