import request from '@/utils/request'
// 个人中心接口
const url = '/admin/system.UserCenter/'

/**
 * 我的信息
 * @param {array} params 请求参数
 */
export function infoApi(params) {
  return request({
    url: url + 'info',
    method: 'get',
    params: params
  })
}

/**
 * 修改信息
 * @param {array} data 请求数据
 */
export function editApi(data) {
  return request({
    url: url + 'edit',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param {array} data 请求数据
 */
export function pwdApi(data) {
  return request({
    url: url + 'pwd',
    method: 'post',
    data
  })
}

/**
 * 我的日志
 * @param {array} params 请求参数
 */
export function logListApi(params) {
  return request({
    url: url + 'logList',
    method: 'get',
    params: params
  })
}

/**
 * 我的日志详情
 * @param {array} params 请求参数
 */
export function logInfoApi(params) {
  return request({
    url: url + 'logInfo',
    method: 'get',
    params: params
  })
}

/**
 * 我的日志删除
 * @param {array} data 请求数据
 */
export function logDeleApi(data) {
  return request({
    url: url + 'logDele',
    method: 'POST',
    data
  })
}

/**
 * 我的日志清空
 * @param {array} data 请求数据
 */
export function logClearApi(data) {
  return request({
    url: url + 'logClear',
    method: 'post',
    data
  })
}

/**
 * 我的消息列表
 * @param {array} params 请求参数
 */
export function messageListApi(params) {
  return request({
    url: url + 'messageList',
    method: 'get',
    params: params
  })
}

/**
 * 我的消息详情
 * @param {array} params 请求参数
 */
export function messageInfoApi(params) {
  return request({
    url: url + 'messageInfo',
    method: 'get',
    params: params
  })
}

/**
 * 我的消息删除
 * @param {array} data 请求数据
 */
export function messageDeleApi(data) {
  return request({
    url: url + 'messageDele',
    method: 'POST',
    data
  })
}

/**
 * 我的消息已读
 * @param {array} data 请求数据
 */
export function messageReadApi(data) {
  return request({
    url: url + 'messageRead',
    method: 'post',
    data
  })
}
