import request from '@/utils/request'

// ----------------设置-------------------
/**
 * 验证码设置
 * @param {array} data 请求数据
 */
export function settingVerify(data) {
  if (data) {
    return request({
      url: '/admin/Setting/settingVerify',
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/admin/Setting/settingVerify',
      method: 'get'
    })
  }
}
/**
 * Token设置
 * @param {array} data 请求数据
 */
export function settingToken(data) {
  if (data) {
    return request({
      url: '/admin/Setting/settingToken',
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/admin/Setting/settingToken',
      method: 'get'
    })
  }
}
