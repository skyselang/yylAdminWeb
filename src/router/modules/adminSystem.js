import Layout from '@/layout'

const adminSystem = {
  path: '/system',
  name: 'SystemRule',
  meta: {
    title: '系统管理',
    icon: 'el-icon-set-up',
    roles: [
      'admin/admin.Notice/list',
      'admin/admin.Apidoc/apidoc',
      'admin/admin.Utils/utils',
      'admin/admin.Setting/cacheInfo',
      'admin/admin.Setting/tokenInfo',
      'admin/admin.Setting/captchaInfo',
      'admin/admin.Setting/logInfo',
      'admin/admin.Setting/apiInfo',
      'admin/admin.Setting/systemInfo',
      'admin/admin.Setting/emailInfo'
    ]
  },
  redirect: 'noRedirect',
  component: Layout,
  alwaysShow: true,
  children: [
    {
      path: 'notice',
      name: 'SystemNotice',
      meta: {
        title: '公告管理',
        icon: 'el-icon-chat-line-round',
        roles: ['admin/admin.Notice/list']
      },
      component: () => import('@/views/admin/system/notice')
    },
    {
      path: 'apidoc',
      name: 'SystemApidoc',
      meta: {
        title: '接口文档',
        icon: 'el-icon-document',
        roles: ['admin/admin.Apidoc/apidoc']
      },
      component: () => import('@/views/admin/system/apidoc')
    },
    {
      path: 'utils',
      name: 'SystemUtils',
      meta: {
        title: '实用工具',
        icon: 'el-icon-help',
        roles: ['admin/admin.Utils/utils']
      },
      component: () => import('@/views/admin/system/utils')
    },
    {
      path: 'setting',
      name: 'SystemSetting',
      meta: {
        title: '系统设置',
        icon: 'el-icon-set-up',
        roles: [
          'admin/admin.Setting/cacheInfo',
          'admin/admin.Setting/tokenInfo',
          'admin/admin.Setting/captchaInfo',
          'admin/admin.Setting/logInfo',
          'admin/admin.Setting/apiInfo',
          'admin/admin.Setting/systemInfo',
          'admin/admin.Setting/emailInfo'
        ]
      },
      component: () => import('@/views/admin/system/setting')
    }
  ]
}
export default adminSystem
