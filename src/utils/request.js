import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, getAdminUserId } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url=基本url+请求url
  // withCredentials: true, // 跨域请求时发送Cookie
  timeout: 60000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      // 让每个请求头部带上token、userid
      // AdminToken、AdminUserId是自定义键名，可根据实际情况修改
      config.headers['AdminToken'] = getToken()
      config.headers['AdminUserId'] = getAdminUserId()
    }
    return config
  },
  error => {
    // 对请求错误做些什么
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
    // 对响应数据做点什么
    const res = response.data

    // 如果返回码不是200，则判断为错误
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 返回码401:token无效
      if (res.code === 401) {
        // 重新登录
        MessageBox.confirm(res.msg, '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // 对响应错误做点什么
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
