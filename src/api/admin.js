import request from '@/utils/request'

// ----------------登录|退出----------------
/**
 * 登录
 * @param {array} data 请求数据
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
 * @param {array} data 请求数据
 */
export function logout(data) {
  return request({
    url: '/admin/AdminLogin/logout',
    method: 'post',
    data
  })
}
/**
 * 验证码
 *  @param {array} params 请求参数
 */
export function verify(params) {
  return request({
    url: '/admin/AdminLogin/verify',
    method: 'get',
    params: params
  })
}

// ----------------菜单管理----------------
/**
 * 菜单列表
 * @param {array} params 请求参数
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
 * @param {array} data 请求数据
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
 * @param {array} data 请求数据
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
 * @param {array} data 请求数据
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
 * @param {array} data 请求数据
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
 * @param {array} data 请求数据
 */
export function menuUnauth(data) {
  return request({
    url: '/admin/AdminMenu/menuUnauth',
    method: 'post',
    data
  })
}

// ----------------用户管理----------------
/**
 * 用户列表
 * @param {array} params 请求参数
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
 * @param {array} data 请求数据
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
 * @param {array} data 请求数据
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
 * @param {array} data 请求数据
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
 * @param {array} params 请求参数
 */
export function userInfo(params) {
  return request({
    url: '/admin/AdminUser/userInfo',
    method: 'get',
    params: params
  })
}
/**
 * 用户重置密码
 * @param {array} data 请求数据
 */
export function userPwd(data) {
  return request({
    url: '/admin/AdminUser/userPwd',
    method: 'post',
    data
  })
}
/**
 * 用户权限分配
 * @param {array} data 请求数据
 */
export function userRule(data) {
  return request({
    url: '/admin/AdminUser/userRule',
    method: 'post',
    data
  })
}
/**
 * 用户权限明细
 * @param {array} params 请求数据
 */
export function userRuleInfo(params) {
  return request({
    url: '/admin/AdminUser/userRuleInfo',
    method: 'get',
    params: params
  })
}
/**
 * 用户是否禁用
 * @param {array} data 请求数据
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
 * @param {array} data 请求数据
 */
export function userSuperAdmin(data) {
  return request({
    url: '/admin/AdminUser/userSuperAdmin',
    method: 'post',
    data
  })
}

// ----------------权限管理----------------
/**
 * 权限列表
 * @param {array} params 请求参数
 */
export function ruleList(params) {
  return request({
    url: '/admin/AdminRule/ruleList',
    method: 'get',
    params: params
  })
}
/**
 * 权限添加
 * @param {array} data 请求数据
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
 * @param {array} data 请求数据
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
 * @param {array} data 请求数据
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
 * @param {array} params 请求参数
 */
export function ruleInfo(params) {
  return request({
    url: '/admin/AdminRule/ruleInfo',
    method: 'get',
    params: params
  })
}
/**
 * 权限是否禁用
 * @param {array} data 请求数据
 */
export function ruleProhibit(data) {
  return request({
    url: '/admin/AdminRule/ruleProhibit',
    method: 'post',
    data
  })
}

// ----------------日志管理----------------
/**
 * 日志列表
 * @param {array} params 请求参数
 */
export function logList(params) {
  return request({
    url: '/admin/AdminLog/logList',
    method: 'get',
    params: params
  })
}
/**
 * 日志删除
 * @param {array} data 请求数据
 */
export function logDele(data) {
  return request({
    url: '/admin/AdminLog/logDele',
    method: 'post',
    data
  })
}
/**
 * 日志信息
 * @param {array} params 请求参数
 */
export function logInfo(params) {
  return request({
    url: '/admin/AdminLog/logInfo',
    method: 'get',
    params: params
  })
}

// ----------------个人中心----------------
/**
 * 个人信息
 * @param {array} params 请求参数
 */
export function usersInfo(params) {
  return request({
    url: '/admin/AdminUsers/usersInfo',
    method: 'get',
    params: params
  })
}
/**
 * 修改信息
 * @param {array} data 请求数据
 */
export function usersEdit(data) {
  return request({
    url: '/admin/AdminUsers/usersEdit',
    method: 'post',
    data
  })
}
/**
 * 修改密码
 * @param {array} data 请求数据
 */
export function usersPwd(data) {
  return request({
    url: '/admin/AdminUsers/usersPwd',
    method: 'post',
    data
  })
}
/**
 * 更换头像
 * @param {array} data 请求数据
 */
export function usersAvatar(data) {
  return request({
    url: '/admin/AdminUsers/usersAvatar',
    method: 'post',
    data
  })
}
/**
 * 日志列表
 * @param {array} params 请求参数
 */
export function usersLog(params) {
  return request({
    url: '/admin/AdminUsers/usersLog',
    method: 'get',
    params: params
  })
}

// ----------------访问统计-----------------
/**
 * 访问统计
 *  @param {array} data 请求数据
 */
export function visitCount(data) {
  return request({
    url: '/admin/AdminVisit/visitCount',
    method: 'post',
    data
  })
}
/**
 * 日期统计
 *  @param {array} data 请求数据
 */
export function visitDate(data) {
  return request({
    url: '/admin/AdminVisit/visitDate',
    method: 'post',
    data
  })
}
/**
 * 访问统计
 *  @param {array} data 请求数据
 */
export function visitStats(data) {
  return request({
    url: '/admin/AdminVisit/visitStats',
    method: 'post',
    data
  })
}

// ----------------实用工具----------------
/**
 * 字符串转换
 * @param {array} data 请求数据
 */
export function strTran(data) {
  return request({
    url: '/admin/AdminTool/strTran',
    method: 'post',
    data
  })
}
/**
 * 随机字符串
 * @param {array} data 请求数据
 */
export function strRand(data) {
  return request({
    url: '/admin/AdminTool/strRand',
    method: 'post',
    data
  })
}
/**
 * 时间戳转换
 * @param {array} data 请求数据
 */
export function timeTran(data) {
  return request({
    url: '/admin/AdminTool/timeTran',
    method: 'post',
    data
  })
}
/**
 * 生成二维码
 * @param {array} data 请求数据
 */
export function qrcode(data) {
  return request({
    url: '/admin/AdminTool/qrcode',
    method: 'post',
    data
  })
}
/**
 * 字节转换
 * @param {array} data 请求数据
 */
export function byteTran(data) {
  return request({
    url: '/admin/AdminTool/byteTran',
    method: 'post',
    data
  })
}
/**
 * IP查询
 * @param {array} data 请求数据
 */
export function ipQuery(data) {
  return request({
    url: '/admin/AdminTool/ipQuery',
    method: 'post',
    data
  })
}

// ----------------系统设置----------------
/**
 * 缓存设置
 * @param {array} data 请求数据
 */
export function settingCache(data) {
  return request({
    url: '/admin/AdminSetting/settingCache',
    method: 'post',
    data
  })
}
/**
 * 验证码设置
 * @param {array} data 请求数据
 */
export function settingVerify(data) {
  if (data) {
    return request({
      url: '/admin/AdminSetting/settingVerify',
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/admin/AdminSetting/settingVerify',
      method: 'get'
    })
  }
}
/**
 * Token设置
 * @param {array} data 请求数据
 */
export function settingToken(data) {
  if (data) {
    return request({
      url: '/admin/AdminSetting/settingToken',
      method: 'post',
      data
    })
  } else {
    return request({
      url: '/admin/AdminSetting/settingToken',
      method: 'get'
    })
  }
}
