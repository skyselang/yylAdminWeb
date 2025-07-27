import { useSettingsStoreHook } from '@/store/modules/settings'
import { useTagsViewStoreHook } from '@/store/modules/tagsView'
import { useUserStoreHook } from '@/store/modules/user'
import { useAppStoreHook } from '@/store/modules/app'
import { ElMessage } from 'element-plus'
import settings from '@/settings'
import i18n from '@/lang/index'

/**
 * 生成UUID
 * @return {string}
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 是否外部链接
 * @param {string} path
 * @returns {boolean}
 */
export function isExternal(path) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path)
  return isExternal
}

/**
 * 生成随机字符串
 * @param {number} length 长度
 * @return {string}
 */
export function randomString(length = 12) {
  let string = ''
  const character = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let characterLength = character.length
  for (let index = 0; index < length; index++) {
    string += character[Math.floor(Math.random() * characterLength)]
  }
  return string
}

/**
 * 生成随机字符串（Uint8Array）
 * @param {number} length 长度
 * @return {string}
 */
export function randomBytes(length = 16) {
  const byteArray = new Uint8Array(length / 2)
  window.crypto.getRandomValues(byteArray)
  let hexString = Array.from(byteArray, (byte) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2)
  }).join('')
  const diffLength = length - hexString.length
  if (diffLength > 0) {
    const character = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let characterLength = character.length
    for (let index = 0; index < diffLength; index++) {
      hexString += character[Math.floor(Math.random() * characterLength)]
    }
  }
  return hexString
}

/**
 * 获取数组中某列的值
 * @param {array} array 数组
 * @param {string} column_key 需要返回值的列
 * @return {array}
 */
export function arrayColumn(array, column_key) {
  let column_value = []
  const length = array.length
  for (let index = 0; index < length; index++) {
    column_value.push(array[index][column_key])
  }
  return column_value
}

/**
 * 获取数组中某列的值
 * @param {array} array 数组
 * @param {string} column_key 需要返回值的列
 * @param {string} separator 分隔符
 * @return {string}
 */
export function arrayString(array, column_key, separator = ',') {
  let column_value = []
  const length = array.length
  for (let index = 0; index < length; index++) {
    column_value.push(array[index][column_key])
  }
  return column_value.join(separator)
}

/**
 * 数组转字符串
 * @param {array} array 数组
 * @param {string} separator 分隔符
 * @return {string} eg：1,2,3
 */
export function arrayToString(array, separator = ',') {
  let arr = []
  const arrayLen = array.length
  for (let i = 0; i < arrayLen; i++) {
    const iLen = array[i].length
    if (iLen > 0) {
      for (let j = 0; j < iLen; j++) {
        arr.push(array[i][j])
      }
    } else {
      arr.push(array[i])
    }
  }
  return arr.join(separator)
}

/**
 * 数组转一维数组
 * @param {array} array 数组
 * @return {array} eg：[1,2,3]
 */
export function arrayToArray(array) {
  let arr = []
  const arrayLen = array.length
  for (let i = 0; i < arrayLen; i++) {
    const iLen = array[i].length
    if (iLen > 0) {
      for (let j = 0; j < iLen; j++) {
        arr.push(array[i][j])
      }
    } else {
      arr.push(array[i])
    }
  }
  return arr
}

/**
 * 记住我
 * 传值则设置，不传值则获取
 * @param {boolean} value
 */
export function rememberMe(value = undefined) {
  const settingsStore = useSettingsStoreHook()
  if (value !== undefined) {
    settingsStore.changeSetting({ key: 'rememberMe', value: value })
  }
  return settingsStore.rememberMe
}

/**
 * token方式
 * @returns {string}
 */
export function tokenType() {
  const settingsStore = useSettingsStoreHook()
  return settingsStore.tokenType
}

/**
 * token名称
 * @returns {string}
 */
export function tokenName() {
  const settingsStore = useSettingsStoreHook()
  return settingsStore.tokenName
}

/**
 * token值
 * 传值则设置，不传值则获取
 * 如果记住我为true，则把token保存在localStorage中，
 * 如果记住我为false，则把token保存在sessionStorage中。
 * @param {string} value
 * @returns {string}
 */
export function tokenValue(value = undefined) {
  const settingsStore = useSettingsStoreHook()
  const storePrefix = settings.storePrefix
  const tokenName = settingsStore.tokenName
  const tokenKey = storePrefix + tokenName
  let rememberMe = settingsStore.rememberMe
  if (rememberMe === 'true' || rememberMe === true) {
    rememberMe = true
  } else if (rememberMe === 'false' || rememberMe === false) {
    rememberMe = false
  }
  if (value !== undefined) {
    if (rememberMe) {
      localStorage.setItem(tokenKey, value)
    } else {
      sessionStorage.setItem(tokenKey, value)
      localStorage.removeItem(tokenKey)
    }
  } else {
    if (rememberMe) {
      return localStorage.getItem(tokenKey)
    } else {
      return sessionStorage.getItem(tokenKey)
    }
  }
}

/**
 * 下载文件
 * @param {string} url 链接
 * @param {object} param 参数
 * @return {void|string} 打开下载窗口或返回下载链接
 */
export function download(url, param = {}) {
  const settingsStore = useSettingsStoreHook()
  const userStore = useUserStoreHook()
  const tokenName = settingsStore.tokenName
  const tokenValue = userStore.getToken()
  if (tokenValue) {
    param[tokenName] = tokenValue
  }
  let params = new URLSearchParams()
  for (let key in param) {
    params.append(key, param[key])
  }
  const paramsString = params.toString()
  const downloadUrl = `${url}?${paramsString}`
  const handle = window.open(downloadUrl, '_self')
  if (!handle) {
    return downloadUrl
  }
}

/**
 * 复制文本
 * @param {string} text 文本
 * @param {string} suc_msg 成功提示
 * @param {string} err_msg 失败提示
 */
export function clipboard(text, suc_msg = '', err_msg = '') {
  const { t } = i18n.global
  try {
    navigator.clipboard.writeText(text)
    ElMessage({
      message: suc_msg || t('复制成功'),
      type: 'success',
      duration: 1500
    })
  } catch (e) {
    ElMessage({
      message: err_msg || t('复制失败'),
      type: 'error'
    })
  }
}

/**
 * 获取当前日期时间
 * @param {string} date_separator 日期分隔符
 * @param {string} time_separator 时间分隔符
 * @param {string} date_time_separator 日期时间分隔符
 * @return {string} eg：2024-10-17 14:12:00
 */
export function datetime(date_separator = '-', time_separator = ':', date_time_separator = ' ') {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const formattedDate = `${year}${date_separator}${month}${date_separator}${day}`
  const formattedTime = `${hours}${time_separator}${minutes}${time_separator}${seconds}`
  const formattedDateTime = `${formattedDate}${date_time_separator}${formattedTime}`
  return formattedDateTime
}

/**
 * 当前前后日期时间
 * @param {number} number 数量
 * @param {string} type 类型：year、month、day
 * @param {boolean} time 是否包含时间
 * @return {string} eg：2025-04-15 16:20:00
 */
export function dateBeforeAfter(number = 1, type = 'year', time = true) {
  const now = new Date()
  const newDate = new Date(now)

  switch (type) {
    case 'year':
      newDate.setFullYear(newDate.getFullYear() + number)
      break
    case 'month':
      newDate.setMonth(newDate.getMonth() + number)
      break
    case 'day':
      newDate.setDate(newDate.getDate() + number)
      break
    default:
      throw new Error('Invalid type. Use "year", "month", or "day".')
  }

  const year = newDate.getFullYear()
  const month = String(newDate.getMonth() + 1).padStart(2, '0')
  const day = String(newDate.getDate()).padStart(2, '0')

  if (time) {
    const hours = String(newDate.getHours()).padStart(2, '0')
    const minutes = String(newDate.getMinutes()).padStart(2, '0')
    const seconds = String(newDate.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  return `${year}-${month}-${day}`
}

/**
 * 获取屏幕高度
 * @param {number} height 要减去的高度 300
 * @return {number}
 */
export function screenHeight(height = 300) {
  const tagsViewStore = useTagsViewStoreHook
  const tagsView = tagsViewStore.tagsView
  if (!tagsView) {
    height -= 37
  }
  let defaultHeight = 880
  let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
  if (clientHeight) {
    return clientHeight - height
  } else {
    return defaultHeight - height
  }
}

/**
 * 验证权限
 * @param {array} value
 * @returns {boolean}
 */
export function hasPerm(value) {
  if (value && value instanceof Array && value.length > 0) {
    const userStore = useUserStoreHook()
    const userRoles = userStore.user.roles
    const permissionRoles = value
    const permissionHas = userRoles.some((role) => {
      return permissionRoles.includes(role)
    })
    return permissionHas
  } else {
    return false
  }
}

/**
 * 变量是否为空：undefined、null、空字符串、空数组，空对象
 * @param {any} variable
 * @returns {boolean}
 */
export function isEmpty(variable) {
  if (variable === undefined || variable === null) {
    return true
  }
  if (typeof variable === 'string' && variable.trim() === '') {
    return true
  }
  if (Array.isArray(variable) && variable.length === 0) {
    return true
  }
  if (variable && typeof variable === 'object' && Object.keys(variable).length === 0) {
    return true
  }
  if (variable && typeof variable === 'object' && Object.values(variable).length === 0) {
    return true
  }
  return false
}

/**
 * 关闭标签页
 * @param {object} route 路由
 */
export function closeTagsView(route) {
  const tagsViewStore = useTagsViewStoreHook()
  tagsViewStore.closeView(route)
}

/**
 * 添加修改成功弹窗
 * @param {string|number} id id
 * @param {string} name 名称
 * @param {object} route 路由
 */
export function addEditSuccessAlert(id, name, route) {
  const { t } = i18n.global
  let title = t('添加', { name: name })
  let message = t('添加成功', { name: name })
  if (id) {
    title = t('修改', { name: name })
    message = t('修改成功', { name: name })
  }
  ElMessageBox.alert(message, title, {
    type: 'success',
    center: true,
    draggable: true,
    showCancelButton: true,
    cancelButtonText: t('关闭页面'),
    confirmButtonText: id ? t('继续修改') : t('继续添加'),
    distinguishCancelAndClose: true
  })
    .then(() => {})
    .catch((action) => {
      if (action === 'cancel') {
        closeTagsView(route)
      }
    })
}

/**
 * 添加修改是否弹窗方式，true对话框弹窗，false新标签页面
 * @param {boolean} addEditDialog
 * @returns {boolean}
 */
export function getAddEditDialog(addEditDialog = null) {
  if (addEditDialog !== null) {
    return addEditDialog
  }
  const settingsStore = useSettingsStoreHook()
  return settingsStore.addEditDialog
}

/**
 * 获取分页每页数量
 * @param {number} limit
 * @returns {number}
 */
export function getPageLimit(limit = '') {
  if (limit !== '') {
    return limit
  }
  const settingsStore = useSettingsStoreHook()
  return settingsStore.pageLimit
}

/**
 * 获取页面标题
 * @param {string} pageName 页面名称
 * @returns {string}
 */
export function getPageTitle(pageName) {
  const settingsStore = useSettingsStoreHook()
  const pageTitle = settingsStore.pageTitle
  if (pageName) {
    if (pageTitle) {
      return `${pageName} - ${pageTitle}`
    }
    return `${pageName}`
  }
  return `${pageTitle}`
}

/**
 * 获取请求超时时间（秒）
 * @returns {number}
 */
export function getTimeout() {
  const settingsStore = useSettingsStoreHook()
  return settingsStore.timeout
}

/**
 * 上传请求参数：token，lang
 * @returns {object}
 */
export function uploadData() {
  let data = {}
  const settingsStore = useSettingsStoreHook()
  const userStore = useUserStoreHook()
  const appStore = useAppStoreHook()
  const tokenType = settingsStore.tokenType
  const tokenName = settingsStore.tokenName
  const tokenValue = userStore.getToken()
  const language = appStore.language
  data[tokenName] = tokenValue
  if (tokenType === 'header') {
    data['think-lang'] = language
  } else {
    data['lang'] = language
  }
  return data
}

/**
 * 路由国际化
 * @param {string} title
 * @returns {string}
 */
export function translateRouteTitle(title) {
  const hasKey = i18n.global.te(title)
  if (hasKey) {
    return i18n.global.t(title)
  } else if (title && title.includes('修改:')) {
    const titleArr = title.split(':')
    const name = titleArr[0]
    const hasKey = i18n.global.te(name)
    if (hasKey) {
      const id = titleArr[1]
      const title = i18n.global.t(name)
      return title + ':' + id
    }
  }
  return title
}

/**
 * 获取路由及其子路由中的所有权限
 * @param {Object} route - 路由对象
 * @param {Object} [route.meta] - 路由元信息
 * @param {Array} [route.meta.roles] - 路由权限数组
 * @param {Array} [route.children] - 子路由数组
 * @returns {Array} 返回路由树中所有权限的集合
 */
export function getRouteRoles(route) {
  let roles = []
  let queue = [route]
  let level = 0
  let maxLevel = route.children.length
  while (queue.length > 0 && level <= maxLevel) {
    const node = queue.shift()
    if (node.meta?.roles) {
      roles.push(...node.meta.roles)
    }
    if (node.children && node.children.length > 0) {
      queue.push(...node.children)
    }
    level++
  }

  return roles
}

/**
 * 设置公告数量
 * @param {number} notice
 */
export function setNotice(notice) {
  const settingsStore = useSettingsStoreHook()
  settingsStore.changeSetting({ key: 'notice', value: notice })
}

/**
 * 获取公告数量
 * @returns {number}
 */
export function getNotice() {
  const settingsStore = useSettingsStoreHook()
  return settingsStore.notice
}

/**
 * 删除公告数量
 */
export function delNotice() {
  const settingsStore = useSettingsStoreHook()
  settingsStore.changeSetting({ key: 'notice', value: 0 })
}

/**
 * 获取默认设置
 * @returns {Object} 返回默认设置对象
 */
export function defaultSettings() {
  return settings
}

/**
 * localStorage 清除
 * @param {Array} exclude 排除的键
 */
export function localStorageClear(exclude = []) {
  const settingsStore = useSettingsStoreHook()
  const prefix = settings.storePrefix
  const tokenName = settingsStore.tokenName
  exclude.push(tokenName, 'rememberMe', 'language')
  exclude = exclude.map((key) => prefix + key)
  const keys = Object.keys(localStorage)
  keys.forEach((key) => {
    if (!exclude.includes(key)) {
      localStorage.removeItem(key)
    }
  })
}

/**
 * 多语言宽度
 * @param {number} zhcnWidth 中文宽度
 * @param {number} enWidth 英文宽度
 * @returns {number}
 */
export function langWidth(zhcnWidth, enWidth) {
  const appStore = useAppStoreHook()
  const language = appStore.language
  if (language === 'zh-cn') {
    return zhcnWidth
  } else if (language === 'en') {
    return enWidth
  } else {
    return zhcnWidth
  }
}
