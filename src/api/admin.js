import request from '@/utils/request'

// ----------------菜单管理----------------
/**
 * 菜单列表
 * @param {array} params 请求参数
 */
export function menuList() {
  return request({
    url: '/admin/AdminMenu/menuList',
    method: 'get'
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
 * 菜单信息
 * @param {array} data 请求数据
 */
export function menuInfo(data) {
  return request({
    url: '/admin/AdminMenu/menuInfo',
    method: 'get',
    params: data
  })
}
/**
 * 菜单修改
 * @param {array} data 请求数据
 */
export function menuEdit(data, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/AdminMenu/menuEdit',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/AdminMenu/menuEdit',
      method: 'post',
      data
    })
  }
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
export function menuDisable(data) {
  return request({
    url: '/admin/AdminMenu/menuDisable',
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
/**
 * 菜单角色
 * @param {array} params 请求参数
 */
export function menuRole(params) {
  return request({
    url: '/admin/AdminMenu/menuRole',
    method: 'get',
    params: params
  })
}
/**
 * 菜单角色解除
 * @param {array} data 请求数据
 */
export function menuRoleRemove(data) {
  return request({
    url: '/admin/AdminMenu/menuRoleRemove',
    method: 'post',
    data
  })
}
/**
 * 菜单用户
 * @param {array} params 请求参数
 */
export function menuUser(params) {
  return request({
    url: '/admin/AdminMenu/menuUser',
    method: 'get',
    params: params
  })
}
/**
 * 菜单用户解除
 * @param {array} data 请求数据
 */
export function menuUserRemove(data) {
  return request({
    url: '/admin/AdminMenu/menuUserRemove',
    method: 'post',
    data
  })
}

// ----------------角色管理----------------
/**
 * 角色列表
 * @param {array} params 请求参数
 */
export function roleList(params) {
  return request({
    url: '/admin/AdminRole/roleList',
    method: 'get',
    params: params
  })
}
/**
 * 角色信息
 * @param {array} params 请求参数
 */
export function roleInfo(params) {
  return request({
    url: '/admin/AdminRole/roleInfo',
    method: 'get',
    params: params
  })
}
/**
 * 角色添加
 * @param {array} data 请求数据
 */
export function roleAdd(data = [], method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/AdminRole/roleAdd',
      method: 'get'
    })
  } else {
    return request({
      url: '/admin/AdminRole/roleAdd',
      method: 'post',
      data
    })
  }
}
/**
 * 角色修改
 * @param {array} data 请求数据
 */
export function roleEdit(data = [], method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/AdminRole/roleEdit',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/AdminRole/roleEdit',
      method: 'post',
      data
    })
  }
}
/**
 * 角色删除
 * @param {array} data 请求数据
 */
export function roleDele(data) {
  return request({
    url: '/admin/AdminRole/roleDele',
    method: 'post',
    data
  })
}
/**
 * 角色禁用
 * @param {array} data 请求数据
 */
export function roleDisable(data) {
  return request({
    url: '/admin/AdminRole/roleDisable',
    method: 'post',
    data
  })
}
/**
 * 角色用户
 * @param {array} params 请求参数
 */
export function roleUser(params) {
  return request({
    url: '/admin/AdminRole/roleUser',
    method: 'get',
    params: params
  })
}
/**
 * 角色用户解除
 * @param {array} data 请求数据
 */
export function roleUserRemove(data) {
  return request({
    url: '/admin/AdminRole/roleUserRemove',
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
export function userEdit(data, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/AdminUser/userEdit',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/AdminUser/userEdit',
      method: 'post',
      data
    })
  }
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
 * 用户密码重置
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
export function userRule(data, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/AdminUser/userRule',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/AdminUser/userRule',
      method: 'post',
      data
    })
  }
}
/**
 * 用户是否禁用
 * @param {array} data 请求数据
 */
export function userDisable(data) {
  return request({
    url: '/admin/AdminUser/userDisable',
    method: 'post',
    data
  })
}
/**
 * 用户是否管理员
 * @param {array} data 请求数据
 */
export function userAdmin(data) {
  return request({
    url: '/admin/AdminUser/userAdmin',
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
 * 日志统计
 * @param {array} data 请求数据
 */
export function logStatistic(data) {
  return request({
    url: '/admin/AdminLog/logStatistic',
    method: 'post',
    data
  })
}

// ----------------个人中心----------------
/**
 * 我的信息
 * @param {array} params 请求参数
 */
export function myInfo(params) {
  return request({
    url: '/admin/AdminMy/myInfo',
    method: 'get',
    params: params
  })
}
/**
 * 修改信息
 * @param {array} data 请求数据
 */
export function myEdit(data, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/AdminMy/myEdit',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/AdminMy/myEdit',
      method: 'post',
      data
    })
  }
}
/**
 * 修改密码
 * @param {array} data 请求数据
 */
export function myPwd(data) {
  return request({
    url: '/admin/AdminMy/myPwd',
    method: 'post',
    data
  })
}
/**
 * 修改头像
 * @param {array} data 请求数据
 */
export function myAvatar(data) {
  return request({
    url: '/admin/AdminMy/myAvatar',
    method: 'post',
    data
  })
}
/**
 * 我的日志
 * @param {array} params 请求参数
 */
export function myLog(params) {
  return request({
    url: '/admin/AdminMy/myLog',
    method: 'get',
    params: params
  })
}

// ----------------系统设置----------------
/**
 * 缓存设置
 * @param {array} data 请求数据
 */
export function settingCache(data = {}, method = 'get') {
  if (method === 'get') {
    return request({
      url: '/admin/AdminSetting/settingCache',
      method: 'get',
      params: data
    })
  } else {
    return request({
      url: '/admin/AdminSetting/settingCache',
      method: 'post',
      data
    })
  }
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
/**
 * 服务器信息
 * @param {array} data 请求数据
 */
export function serverInfo(data) {
  return request({
    url: '/admin/AdminSetting/serverInfo',
    method: 'get',
    params: data
  })
}

// ----------------实用工具----------------
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

// ----------------登录退出-----------------
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
