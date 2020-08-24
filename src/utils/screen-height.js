/**
 * 获取屏幕高度
 * @param {number} height 要减去的高度
 * @return {number}
 */
export default function screenHeight(height = 300) {
  var defaultHeight = 900
  var clientHeight = document.documentElement.clientHeight || document.body.clientHeight
  if (clientHeight) {
    return clientHeight - height
  } else {
    return defaultHeight - height
  }
}
