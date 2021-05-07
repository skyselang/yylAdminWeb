import request from '@/utils/request'

// ----------------接口文档----------------
/**
 * 接口文档
 * @param {array} params 请求参数
 */
export function apidoc(params) {
  return request({
    url: '/admin/AdminApidoc/apidoc',
    method: 'get',
    params: params
  })
}
