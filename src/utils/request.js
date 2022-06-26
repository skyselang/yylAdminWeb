import axios from 'axios'
import store from '@/store'
import { Message, MessageBox } from 'element-ui'
import { getAdminToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // 接口baseURL
  // withCredentials: true, // 跨域请求时发送 Cookie
  timeout: 60000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 发送请求之前
    if (store.getters.adminToken) {
      // 设置Token，请求头部header或请求参数param
      const tokenType = process.env.VUE_APP_TOKEN_TYPE || 'header'
      const tokenName = process.env.VUE_APP_TOKEN_NAME || 'AdminToken'
      const tokenValue = getAdminToken()
      if (tokenType === 'header') {
        // 请求头部token
        config.headers[tokenName] = tokenValue
      } else {
        // 请求参数token
        if (config.method === 'post') {
          config.data = { ...config.data, [tokenName]: tokenValue }
        } else if (config.method === 'get') {
          config.params = { ...config.params, [tokenName]: tokenValue }
        }
      }
    }
    return config
  },
  error => {
    // 请求错误
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 通过接口返回码确定返回状态
   * 还可以通过HTTP状态代码来判断请求状态
   */
  response => {
    if (response.data && response.config.responseType === 'blob') {
      // 文件下载
      return response.data
    } else {
      // 响应数据
      const res = response.data
      // 返回码200：成功
      if (res.code === 200) {
        return res
      } else {
        // 返回码401：AdminToken 无效
        if (res.code === 401) {
          MessageBox.confirm(res.msg, '提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetAdminToken').then(() => {
              location.reload()
            })
          }).catch(() => { })
        } else {
          Message({
            showClose: true,
            message: res.msg || 'Server error',
            type: 'error',
            duration: 5000
          })
        }
        return Promise.reject(new Error(res.msg || 'Server error'))
      }
    }
  },
  error => {
    // 响应错误
    const res = error.response.data
    if (res.code === 401) {
      MessageBox.confirm(res.message, '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetAdminToken').then(() => {
          location.reload()
        })
      }).catch(() => { })
    } else {
      Message({
        showClose: true,
        message: res.message || error.message,
        type: 'error',
        duration: 5000
      })
    }
    if (process.env.NODE_ENV === 'development') {
      console.log(error.response)
    }
    return Promise.reject(error)
  }
)

export default service
