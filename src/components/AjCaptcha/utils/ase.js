import CryptoJS from 'crypto-js'
/**
 * @description 加密
 * @param {string} word 要加密的内容
 * @param {string} keyWord 关键字
 * @return {string} 加密后的内容
 */
export function aesEncrypt(word, keyWord = '61fM5tBkr0fZhFT2') {
  var key = CryptoJS.enc.Utf8.parse(keyWord)
  var srcs = CryptoJS.enc.Utf8.parse(word)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
