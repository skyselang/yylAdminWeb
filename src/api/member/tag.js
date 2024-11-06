import request from '@/utils/request'
// 会员标签
const url = '/admin/member.Tag/'
/**
 * 会员标签列表
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
 * 会员标签信息
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
 * 会员标签添加
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
 * 会员标签修改
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
 * 会员标签删除
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
 * 会员标签是否禁用
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
 * 会员标签导入
 * @param {array} data 请求数据
 * @param {string} method get下载导入模板，post上传导入文件
 */
export function imports(data = {}, method = 'post') {
  if (method == 'get') {
    return request({
      url: url + 'import',
      method: 'get',
      params: data,
      responseType: 'blob'
    })
  }
  return import.meta.env.VITE_APP_BASE_URL + url + 'import'
}
/**
 * 会员标签导出
 * @param {array} data 请求数据
 * @param {string} method get下载导出文件，post提交导出
 */
export function exports(data, method = 'post') {
  if (method == 'get') {
    return request({
      url: url + 'export',
      method: 'get',
      params: data,
      responseType: 'blob'
    })
  }
  return request({
    url: url + 'export',
    method: 'post',
    data
  })
}
/**
 * 会员标签会员列表
 * @param {array} params 请求参数
 */
export function memberList(params) {
  return request({
    url: url + 'memberList',
    method: 'get',
    params: params
  })
}
/**
 * 会员标签会员解除
 * @param {array} data 请求数据
 */
export function memberRemove(data) {
  return request({
    url: url + 'memberRemove',
    method: 'post',
    data
  })
}
