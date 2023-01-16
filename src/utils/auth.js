import Cookies from 'js-cookie'
const key_prefix = 'yaAuth'

const UserTokenKey = key_prefix + 'UserToken'
export function setUserToken(UserToken) {
  return Cookies.set(UserTokenKey, UserToken)
}
export function getUserToken() {
  return Cookies.get(UserTokenKey)
}
export function delUserToken() {
  return Cookies.remove(UserTokenKey)
}

const UsernameKey = key_prefix + 'Username'
export function setUsername(username) {
  return Cookies.set(UsernameKey, username)
}
export function getUsername() {
  return Cookies.get(UsernameKey)
}
export function delUsername() {
  return Cookies.remove(UsernameKey)
}

const NicknameKey = key_prefix + 'Nickname'
export function setNickname(nickname) {
  return Cookies.set(NicknameKey, nickname)
}
export function getNickname() {
  return Cookies.get(NicknameKey)
}
export function delNickname() {
  return Cookies.remove(NicknameKey)
}

const AvatarKey = key_prefix + 'Avatar'
export function setAvatar(avatar) {
  return Cookies.set(AvatarKey, avatar)
}
export function getAvatar() {
  return Cookies.get(AvatarKey)
}
export function delAvatar() {
  return Cookies.remove(AvatarKey)
}
