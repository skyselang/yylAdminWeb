import clipboard from 'clipboardy'
import { ElMessage } from 'element-plus'

function clipboardSuccess(suc_msg) {
  ElMessage({
    message: suc_msg || '复制成功',
    type: 'success',
    duration: 1500
  })
}

function clipboardError(err_msg) {
  ElMessage({
    message: err_msg || '复制失败',
    type: 'error'
  })
}

/**
 * 复制
 * @param {String} text
 * @param {String} suc_msg
 * @param {String} err_msg
 */
export default function handleClipboard(text, suc_msg = '', err_msg = '') {
  try {
    clipboard.write(text)
    clipboardSuccess(suc_msg)
  } catch (e) {
    clipboardError(err_msg)
  }
}
