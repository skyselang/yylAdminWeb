import request from '@/utils/request'

// ----------------接口管理----------------
/**
 * 接口列表
 * @param {array} params 请求参数
 */
export function apiList() {
  return request({
    url: '/admin/Api/apiList',
    method: 'get'
  })
}
/**
   * 接口信息
   * @param {array} data 请求数据
   */
export function apiInfo(data) {
  return request({
    url: '/admin/Api/apiInfo',
    method: 'get',
    params: data
  })
}
/**
   * 接口添加
   * @param {array} data 请求数据
   */
export function apiAdd(data) {
  return request({
    url: '/admin/Api/apiAdd',
    method: 'post',
    data
  })
}
/**
   * 接口修改
   * @param {array} data 请求数据
   */
export function apiEdit(data, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/Api/apiEdit',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/Api/apiEdit',
      method: 'post',
      data
    })
  }
}
/**
   * 接口删除
   * @param {array} data 请求数据
   */
export function apiDele(data) {
  return request({
    url: '/admin/Api/apiDele',
    method: 'post',
    data
  })
}
/**
   * 接口是否禁用
   * @param {array} data 请求数据
   */
export function apiDisable(data) {
  return request({
    url: '/admin/Api/apiDisable',
    method: 'post',
    data
  })
}
/**
   * 接口是否无需权限
   * @param {array} data 请求数据
   */
export function apiUnauth(data) {
  return request({
    url: '/admin/Api/apiUnauth',
    method: 'post',
    data
  })
}
