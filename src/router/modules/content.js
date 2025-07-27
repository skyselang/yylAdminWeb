export const Layout = () => import('@/layout/index.vue')

/**
 * 内容管理路由
 */
const routes = {
  path: '/content',
  redirect: 'noRedirect',
  component: Layout,
  meta: {
    icon: 'Reading',
    title: '内容管理',
    roles: ['admin/content.Content/list', 'admin/content.Category/list', 'admin/content.Tag/list'],
    activeMenuTop: '/content',
    hidden: false,
    keepAlive: true,
    alwaysShow: false
  },
  children: [
    {
      path: 'content',
      name: 'Content',
      redirect: 'noRedirect',
      meta: {
        icon: 'Reading',
        title: '内容管理',
        roles: ['admin/content.Content/list'],
        activeMenuTop: '/content',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'ContentList',
          component: () => import('@/views/content/content/list.vue'),
          meta: {
            icon: 'Reading',
            title: '内容管理',
            roles: ['admin/content.Content/list'],
            activeMenuTop: '/content',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'ContentInfo',
          component: () => import('@/views/content/content/info.vue'),
          meta: {
            title: '内容信息',
            roles: ['admin/content.Content/info'],
            activeMenu: '/content/content/list',
            activeMenuTop: '/content',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'ContentAdd',
          component: () => import('@/views/content/content/add.vue'),
          meta: {
            title: '内容添加',
            roles: ['admin/content.Content/add'],
            activeMenu: '/content/content/list',
            activeMenuTop: '/content',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'ContentEdit',
          component: () => import('@/views/content/content/edit.vue'),
          meta: {
            title: '内容修改',
            roles: ['admin/content.Content/edit'],
            activeMenu: '/content/content/list',
            activeMenuTop: '/content',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'category',
      name: 'ContentCategory',
      redirect: 'noRedirect',
      meta: {
        icon: 'Reading',
        title: '内容分类',
        roles: ['admin/content.Category/list'],
        activeMenuTop: '/content',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'ContentCategoryList',
          component: () => import('@/views/content/category/list.vue'),
          meta: {
            icon: 'Reading',
            title: '内容分类',
            roles: ['admin/content.Category/list'],
            activeMenuTop: '/content',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'ContentCategoryInfo',
          component: () => import('@/views/content/category/info.vue'),
          meta: {
            title: '内容分类信息',
            roles: ['admin/content.Category/info'],
            activeMenu: '/content/category/list',
            activeMenuTop: '/content',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add/:pid?',
          name: 'ContentCategoryAdd',
          component: () => import('@/views/content/category/add.vue'),
          meta: {
            title: '内容分类添加',
            roles: ['admin/content.Category/add'],
            activeMenu: '/content/category/list',
            activeMenuTop: '/content',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'ContentCategoryEdit',
          component: () => import('@/views/content/category/edit.vue'),
          meta: {
            title: '内容分类修改',
            roles: ['admin/content.Category/edit'],
            activeMenu: '/content/category/list',
            activeMenuTop: '/content',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'tag',
      name: 'ContentTag',
      redirect: 'noRedirect',
      meta: {
        icon: 'Reading',
        title: '内容标签',
        roles: ['admin/content.Tag/list'],
        activeMenuTop: '/content',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'ContentTagList',
          component: () => import('@/views/content/tag/list.vue'),
          meta: {
            icon: 'Reading',
            title: '内容标签',
            roles: ['admin/content.Tag/list'],
            activeMenuTop: '/content',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'ContentTagInfo',
          component: () => import('@/views/content/tag/info.vue'),
          meta: {
            title: '内容标签信息',
            roles: ['admin/content.Tag/info'],
            activeMenu: '/content/tag/list',
            activeMenuTop: '/content',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'ContentTagAdd',
          component: () => import('@/views/content/tag/add.vue'),
          meta: {
            title: '内容标签添加',
            roles: ['admin/content.Tag/add'],
            activeMenu: '/content/tag/list',
            activeMenuTop: '/content',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'ContentTagEdit',
          component: () => import('@/views/content/tag/edit.vue'),
          meta: {
            title: '内容标签修改',
            roles: ['admin/content.Tag/edit'],
            activeMenu: '/content/tag/list',
            activeMenuTop: '/content',
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
