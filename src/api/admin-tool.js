import request from '@/utils/request'
// 实用工具

/**
 * 生成随机字符
 * @param {array} data 参数
 */
export function randomStr(data) {
  return request({
    url: '/admin/AdminTool/randomStr',
    method: 'post',
    data
  })
}

/**
 * 时间戳转换
 * @param {array} data 参数
 */
export function timestamp(data) {
  return request({
    url: '/admin/AdminTool/timestamp',
    method: 'post',
    data
  })
}

/**
 * md5加密
 * @param {array} data 参数
 */
export function md5Enc(data) {
  return request({
    url: '/admin/AdminTool/md5Enc',
    method: 'post',
    data
  })
}

/**
 * 生成二维码
 * @param {array} data 参数
 */
export function Qrcode(data) {
  return request({
    url: '/admin/AdminTool/qrcode',
    method: 'post',
    data
  })
}
