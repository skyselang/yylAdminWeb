import request from '@/utils/request'
// 导出文件
const url = '/admin/file.Export/'
/**
 * 导出文件列表
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
 * 导出文件信息
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
 * 导出文件修改
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
 * 导出文件删除
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
 * 导出文件回收站列表
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
 * 导出文件回收站恢复
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
 * 导出文件回收站删除
 * @param {array} data 请求数据
 */
export function recycleDele(data) {
  return request({
    url: url + 'recycleDele',
    method: 'post',
    data
  })
}
