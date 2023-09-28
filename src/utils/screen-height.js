import store from '@/store'
/**
 * 获取屏幕高度
 * @param {number} height 要减去的高度 260
 * @return {number}
 */
export default function screenHeight(height = 260) {
  const tagsView = store.getters && store.getters.tagsView
  if (!tagsView) {
    height -= 37
  }
  var defaultHeight = 880
  var clientHeight = document.documentElement.clientHeight || document.body.clientHeight
  if (clientHeight) {
    return clientHeight - height
  } else {
    return defaultHeight - height
  }
}
