import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function delToken() {
  return Cookies.remove(TokenKey)
}

const AdminUserIdKey = 'Admin-User-Id'
export function getAdminUserId() {
  return Cookies.get(AdminUserIdKey)
}
export function setAdminUserId(AdminUserId) {
  return Cookies.set(AdminUserIdKey, AdminUserId)
}
export function delAdminUserId() {
  return Cookies.remove(AdminUserIdKey)
}

const NicknameKey = 'Admin-Nickname'
export function getNickname() {
  return Cookies.get(NicknameKey)
}
export function setNickname(nickname) {
  return Cookies.set(NicknameKey, nickname)
}
export function delNickname() {
  return Cookies.remove(NicknameKey)
}

const UsernameKey = 'Admin-Username'
export function getUsername() {
  return Cookies.get(UsernameKey)
}
export function setUsername(username) {
  return Cookies.set(UsernameKey, username)
}
export function delUsername() {
  return Cookies.remove(UsernameKey)
}
