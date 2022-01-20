import Layout from '@/layout'

const setting = {
  path: '/setting',
  name: 'setting',
  meta: {
    title: '设置管理',
    icon: 'el-icon-setting',
    roles: [
      'admin/Api/list',
      'admin/Region/list',
      'admin/SettingWechat/offiInfo',
      'admin/SettingWechat/miniInfo',
      'admin/Setting/tokenInfo',
      'admin/Setting/captchaInfo',
      'admin/Setting/logInfo',
      'admin/Setting/apiInfo'
    ]
  },
  redirect: 'noRedirect',
  component: Layout,
  alwaysShow: true,
  children: [
    {
      path: 'api',
      name: 'SettingApi',
      meta: {
        title: '接口管理',
        icon: 'el-icon-setting',
        roles: ['admin/Api/list']
      },
      component: () => import('@/views/api/api')
    },
    {
      path: 'region',
      name: 'SettingRegion',
      meta: {
        title: '地区管理',
        icon: 'el-icon-setting',
        roles: ['admin/Region/list']
      },
      component: () => import('@/views/region/region')
    },
    {
      path: 'wechat',
      name: 'SettingWechat',
      meta: {
        title: '微信设置',
        icon: 'el-icon-setting',
        roles: ['admin/SettingWechat/offiInfo', 'admin/SettingWechat/miniInfo']
      },
      component: () => import('@/views/setting/wechat')
    },
    {
      path: 'setting',
      name: 'SettingSetting',
      meta: {
        title: '设置管理',
        icon: 'el-icon-setting',
        roles: [
          'admin/Setting/tokenInfo',
          'admin/Setting/captchaInfo',
          'admin/Setting/logInfo',
          'admin/Setting/apiInfo'
        ]
      },
      component: () => import('@/views/setting/setting')
    }
  ]
}
export default setting
