import request from '@/utils/request'

// ----------------地区管理----------------
/**
 * 地区列表
 * @param {array} params 请求参数
 */
export function regionList(params) {
  return request({
    url: '/admin/Region/regionList',
    method: 'get',
    params: params
  })
}
/**
 * 地区信息
 * @param {array} params 请求参数
 */
export function regionInfo(params) {
  return request({
    url: '/admin/Region/regionInfo',
    method: 'get',
    params: params
  })
}
/**
 * 地区添加
 * @param {array} data 请求数据
 */
export function regionAdd(data, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/Region/regionAdd',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/Region/regionAdd',
      method: 'post',
      data
    })
  }
}
/**
 * 地区修改
 * @param {array} data 请求数据
 */
export function regionEdit(data, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/Region/regionEdit',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/Region/regionEdit',
      method: 'post',
      data
    })
  }
}
/**
 * 地区删除
 * @param {array} data 请求数据
 */
export function regionDele(data) {
  return request({
    url: '/admin/Region/regionDele',
    method: 'post',
    data
  })
}
