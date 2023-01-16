import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess(suc_msg = '') {
  Vue.prototype.$message({
    message: suc_msg || '复制成功',
    type: 'success',
    duration: 1500
  })
}

function clipboardError(err_msg) {
  Vue.prototype.$message({
    message: err_msg || '复制失败',
    type: 'error'
  })
}

export default function handleClipboard(text, event, suc_msg = '', err_msg = '') {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(suc_msg)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(err_msg)
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
