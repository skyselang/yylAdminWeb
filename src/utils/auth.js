import Cookies from 'js-cookie'
const keyPrefix = 'yaAuth'

const adminTokenKey = keyPrefix + 'AdminToken'
export function setAdminToken(adminToken) {
  return Cookies.set(adminTokenKey, adminToken)
}
export function getAdminToken() {
  return Cookies.get(adminTokenKey)
}
export function delAdminToken() {
  return Cookies.remove(adminTokenKey)
}

const usernameKey = keyPrefix + 'Username'
export function setUsername(username) {
  return Cookies.set(usernameKey, username)
}
export function getUsername() {
  return Cookies.get(usernameKey)
}
export function delUsername() {
  return Cookies.remove(usernameKey)
}

const nicknameKey = keyPrefix + 'Nickname'
export function setNickname(nickname) {
  return Cookies.set(nicknameKey, nickname)
}
export function getNickname() {
  return Cookies.get(nicknameKey)
}
export function delNickname() {
  return Cookies.remove(nicknameKey)
}

const avatarKey = keyPrefix + 'AvatarUrl'
export function setAvatar(avatar) {
  return Cookies.set(avatarKey, avatar)
}
export function getAvatar() {
  return Cookies.get(avatarKey)
}
export function delAvatar() {
  return Cookies.remove(avatarKey)
}
