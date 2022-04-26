import Layout from '@/layout'

const cms = {
  path: '/cms',
  name: 'cms',
  meta: {
    title: '内容管理',
    icon: 'el-icon-reading',
    roles: [
      'admin/cms.Content/list',
      'admin/cms.Category/list',
      'admin/cms.Comment/list',
      'admin/cms.Setting/info',
      'admin/cms.Content/recover',
      'admin/cms.Category/recover',
      'admin/cms.Comment/recover'
    ]
  },
  redirect: 'noRedirect',
  component: Layout,
  alwaysShow: true,
  children: [
    {
      path: 'content',
      name: 'CmsContent',
      meta: {
        title: '内容管理',
        icon: 'el-icon-reading',
        roles: ['admin/cms.Content/list'],
        query: { recycle: 0 }
      },
      component: () => import('@/views/cms/content')
    },
    {
      path: 'category',
      name: 'CmsCategory',
      meta: {
        title: '内容分类',
        icon: 'el-icon-reading',
        roles: ['admin/cms.Category/list'],
        query: { recycle: 0 }
      },
      component: () => import('@/views/cms/category')
    },
    {
      path: 'comment',
      name: 'CmsComment',
      meta: {
        title: '留言管理',
        icon: 'el-icon-reading',
        roles: ['admin/cms.Comment/list'],
        query: { recycle: 0 }
      },
      component: () => import('@/views/cms/comment')
    },
    {
      path: 'setting',
      name: 'CmsSetting',
      meta: {
        title: '内容设置',
        icon: 'el-icon-reading',
        roles: ['admin/cms.Setting/info']
      },
      component: () => import('@/views/cms/setting')
    },
    {
      path: 'content-recover',
      name: 'CmsContent',
      meta: {
        title: '内容回收站',
        icon: 'el-icon-reading',
        roles: ['admin/cms.Content/recover'],
        query: { recycle: 1 }
      },
      component: () => import('@/views/cms/content')
    },
    {
      path: 'category-recover',
      name: 'CmsCategory',
      meta: {
        title: '内容分类回收站',
        icon: 'el-icon-reading',
        roles: ['admin/cms.Category/recover'],
        query: { recycle: 1 }
      },
      component: () => import('@/views/cms/category')
    },
    {
      path: 'comment-recover',
      name: 'CmsComment',
      meta: {
        title: '留言回收站',
        icon: 'el-icon-reading',
        roles: ['admin/cms.Comment/recover'],
        query: { recycle: 1 }
      },
      component: () => import('@/views/cms/comment')
    }
  ]
}
export default cms
