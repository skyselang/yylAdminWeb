import Cookies from 'js-cookie'

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

const UsernameKey = 'Username'
export function setUsername(username) {
  return Cookies.set(UsernameKey, username)
}
export function getUsername() {
  return Cookies.get(UsernameKey)
}
export function delUsername() {
  return Cookies.remove(UsernameKey)
}

const NicknameKey = 'Nickname'
export function setNickname(nickname) {
  return Cookies.set(NicknameKey, nickname)
}
export function getNickname() {
  return Cookies.get(NicknameKey)
}
export function delNickname() {
  return Cookies.remove(NicknameKey)
}

const AvatarKey = 'Avatar'
export function setAvatar(avatar) {
  return Cookies.set(AvatarKey, avatar)
}
export function getAvatar() {
  return Cookies.get(AvatarKey)
}
export function delAvatar() {
  return Cookies.remove(AvatarKey)
}

const MessageKey = 'Message'
export function setMessage(message) {
  return Cookies.set(MessageKey, message)
}
export function getMessage() {
  return Cookies.get(MessageKey)
}
export function delMessage() {
  return Cookies.remove(MessageKey)
}
