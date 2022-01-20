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
      'admin/cms.Setting/info'
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
        roles: ['admin/cms.Content/list']
      },
      component: () => import('@/views/cms/content')
    },
    {
      path: 'category',
      name: 'CmsCategory',
      meta: {
        title: '内容分类',
        icon: 'el-icon-reading',
        roles: ['admin/cms.Category/list']
      },
      component: () => import('@/views/cms/category')
    },
    {
      path: 'comment',
      name: 'CmsComment',
      meta: {
        title: '留言管理',
        icon: 'el-icon-reading',
        roles: ['admin/cms.Comment/list']
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
    }
  ]
}
export default cms
