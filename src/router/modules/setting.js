import Layout from '@/layout'

const setting = {
  path: '/setting',
  name: 'setting',
  meta: {
    title: '设置管理',
    icon: 'el-icon-setting',
    roles: [
      'admin/setting.Api/list',
      'admin/setting.Region/list',
      'admin/setting.Wechat/offiInfo',
      'admin/setting.Wechat/miniInfo',
      'admin/setting.Setting/tokenInfo',
      'admin/setting.Setting/captchaInfo',
      'admin/setting.Setting/logInfo',
      'admin/setting.Setting/apiInfo',
      'admin/setting.Setting/diyInfo'
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
        icon: 'el-icon-link',
        roles: ['admin/setting.Api/list']
      },
      component: () => import('@/views/setting/api')
    },
    {
      path: 'region',
      name: 'SettingRegion',
      meta: {
        title: '地区管理',
        icon: 'el-icon-map-location',
        roles: ['admin/setting.Region/list']
      },
      component: () => import('@/views/setting/region')
    },
    {
      path: 'wechat',
      name: 'SettingWechat',
      meta: {
        title: '微信设置',
        icon: 'el-icon-chat-dot-round',
        roles: [
          'admin/setting.Wechat/offiInfo',
          'admin/setting.Wechat/miniInfo'
        ]
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
          'admin/setting.Setting/tokenInfo',
          'admin/setting.Setting/captchaInfo',
          'admin/setting.Setting/logInfo',
          'admin/setting.Setting/apiInfo',
          'admin/setting.Setting/diyInfo'
        ]
      },
      component: () => import('@/views/setting/setting')
    }
  ]
}
export default setting
