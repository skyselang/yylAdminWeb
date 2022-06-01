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
      'admin/file.Setting/info',
      'admin/file.File/recover',
      'admin/file.Group/recover'
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
        icon: 'el-icon-folder-add',
        roles: ['admin/file.File/list'],
        query: { recycle: 0 }
      },
      component: () => import('@/views/file/file')
    },
    {
      path: 'group',
      name: 'FileGroup',
      meta: {
        title: '文件分组',
        icon: 'el-icon-folder-checked',
        roles: ['admin/file.Group/list'],
        query: { recycle: 0 }
      },
      component: () => import('@/views/file/group')
    },
    {
      path: 'setting',
      name: 'FileSetting',
      meta: {
        title: '文件设置',
        icon: 'el-icon-folder-opened',
        roles: ['admin/file.Setting/info']
      },
      component: () => import('@/views/file/setting')
    },
    {
      path: 'file-recover',
      name: 'FileFile',
      meta: {
        title: '文件回收站',
        icon: 'el-icon-folder-remove',
        roles: ['admin/file.File/list'],
        query: { recycle: 1 }
      },
      component: () => import('@/views/file/file')
    },
    {
      path: 'group-recover',
      name: 'FileGroup',
      meta: {
        title: '文件分组回收站',
        icon: 'el-icon-folder-delete',
        roles: ['admin/file.Group/recover'],
        query: { recycle: 1 }
      },
      component: () => import('@/views/file/group')
    }
  ]
}
export default file
