import request from '@/utils/request'
// 会员接口接口
const url = '/admin/member.Api/'

/**
 * 会员接口列表
 * @param {array} params 请求参数
 */
export function listApi(params) {
  return request({
    url: url + 'list',
    method: 'get',
    params: params
  })
}

/**
 * 会员接口信息
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
 * 会员接口添加
 * @param {array} data 请求数据
 * @param {string} method get获取数据，post提交添加
 */
export function addApi(data, method = 'post') {
  return request({
    url: url + 'add',
    method: method,
    data
  })
}

/**
 * 会员接口修改
 * @param {array} data 请求数据
 * @param {string} method get获取数据，post提交修改
 */
export function editApi(data, method = 'post') {
  const config = {
    url: url + 'edit',
    method: method
  }
  if (method === 'get') {
    config.params = data
  } else {
    config.data = data
  }
  return request(config)
}

/**
 * 会员接口删除
 * @param {array} data 请求数据
 */
export function deleApi(data) {
  return request({
    url: url + 'dele',
    method: 'post',
    data
  })
}

/**
 * 会员接口是否禁用
 * @param {array} data 请求数据
 */
export function disableApi(data) {
  return request({
    url: url + 'disable',
    method: 'post',
    data
  })
}

/**
 * 会员接口批量操作
 * @param {object} data 请求数据
 */
export function updateApi(data) {
  return request({
    url: url + 'update',
    method: 'post',
    data
  })
}

/**
 * 会员接口导出
 * @param {array} data 请求数据
 * @param {string} method get下载导出文件，post提交导出
 */
export function exportApi(data, method = 'post') {
  if (method === 'get') {
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
 * 会员接口导入
 * @param {array} data 请求数据
 * @param {string} method get下载导入模板，post上传导入文件
 */
export function importApi(data = {}, method = 'post') {
  if (method === 'get') {
    return request({
      url: url + 'import',
      method: 'get',
      params: data,
      responseType: data?.file_path ? 'blob' : 'json'
    })
  }
  return import.meta.env.VITE_APP_BASE_URL + url + 'import'
}

/**
 * 会员接口修改上级
 * @param {array} data 请求数据
 */
export function editPidApi(data) {
  return request({
    url: url + 'editpid',
    method: 'post',
    data
  })
}

/**
 * 会员接口修改免登
 * @param {array} data 请求数据
 */
export function editUnloginApi(data) {
  return request({
    url: url + 'editUnlogin',
    method: 'post',
    data
  })
}

/**
 * 会员接口修改免权
 * @param {array} data 请求数据
 */
export function editUnauthApi(data) {
  return request({
    url: url + 'editUnauth',
    method: 'post',
    data
  })
}

/**
 * 会员接口修改免限
 * @param {array} data 请求数据
 */
export function editUnrateApi(data) {
  return request({
    url: url + 'editUnrate',
    method: 'post',
    data
  })
}

/**
 * 会员接口分组列表
 * @param {array} params 请求参数
 */
export function groupListApi(params) {
  return request({
    url: url + 'groupList',
    method: 'get',
    params: params
  })
}

/**
 * 会员接口分组解除
 * @param {array} data 请求数据
 */
export function groupLiftApi(data) {
  return request({
    url: url + 'groupLift',
    method: 'post',
    data
  })
}
