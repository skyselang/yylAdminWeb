import request from '@/utils/request'
// 登录退出接口
const url = '/admin/system.Login/'

/**
 * 设置
 *  @param {array} params 请求参数
 */
export function settingApi(params) {
  return request({
    url: url + 'setting',
    method: 'get',
    params: params
  })
}

/**
 * 验证码
 *  @param {array} params 请求参数
 */
export function captchaApi(params) {
  return request({
    url: url + 'captcha',
    method: 'get',
    params: params
  })
}

/**
 * 登录
 * @param {array} data 请求数据
 */
export function loginApi(data) {
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
export function logoutApi(data) {
  return request({
    url: url + 'logout',
    method: 'post',
    data
  })
}
