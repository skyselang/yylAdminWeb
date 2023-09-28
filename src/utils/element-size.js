/**
 * element-ui size
 * @param {string} value
 * @returns {string|array}
 */
export function elementSize(value = '') {
  const sizes = [
    { label: '默认', value: 'default', size: '40px' },
    { label: '中', value: 'medium', size: '36px' },
    { label: '小', value: 'small', size: '32px' },
    { label: '迷你', value: 'mini', size: '28px' }
  ]

  if (value) {
    const sizeLength = sizes.length
    for (let index = 0; index < sizeLength; index++) {
      if (sizes[index].value === value) {
        return sizes[index].size
      }
    }
    return '36px'
  } else {
    return sizes
  }
}
