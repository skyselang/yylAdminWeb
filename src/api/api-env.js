import request from '@/utils/request'

// ----------------接口环境----------------
/**
 * 接口环境列表
 * @param {array} params 请求参数
 */
export function apiEnvList(params) {
  return request({
    url: '/admin/ApiEnv/apiEnvList',
    method: 'get',
    params: params
  })
}
/**
 * 接口环境信息
 * @param {array} data 请求数据
 */
export function apiEnvInfo(data) {
  return request({
    url: '/admin/ApiEnv/apiEnvInfo',
    method: 'get',
    params: data
  })
}
/**
 * 接口环境添加
 * @param {array} data 请求数据
 */
export function apiEnvAdd(data) {
  return request({
    url: '/admin/ApiEnv/apiEnvAdd',
    method: 'post',
    data
  })
}
/**
 * 接口环境修改
 * @param {array} data 请求数据
 */
export function apiEnvEdit(data, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/ApiEnv/apiEnvEdit',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/ApiEnv/apiEnvEdit',
      method: 'post',
      data
    })
  }
}
/**
 * 接口环境删除
 * @param {array} data 请求数据
 */
export function apiEnvDele(data) {
  return request({
    url: '/admin/ApiEnv/apiEnvDele',
    method: 'post',
    data
  })
}
