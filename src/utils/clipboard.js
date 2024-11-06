import { ElMessage } from 'element-plus'
/**
 * 复制文本
 * @param {String} text 文本
 * @param {String} suc_msg 复制成功提示
 * @param {String} err_msg 复制失败提示
 */
export default function handleClipboard(text, suc_msg = '', err_msg = '') {
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
