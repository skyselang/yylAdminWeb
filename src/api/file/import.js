import request from '@/utils/request'
// 导入文件接口
const url = '/admin/file.Import/'

/**
 * 导入文件列表
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
 * 导入文件信息
 * @param {array} params 请求参数
 * @param {boolean} is_down 是否下载文件
 */
export function infoApi(params, is_down = false) {
  let config = {
    url: url + 'info',
    method: 'get',
    params: params
  }
  if (is_down) {
    config.params.is_down = 1
    config.responseType = 'blob'
  }
  return request(config)
}

/**
 * 导入文件添加
 * @param {array} data 请求数据
 * @param {string} method get获取数据，post提交添加
 */
export function addApi(data, method = 'post') {
  const config = {
    url: url + 'add',
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
 * 导入文件修改
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
 * 导入文件删除
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
 * 导入文件是否禁用
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
 * 导入文件批量操作
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
 * 导入文件导入
 * @param {array} data 请求数据
 * @param {string} method get下载导入文件，post提交导入
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
 * 导入文件导入
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
 * 导入文件回收站列表
 * @param {array} data 请求参数
 */
export function recycleListApi(params) {
  return request({
    url: url + 'recycleList',
    method: 'get',
    params: params
  })
}

/**
 * 导入文件回收站恢复
 * @param {array} data 请求数据
 */
export function recycleRecoApi(data) {
  return request({
    url: url + 'recycleReco',
    method: 'post',
    data
  })
}

/**
 * 导入文件回收站删除
 * @param {array} data 请求数据
 */
export function recycleDeleApi(data) {
  return request({
    url: url + 'recycleDele',
    method: 'post',
    data
  })
}
