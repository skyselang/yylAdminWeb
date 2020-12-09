import request from '@/utils/request'

// ----------------会员管理----------------
/**
 * 会员列表
 * @param {array} params 请求参数
 */
export function memberList(params) {
  return request({
    url: '/admin/Member/memberList',
    method: 'get',
    params: params
  })
}
/**
   * 会员信息
   * @param {array} params 请求参数
   */
export function memberInfo(params) {
  return request({
    url: '/admin/Member/memberInfo',
    method: 'get',
    params: params
  })
}
/**
   * 会员添加
   * @param {array} data 请求数据
   */
export function memberAdd(data) {
  return request({
    url: '/admin/Member/memberAdd',
    method: 'post',
    data
  })
}
/**
   * 会员修改
   * @param {array} data 请求数据
   */
export function memberEdit(data) {
  return request({
    url: '/admin/Member/memberEdit',
    method: 'post',
    data
  })
}
/**
   * 会员删除
   * @param {array} data 请求数据
   */
export function memberDele(data) {
  return request({
    url: '/admin/Member/memberDele',
    method: 'post',
    data
  })
}
/**
   * 会员密码重置
   * @param {array} data 请求数据
   */
export function memberPassword(data) {
  return request({
    url: '/admin/Member/memberPassword',
    method: 'post',
    data
  })
}
/**
   * 会员是否禁用
   * @param {array} data 请求数据
   */
export function memberDisable(data) {
  return request({
    url: '/admin/Member/memberDisable',
    method: 'post',
    data
  })
}
