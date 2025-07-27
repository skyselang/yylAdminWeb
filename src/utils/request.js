import axios from 'axios'
import { useSettingsStoreHook } from '@/store/modules/settings'
import { useUserStoreHook } from '@/store/modules/user'
import { useAppStoreHook } from '@/store/modules/app'
import i18n from '@/lang/index'

const settingsStore = useSettingsStoreHook()
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL, // 接口baseURL
  timeout: settingsStore.timeout * 1000, // 请求超时时间
  headers: {},
  params: {},
  data: {}
})

// 请求拦截器
service.interceptors.request.use(
  // 请求配置
  (config) => {
    const appStore = useAppStoreHook()
    const userStore = useUserStoreHook()
    const language = appStore.language
    const tokenValue = userStore.getToken()
    const tokenType = settingsStore.tokenType
    // 设置Token
    if (tokenValue) {
      const tokenName = settingsStore.tokenName
      if (tokenType == 'header') {
        // 请求头部token
        config.headers[tokenName] = tokenValue
      } else {
        // 请求参数token
        if (config.method == 'get') {
          config.params = { ...config?.params, [tokenName]: tokenValue }
        } else {
          config.data = { ...config?.data, [tokenName]: tokenValue }
        }
      }
    }
    // 设置语言
    if (tokenType == 'header') {
      config.headers['think-lang'] = language
    } else {
      config.params.lang = language
    }
    return config
  },
  // 请求错误
  (error) => {
    if (import.meta.env.DEV) {
      console.error(error)
    }
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 响应数据
    const res = response.data
    if (response.data instanceof Blob) {
      // 文件下载
      if (response.data.type == 'application/json') {
        const reader = new FileReader()
        reader.onload = function (event) {
          const jsonString = event.target.result
          const jsonObject = JSON.parse(jsonString)
          responseHandle(jsonObject)
        }
        reader.readAsText(response.data)
      } else {
        const file_name = response.config.params?.file_name || ''
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(response.data)
        if (file_name) {
          link.setAttribute('download', file_name)
        }
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    } else {
      // 返回码200：成功
      if (res.code == 200) {
        return res
      } else {
        responseHandle(res)
        return Promise.reject(res)
      }
    }
  },
  (error) => {
    // 响应错误
    if (error.response) {
      const res = error.response.data
      responseHandle(res)
      if (import.meta.env.DEV) {
        console.error(error)
      }
    } else {
      return Promise.reject(error)
    }
  }
)

// 响应处理
function responseHandle(res) {
  // 返回码401：Token 无效
  if (res.code == 401) {
    ElMessageBox.confirm(res.msg, i18n.global.t('提示'), {
      confirmButtonText: i18n.global.t('重新登录'),
      cancelButtonText: i18n.global.t('取消'),
      type: 'warning',
      center: true
    })
      .then(() => {
        const userStore = useUserStoreHook()
        userStore.resetToken().then(() => {
          location.reload()
        })
      })
      .catch(() => {})
  } else {
    ElMessage({
      message: res.msg || 'Server error',
      type: 'error',
      center: true,
      showClose: true,
      duration: 5000
    })
  }
}

export default service
