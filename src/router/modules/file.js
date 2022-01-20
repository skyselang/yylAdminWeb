import Layout from '@/layout'

const file = {
  path: '/file',
  name: 'file',
  meta: {
    title: '文件管理',
    icon: 'el-icon-folder',
    roles: [
      'admin/file.File/list',
      'admin/file.Group/list',
      'admin/file.Setting/info'
    ]
  },
  redirect: 'noRedirect',
  component: Layout,
  alwaysShow: true,
  children: [
    {
      path: 'file',
      name: 'FileFile',
      meta: {
        title: '文件管理',
        icon: 'el-icon-folder',
        roles: ['admin/file.File/list']
      },
      component: () => import('@/views/file/file')
    },
    {
      path: 'group',
      name: 'FileGroup',
      meta: {
        title: '文件分组',
        icon: 'el-icon-folder',
        roles: ['admin/file.Group/list']
      },
      component: () => import('@/views/file/group')
    },
    {
      path: 'setting',
      name: 'FileSetting',
      meta: {
        title: '文件设置',
        icon: 'el-icon-folder',
        roles: ['admin/file.Setting/info']
      },
      component: () => import('@/views/file/setting')
    }
  ]
}
export default file
