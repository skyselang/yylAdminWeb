import request from '@/utils/request'
// 系统设置

// ---------------登录|退出----------------
/**
 * 登录
 * @param {array} data
 */
export function login(data) {
  return request({
    url: '/admin/AdminLogin/login',
    method: 'post',
    data
  })
}
/**
 * 退出
 */
export function logout(data) {
  return request({
    url: '/admin/AdminLogin/logout',
    method: 'post',
    data
  })
}

// ---------------菜单管理------------------
/**
 * 菜单列表
 * @param {array} params 参数
 */
export function menuList(params) {
  return request({
    url: '/admin/AdminMenu/menuList',
    method: 'get',
    params: params
  })
}
/**
 * 菜单添加
 * @param {array} data 参数
 */
export function menuAdd(data) {
  return request({
    url: '/admin/AdminMenu/menuAdd',
    method: 'post',
    data
  })
}
/**
 * 菜单修改
 * @param {array} data 参数
 */
export function menuEdit(data) {
  return request({
    url: '/admin/AdminMenu/menuEdit',
    method: 'post',
    data
  })
}
/**
 * 菜单删除
 * @param {array} data 参数
 */
export function menuDele(data) {
  return request({
    url: '/admin/AdminMenu/menuDele',
    method: 'post',
    data
  })
}
/**
 * 菜单是否禁用
 * @param {array} data 参数
 */
export function menuProhibit(data) {
  return request({
    url: '/admin/AdminMenu/menuProhibit',
    method: 'post',
    data
  })
}
/**
 * 菜单是否无需权限
 * @param {array} data 参数
 */
export function menuUnauth(data) {
  return request({
    url: '/admin/AdminMenu/menuUnauth',
    method: 'post',
    data
  })
}

// ---------------用户管理-----------------
/**
 * 用户列表
 * @param {array} params 参数
 */
export function userList(params) {
  return request({
    url: '/admin/AdminUser/userList',
    method: 'get',
    params: params
  })
}
/**
 * 用户添加
 * @param {array} data 参数
 */
export function userAdd(data) {
  return request({
    url: '/admin/AdminUser/userAdd',
    method: 'post',
    data
  })
}
/**
 * 用户修改
 * @param {array} data 参数
 */
export function userEdit(data) {
  return request({
    url: '/admin/AdminUser/userEdit',
    method: 'post',
    data
  })
}
/**
 * 用户删除
 * @param {array} data 参数
 */
export function userDele(data) {
  return request({
    url: '/admin/AdminUser/userDele',
    method: 'post',
    data
  })
}
/**
 * 用户信息
 * @param {array} params 参数
 */
export function userInfo(params) {
  return request({
    url: '/admin/AdminUser/userInfo',
    method: 'get',
    params: params
  })
}
/**
 * 用户个人中心
 * @param {array} params 参数
 */
export function userCenterGet(params) {
  return request({
    url: '/admin/AdminUser/userCenter',
    method: 'get',
    params: params
  })
}
export function userCenterPost(data) {
  return request({
    url: '/admin/AdminUser/userCenter',
    method: 'post',
    data
  })
}
/**
 * 用户重置密码
 * @param {array} data 参数
 */
export function userRepwd(data) {
  return request({
    url: '/admin/AdminUser/userRepwd',
    method: 'post',
    data
  })
}
/**
 * 用户权限分配
 * @param {array} data 参数
 */
export function userRule(data) {
  return request({
    url: '/admin/AdminUser/userRule',
    method: 'post',
    data
  })
}
/**
 * 用户是否禁用
 * @param {array} data 参数
 */
export function userProhibit(data) {
  return request({
    url: '/admin/AdminUser/userProhibit',
    method: 'post',
    data
  })
}
/**
 * 用户是否超管
 * @param {array} data 参数
 */
export function userSuperAdmin(data) {
  return request({
    url: '/admin/AdminUser/userSuperAdmin',
    method: 'post',
    data
  })
}

// ---------------权限管理----------------
/**
 * 权限列表
 * @param {array} params 参数
 */
export function ruleList(params) {
  return request({
    url: '/admin/AdminRule/ruleList',
    method: 'get',
    params: params
  })
}
/**
 * 权限是否禁用
 * @param {array} data 参数
 */
export function ruleProhibit(data) {
  return request({
    url: '/admin/AdminRule/ruleProhibit',
    method: 'post',
    data
  })
}
/**
 * 权限添加
 * @param {array} data 参数
 */
export function ruleAdd(data) {
  return request({
    url: '/admin/AdminRule/ruleAdd',
    method: 'post',
    data
  })
}
/**
 * 权限修改
 * @param {array} data 参数
 */
export function ruleEdit(data) {
  return request({
    url: '/admin/AdminRule/ruleEdit',
    method: 'post',
    data
  })
}
/**
 * 权限删除
 * @param {array} data 参数
 */
export function ruleDele(data) {
  return request({
    url: '/admin/AdminRule/ruleDele',
    method: 'post',
    data
  })
}
/**
 * 权限信息
 * @param {array} params 参数
 */
export function ruleInfo(params) {
  return request({
    url: '/admin/AdminRule/ruleInfo',
    method: 'get',
    params: params
  })
}
