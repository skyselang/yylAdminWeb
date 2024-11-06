import request from '@/utils/request'
// 文件管理
const url = '/admin/file.File/'
/**
 * 文件列表
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
 * 文件信息
 * @param {array} params 请求参数
 * @param {boolean} is_down 是否下载文件
 */
export function info(params, is_down = false) {
  let config = {
    url: url + 'info',
    method: 'get',
    params: params
  }
  if (is_down) {
    config.responseType = 'blob'
  }
  return request(config)
}
/**
 * 文件上传、添加
 * @param {array} data 请求数据
 * @param {string} type upl上传，url添加
 */
export function add(data, type = 'upl') {
  if (type === 'url') {
    return request({
      url: url + 'add',
      method: 'post',
      data
    })
  } else {
    return import.meta.env.VITE_APP_BASE_URL + url + 'add'
  }
}
/**
 * 文件修改
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
 * 文件删除
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
 * 文件修改分组
 * @param {array} data 请求数据
 */
export function editgroup(data) {
  return request({
    url: url + 'editgroup',
    method: 'post',
    data
  })
}
/**
 * 文件修改标签
 * @param {array} data 请求数据
 */
export function edittag(data) {
  return request({
    url: url + 'edittag',
    method: 'post',
    data
  })
}
/**
 * 文件修改类型
 * @param {array} data 请求数据
 */
export function edittype(data) {
  return request({
    url: url + 'edittype',
    method: 'post',
    data
  })
}
/**
 * 文件修改域名
 * @param {array} data 请求数据
 */
export function editdomain(data) {
  return request({
    url: url + 'editdomain',
    method: 'post',
    data
  })
}
/**
 * 文件是否禁用
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
 * 文件导出
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
 * 文件回收站列表
 * @param {array} data 请求参数
 */
export function recycleList(params) {
  return request({
    url: url + 'recycleList',
    method: 'get',
    params: params
  })
}
/**
 * 文件回收站恢复
 * @param {array} data 请求数据
 */
export function recycleReco(data) {
  return request({
    url: url + 'recycleReco',
    method: 'post',
    data
  })
}
/**
 * 文件回收站删除
 * @param {array} data 请求数据
 */
export function recycleDele(data) {
  return request({
    url: url + 'recycleDele',
    method: 'post',
    data
  })
}
