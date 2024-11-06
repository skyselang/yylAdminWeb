const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2
  if (t < 1) {
    return (c / 2) * t * t + b
  }
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

const requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
})()

/**
 * 因为很难检测到滚动元素，只需将它们全部移动即可
 * @param {number} amount
 */
const move = (amount) => {
  document.documentElement.scrollTop = amount
  document.body.parentNode.scrollTop = amount
  document.body.scrollTop = amount
}

const position = () => {
  return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop
}

/**
 * @param {number} to
 * @param {number} duration
 * @param {Function} callback
 */
export const scrollTo = (to, duration, callback) => {
  const start = position()
  const change = to - start
  const increment = 20
  let currentTime = 0
  duration = typeof duration === 'undefined' ? 500 : duration
  const animateScroll = function () {
    // 增加时间
    currentTime += increment
    // 用二次型出入缓和函数求值
    const val = easeInOutQuad(currentTime, start, change, duration)
    // 移动 document.body
    move(val)
    // 做动画，除非它结束
    if (currentTime < duration) {
      requestAnimFrame(animateScroll)
    } else {
      if (callback && typeof callback === 'function') {
        // 动画已经完成，所以让回调
        callback()
      }
    }
  }
  animateScroll()
}
