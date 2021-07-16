import request from '@/utils/request'
const url = '/admin/cms.Setting/'
// ----------------内容设置----------------
/**
 * 内容设置信息
 * @param {array} params 请求数据
 */
export function info(params) {
  return request({
    url: url + 'info',
    method: 'get',
    params: params
  })
}
/**
 * 内容设置修改
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
 * 内容设置上传
 */
export function upload() {
  return process.env.VUE_APP_BASE_API + url + 'upload'
}
