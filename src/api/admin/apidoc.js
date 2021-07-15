import request from '@/utils/request'
const url = '/admin/admin.Apidoc/'
// ----------------接口文档----------------
/**
 * 接口文档
 * @param {array} params 请求参数
 */
export function apidoc(params) {
  return request({
    url: url + 'apidoc',
    method: 'get',
    params: params
  })
}
