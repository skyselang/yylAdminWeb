import request from '@/utils/request'
// 接口文档接口
const url = '/admin/system.Apidoc/'

/**
 * 接口文档
 * @param {array} params 请求参数
 */
export function apidocApi(params) {
  return request({
    url: url + 'apidoc',
    method: 'get',
    params: params
  })
}
