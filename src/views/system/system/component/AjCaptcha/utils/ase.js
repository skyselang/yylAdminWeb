import CryptoJS from 'crypto-js'
/**
 * @description 加密
 * @param {string} word 要加密的内容
 * @param {string} keyWord 关键字
 * @return {string} 加密后的内容
 */
export function aesEncrypt(word, keyWord = 'K9TI4m1x6x3E2l8F') {
  let key = CryptoJS.enc.Utf8.parse(keyWord)
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
