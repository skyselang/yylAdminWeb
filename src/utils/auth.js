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

const AdminTokenKey = 'AdminToken'
export function setAdminToken(AdminToken) {
  return Cookies.set(AdminTokenKey, AdminToken)
}
export function getAdminToken() {
  return Cookies.get(AdminTokenKey)
}
export function delAdminToken() {
  return Cookies.remove(AdminTokenKey)
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
