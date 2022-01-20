import Layout from '@/layout'

const system = {
  path: '/admin/system',
  name: 'AdminSystem',
  meta: {
    title: '系统管理',
    icon: 'el-icon-s-tools',
    roles: [
      'admin/admin.Notice/list',
      'admin/admin.Apidoc/apidoc',
      'admin/admin.Utils/utils',
      'admin/admin.Setting/cacheInfo',
      'admin/admin.Setting/tokenInfo',
      'admin/admin.Setting/captchaInfo',
      'admin/admin.Setting/logInfo',
      'admin/admin.Setting/apiInfo',
      'admin/admin.Setting/systemInfo'
    ]
  },
  redirect: 'noRedirect',
  component: Layout,
  alwaysShow: true,
  children: [
    {
      path: 'notice',
      name: 'AdminSystemNotice',
      meta: {
        title: '公告管理',
        icon: 'el-icon-s-tools',
        roles: ['admin/admin.Notice/list']
      },
      component: () => import('@/views/admin/notice/notice')
    },
    {
      path: 'apidoc',
      name: 'AdminSystemApidoc',
      meta: {
        title: '接口文档',
        icon: 'el-icon-s-tools',
        roles: ['admin/admin.Apidoc/apidoc']
      },
      component: () => import('@/views/admin/apidoc/apidoc')
    },
    {
      path: 'utils',
      name: 'AdminSystemUtils',
      meta: {
        title: '实用工具',
        icon: 'el-icon-s-tools',
        roles: ['admin/admin.Utils/utils']
      },
      component: () => import('@/views/admin/utils/utils')
    },
    {
      path: 'setting',
      name: 'AdminSystemSetting',
      meta: {
        title: '系统管理',
        icon: 'el-icon-s-tools',
        roles: [
          'admin/admin.Setting/cacheInfo',
          'admin/admin.Setting/tokenInfo',
          'admin/admin.Setting/captchaInfo',
          'admin/admin.Setting/logInfo',
          'admin/admin.Setting/apiInfo',
          'admin/admin.Setting/systemInfo'
        ]
      },
      component: () => import('@/views/admin/setting/setting')
    }
  ]
}
export default system
