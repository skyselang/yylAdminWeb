import request from '@/utils/request'

// ----------------内容设置----------------
/**
 * 内容设置信息
 * @param {array} params 请求数据
 */
export function info(params) {
  return request({
    url: '/admin/CmsSetting/info',
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
    url: '/admin/CmsSetting/edit',
    method: 'post',
    data
  })
}
