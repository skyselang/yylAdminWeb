/**
 * 是否外链
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(http?:|https?:|mailto:|tel:)/.test(path)
}
