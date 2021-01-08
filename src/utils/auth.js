import Cookies from 'js-cookie'

const AdminUserIdKey = 'AdminUserId'
export function setAdminUserId(AdminUserId) {
  return Cookies.set(AdminUserIdKey, AdminUserId)
}
export function getAdminUserId() {
  return Cookies.get(AdminUserIdKey)
}
export function delAdminUserId() {
  return Cookies.remove(AdminUserIdKey)
}

const TokenKey = 'AdminToken'
export function setAdminToken(AdminToken) {
  return Cookies.set(TokenKey, AdminToken)
}
export function getAdminToken() {
  return Cookies.get(TokenKey)
}
export function delAdminToken() {
  return Cookies.remove(TokenKey)
}

const UsernameKey = 'AdminUsername'
export function setUsername(username) {
  return Cookies.set(UsernameKey, username)
}
export function getUsername() {
  return Cookies.get(UsernameKey)
}
export function delUsername() {
  return Cookies.remove(UsernameKey)
}

const NicknameKey = 'AdminNickname'
export function setNickname(nickname) {
  return Cookies.set(NicknameKey, nickname)
}
export function getNickname() {
  return Cookies.get(NicknameKey)
}
export function delNickname() {
  return Cookies.remove(NicknameKey)
}

const AvatarKey = 'AdminAvatar'
export function setAvatar(username) {
  return Cookies.set(AvatarKey, username)
}
export function getAvatar() {
  return Cookies.get(AvatarKey)
}
export function delAvatar() {
  return Cookies.remove(AvatarKey)
}
