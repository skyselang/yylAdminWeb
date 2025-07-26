export const Layout = () => import('@/layout/index.vue')

/**
 * 会员管理路由
 */
const routes = {
  path: '/member',
  redirect: 'noRedirect',
  component: Layout,
  meta: {
    icon: 'User',
    title: '会员管理',
    roles: [
      'admin/member.Member/list',
      'admin/member.Group/list',
      'admin/member.Tag/list',
      'admin/member.Api/list',
      'admin/member.Statistic/statistic',
      'admin/member.Log/list',
      'admin/member.Third/list'
    ],
    activeMenuTop: '/member',
    hidden: false,
    keepAlive: true,
    alwaysShow: false
  },
  children: [
    {
      path: 'member',
      name: 'Member',
      redirect: 'noRedirect',
      meta: {
        icon: 'User',
        title: '会员管理',
        roles: ['admin/member.Member/list'],
        activeMenuTop: '/member',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'MemberList',
          component: () => import('@/views/member/member/list.vue'),
          meta: {
            icon: 'User',
            title: '会员管理',
            roles: ['admin/member.Member/list'],
            activeMenuTop: '/member',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'MemberInfo',
          component: () => import('@/views/member/member/info.vue'),
          meta: {
            title: '会员信息',
            roles: ['admin/member.Member/info'],
            activeMenu: '/member/member/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'MemberAdd',
          component: () => import('@/views/member/member/add.vue'),
          meta: {
            title: '会员添加',
            roles: ['admin/member.Member/add'],
            activeMenu: '/member/member/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'MemberEdit',
          component: () => import('@/views/member/member/edit.vue'),
          meta: {
            title: '会员修改',
            roles: ['admin/member.Member/edit'],
            activeMenu: '/member/member/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'group',
      name: 'MemberGroup',
      redirect: 'noRedirect',
      meta: {
        icon: 'User',
        title: '会员分组',
        roles: ['admin/member.Group/list'],
        activeMenuTop: '/member',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'MemberGroupList',
          component: () => import('@/views/member/group/list.vue'),
          meta: {
            icon: 'User',
            title: '会员分组',
            roles: ['admin/member.Group/list'],
            activeMenuTop: '/member',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'MemberGroupInfo',
          component: () => import('@/views/member/group/info.vue'),
          meta: {
            title: '会员分组信息',
            roles: ['admin/member.Group/info'],
            activeMenu: '/member/group/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'MemberGroupAdd',
          component: () => import('@/views/member/group/add.vue'),
          meta: {
            title: '会员分组添加',
            roles: ['admin/member.Group/add'],
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'MemberGroupEdit',
          component: () => import('@/views/member/group/edit.vue'),
          meta: {
            title: '会员分组修改',
            roles: ['admin/member.Group/edit'],
            activeMenu: '/member/group/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'tag',
      name: 'MemberTag',
      redirect: 'noRedirect',
      meta: {
        icon: 'User',
        title: '会员标签',
        roles: ['admin/member.Tag/list'],
        activeMenuTop: '/member',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'MemberTagList',
          component: () => import('@/views/member/tag/list.vue'),
          meta: {
            icon: 'User',
            title: '会员标签',
            roles: ['admin/member.Tag/list'],
            activeMenuTop: '/member',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'MemberTagInfo',
          component: () => import('@/views/member/tag/info.vue'),
          meta: {
            title: '会员标签信息',
            roles: ['admin/member.Tag/info'],
            activeMenu: '/member/tag/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'MemberTagAdd',
          component: () => import('@/views/member/tag/add.vue'),
          meta: {
            title: '会员标签添加',
            roles: ['admin/member.Tag/add'],
            activeMenu: '/member/tag/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'MemberTagEdit',
          component: () => import('@/views/member/tag/edit.vue'),
          meta: {
            title: '会员标签修改',
            roles: ['admin/member.Tag/edit'],
            activeMenu: '/member/tag/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'api',
      name: 'MemberApi',
      redirect: 'noRedirect',
      meta: {
        icon: 'User',
        title: '会员接口',
        roles: ['admin/member.Api/list'],
        activeMenuTop: '/member',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'MemberApiList',
          component: () => import('@/views/member/api/list.vue'),
          meta: {
            icon: 'User',
            title: '会员接口',
            roles: ['admin/member.Api/list'],
            activeMenuTop: '/member',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'MemberApiInfo',
          component: () => import('@/views/member/api/info.vue'),
          meta: {
            title: '会员接口信息',
            roles: ['admin/member.Api/info'],
            activeMenu: '/member/api/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add/:pid?',
          name: 'MemberApiAdd',
          component: () => import('@/views/member/api/add.vue'),
          meta: {
            title: '会员接口添加',
            roles: ['admin/member.Api/add'],
            activeMenu: '/member/api/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'MemberApiEdit',
          component: () => import('@/views/member/api/edit.vue'),
          meta: {
            title: '会员接口修改',
            roles: ['admin/member.Api/edit'],
            activeMenu: '/member/api/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'statistic',
      name: 'MemberStatistic',
      component: () => import('@/views/member/statistic/statistic.vue'),
      meta: {
        icon: 'User',
        title: '会员统计',
        roles: ['admin/member.Statistic/statistic'],
        activeMenuTop: '/member',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      }
    },
    {
      path: 'third',
      name: 'MemberThird',
      redirect: 'noRedirect',
      meta: {
        icon: 'User',
        title: '会员第三方账号',
        roles: ['admin/member.Third/list'],
        activeMenuTop: '/member',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'MemberThirdList',
          component: () => import('@/views/member/third/list.vue'),
          meta: {
            icon: 'User',
            title: '会员第三方账号',
            roles: ['admin/member.Third/list'],
            activeMenuTop: '/member',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'MemberThirdInfo',
          component: () => import('@/views/member/third/info.vue'),
          meta: {
            title: '会员第三方账号信息',
            roles: ['admin/member.Third/info'],
            activeMenu: '/member/third/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'MemberThirdAdd',
          component: () => import('@/views/member/third/add.vue'),
          meta: {
            title: '会员第三方账号添加',
            roles: ['admin/member.Third/add'],
            activeMenu: '/member/third/list',
            activeMenuTop: '/member',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'MemberThirdEdit',
          component: () => import('@/views/member/third/edit.vue'),
          meta: {
            title: '会员第三方账号修改',
            roles: ['admin/member.Third/edit'],
            activeMenu: '/member/third/list',
            activeMenuTop: '/member',
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
