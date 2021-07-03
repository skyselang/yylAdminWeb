import request from '@/utils/request'

// ----------------内容管理----------------
/**
 * 内容设置信息
 * @param {array} params 请求数据
 */
export function cmsInfo(params) {
  return request({
    url: '/admin/SettingCms/cmsInfo',
    method: 'get',
    params: params
  })
}
/**
 * 内容设置修改
 * @param {array} data 请求数据
 */
export function cmsEdit(data) {
  return request({
    url: '/admin/SettingCms/cmsEdit',
    method: 'post',
    data
  })
}
