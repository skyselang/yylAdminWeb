/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @return {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 生成UUID
 * @return {string}
 */
export function uuid() {
  var url = URL.createObjectURL(new Blob())
  var uuid = url.toString()
  URL.revokeObjectURL(url)
  return uuid.substr(uuid.lastIndexOf('/') + 1)
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
