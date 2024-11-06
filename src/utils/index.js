import { useSettingsStoreHook } from '@/store/modules/settings'
import { useUserStoreHook } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

/**
 * 检查元素是否有类
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * 将类添加到元素
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 从元素中删除类
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 是否外部链接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path)
  return isExternal
}

/**
 * 生成UUID
 * @return {string}
 */
export function uuid() {
  var url = URL.createObjectURL(new Blob())
  var uuid = url.toString()
  URL.revokeObjectURL(url)
  return uuid.substring(uuid.lastIndexOf('/') + 1)
}

/**
 * 生成随机字符串
 * @param {number} length 长度
 * @return {string}
 */
export function randomString(length = 12) {
  var string = ''
  const character = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let index = 0; index < length; index++) {
    string += character[Math.floor(Math.random() * character.length)]
  }
  return string
}

/**
 * 获取数组中某列的值
 * @param {array} array 数组
 * @param {string} column_key 需要返回值的列
 * @return {array}
 */
export function arrayColumn(array, column_key) {
  var column_value = []
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
  var column_value = []
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
  var arr = []
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
  var arr = []
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
 * token名称
 * @returns {string}
 */
export function tokenName() {
  const settingsStore = useSettingsStoreHook()
  return settingsStore.tokenName
}

/**
 * token值
 * @returns {string}
 */
export function tokenValue() {
  const userStore = useUserStoreHook()
  return userStore.token
}

/**
 * 下载文件
 * @param {string} url 链接
 * @param {object} param 参数
 * @return {void|string} 打开下载窗口或返回下载链接
 */
export function downloadFile(url, param = {}) {
  const settingsStore = useSettingsStoreHook()
  const userStore = useUserStoreHook()
  const tokenName = settingsStore.tokenName
  const tokenValue = userStore.token
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
  try {
    navigator.clipboard.writeText(text)
    ElMessage({
      message: suc_msg || '复制成功',
      type: 'success',
      duration: 1500
    })
  } catch (e) {
    ElMessage({
      message: err_msg || '复制失败',
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
