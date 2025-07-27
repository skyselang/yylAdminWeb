export const Layout = () => import('@/layout/index.vue')

/**
 * 文件管理路由
 */
const routes = {
  path: '/file',
  redirect: 'noRedirect',
  component: Layout,
  meta: {
    icon: 'Files',
    title: '文件管理',
    roles: [
      'admin/file.File/list',
      'admin/file.Group/list',
      'admin/file.Tag/list',
      'admin/file.Export/list',
      'admin/file.Import/list'
    ],
    activeMenuTop: '/file',
    hidden: false,
    keepAlive: true,
    alwaysShow: false
  },
  children: [
    {
      path: 'file',
      name: 'File',
      redirect: 'noRedirect',
      meta: {
        icon: 'Files',
        title: '文件管理',
        roles: ['admin/file.File/list'],
        activeMenuTop: '/file',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'FileList',
          component: () => import('@/views/file/file/list.vue'),
          meta: {
            title: '文件管理',
            roles: ['admin/file.File/list'],
            activeMenuTop: '/file',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'FileInfo',
          component: () => import('@/views/file/file/info.vue'),
          meta: {
            title: '文件信息',
            roles: ['admin/file.File/info'],
            activeMenu: '/file/file/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'FileAdd',
          component: () => import('@/views/file/file/add.vue'),
          meta: {
            title: '文件添加',
            roles: ['admin/file.File/add'],
            activeMenu: '/file/file/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'FileEdit',
          component: () => import('@/views/file/file/edit.vue'),
          meta: {
            title: '文件修改',
            roles: ['admin/file.File/edit'],
            activeMenu: '/file/file/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'group',
      name: 'FileGroup',
      redirect: 'noRedirect',
      meta: {
        icon: 'Files',
        title: '文件分组',
        roles: ['admin/file.Group/list'],
        activeMenuTop: '/file',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'FileGroupList',
          component: () => import('@/views/file/group/list.vue'),
          meta: {
            icon: 'Files',
            title: '文件分组',
            roles: ['admin/file.Group/list'],
            activeMenuTop: '/file',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'FileGroupInfo',
          component: () => import('@/views/file/group/info.vue'),
          meta: {
            title: '文件分组信息',
            roles: ['admin/file.Group/info'],
            activeMenu: '/file/group/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'FileGroupAdd',
          component: () => import('@/views/file/group/add.vue'),
          meta: {
            title: '文件分组添加',
            roles: ['admin/file.Group/add'],
            activeMenu: '/file/group/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'FileGroupEdit',
          component: () => import('@/views/file/group/edit.vue'),
          meta: {
            title: '文件分组修改',
            roles: ['admin/file.Group/edit'],
            activeMenu: '/file/group/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'tag',
      name: 'FileTag',
      redirect: 'noRedirect',
      meta: {
        icon: 'Files',
        title: '文件标签',
        roles: ['admin/file.Tag/list'],
        activeMenuTop: '/file',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'FileTagList',
          component: () => import('@/views/file/tag/list.vue'),
          meta: {
            icon: 'Files',
            title: '文件标签',
            roles: ['admin/file.Tag/list'],
            activeMenuTop: '/file',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'FileTagInfo',
          component: () => import('@/views/file/tag/info.vue'),
          meta: {
            title: '文件标签信息',
            roles: ['admin/file.Tag/info'],
            activeMenu: '/file/tag/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'FileTagAdd',
          component: () => import('@/views/file/tag/add.vue'),
          meta: {
            title: '文件标签添加',
            roles: ['admin/file.Tag/list'],
            activeMenu: '/file/tag/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'FileTagEdit',
          component: () => import('@/views/file/tag/edit.vue'),
          meta: {
            title: '文件标签修改',
            roles: ['admin/file.Tag/list'],
            activeMenu: '/file/tag/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'export',
      name: 'FileExport',
      redirect: 'noRedirect',
      meta: {
        icon: 'Files',
        title: '导出文件',
        roles: ['admin/file.Export/list'],
        activeMenuTop: '/file',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'FileExportList',
          component: () => import('@/views/file/export/list.vue'),
          meta: {
            icon: 'Files',
            title: '导出文件',
            roles: ['admin/file.Export/list'],
            activeMenuTop: '/file',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'FileExportInfo',
          component: () => import('@/views/file/export/info.vue'),
          meta: {
            title: '导出文件信息',
            roles: ['admin/file.Export/info'],
            activeMenu: '/file/export/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'FileExportEdit',
          component: () => import('@/views/file/export/edit.vue'),
          meta: {
            title: '导出文件修改',
            roles: ['admin/file.Export/list'],
            activeMenu: '/file/export/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'import',
      name: 'FileImport',
      redirect: 'noRedirect',
      meta: {
        icon: 'Files',
        title: '导入文件',
        roles: ['admin/file.Import/list'],
        activeMenuTop: '/file',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'FileImportList',
          component: () => import('@/views/file/import/list.vue'),
          meta: {
            icon: 'Files',
            title: '导入文件',
            roles: ['admin/file.Import/list'],
            activeMenuTop: '/file',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'FileImportInfo',
          component: () => import('@/views/file/import/info.vue'),
          meta: {
            title: '导入文件信息',
            roles: ['admin/file.Import/info'],
            activeMenu: '/file/import/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'FileImportEdit',
          component: () => import('@/views/file/import/edit.vue'),
          meta: {
            title: '导入文件修改',
            roles: ['admin/file.Import/list'],
            activeMenu: '/file/import/list',
            activeMenuTop: '/file',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    }
  ]
}

export default routes
