export const Layout = () => import('@/layout/index.vue')

/**
 * 日志管理路由
 */
const routes = {
  path: '/log',
  redirect: 'noRedirect',
  component: Layout,
  meta: {
    icon: 'Notebook',
    title: '日志管理',
    roles: [
      'admin/member.Log/list',
      'admin/system.UserLog/list',
      'admin/system.EmailLog/list',
      'admin/system.SmsLog/list'
    ],
    activeMenuTop: '/log',
    hidden: false,
    keepAlive: true,
    alwaysShow: false
  },
  children: [
    {
      path: 'member-log',
      name: 'MemberLog',
      redirect: 'noRedirect',
      meta: {
        icon: 'User',
        title: '会员日志',
        roles: ['admin/member.Log/list'],
        activeMenuTop: '/log',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'MemberLogList',
          component: () => import('@/views/member/log/list.vue'),
          meta: {
            icon: 'User',
            title: '会员日志',
            roles: ['admin/member.Log/list'],
            activeMenuTop: '/log',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'MemberLogInfo',
          component: () => import('@/views/member/log/info.vue'),
          meta: {
            title: '会员日志信息',
            roles: ['admin/member.Log/info'],
            activeMenu: '/member/log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'MemberLogAdd',
          component: () => import('@/views/member/log/add.vue'),
          meta: {
            title: '会员日志添加',
            roles: ['admin/member.Log/add'],
            activeMenu: '/member/log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'MemberLogEdit',
          component: () => import('@/views/member/log/edit.vue'),
          meta: {
            title: '会员日志修改',
            roles: ['admin/member.Log/edit'],
            activeMenu: '/member/log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'user-log',
      name: 'SystemUserLog',
      redirect: 'noRedirect',
      meta: {
        icon: 'UserFilled',
        title: '用户日志',
        roles: ['admin/system.UserLog/list'],
        activeMenuTop: '/log',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SystemUserLogList',
          component: () => import('@/views/system/user-log/list.vue'),
          meta: {
            icon: 'UserFilled',
            title: '用户日志',
            roles: ['admin/system.UserLog/list'],
            activeMenuTop: '/log',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemUserLogInfo',
          component: () => import('@/views/system/user-log/info.vue'),
          meta: {
            title: '用户日志信息',
            roles: ['admin/system.UserLog/info'],
            activeMenu: '/system/user-log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SystemUserLogAdd',
          component: () => import('@/views/system/user-log/add.vue'),
          meta: {
            title: '用户日志添加',
            roles: ['admin/system.UserLog/add'],
            activeMenu: '/system/user-log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemUserLogEdit',
          component: () => import('@/views/system/user-log/edit.vue'),
          meta: {
            title: '用户日志修改',
            roles: ['admin/system.UserLog/edit'],
            activeMenu: '/system/user-log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'email-log',
      name: 'SystemEmailLog',
      redirect: 'noRedirect',
      meta: {
        roles: ['admin/system.EmailLog/list'],
        activeMenuTop: '/log',
        alwaysShow: false,
        hidden: false,
        icon: 'Message',
        keepAlive: true,
        title: '邮件日志'
      },
      children: [
        {
          path: 'list',
          name: 'SystemEmailLogList',
          component: () => import('@/views/system/email-log/list.vue'),
          meta: {
            icon: 'Message',
            title: '邮件日志',
            roles: ['admin/system.EmailLog/list'],
            activeMenuTop: '/log',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemEmailLogInfo',
          component: () => import('@/views/system/email-log/info.vue'),
          meta: {
            title: '邮件日志信息',
            roles: ['admin/system.EmailLog/info'],
            activeMenu: '/system/email-log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SystemEmailLogAdd',
          component: () => import('@/views/system/email-log/add.vue'),
          meta: {
            title: '邮件日志添加',
            roles: ['admin/system.EmailLog/add'],
            activeMenu: '/system/email-log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemEmailLogEdit',
          component: () => import('@/views/system/email-log/edit.vue'),
          meta: {
            title: '邮件日志修改',
            roles: ['admin/system.EmailLog/edit'],
            activeMenu: '/system/email-log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'sms-log',
      name: 'SystemSmsLog',
      redirect: 'noRedirect',
      meta: {
        icon: 'Iphone',
        title: '短信日志',
        roles: ['admin/system.SmsLog/list'],
        activeMenuTop: '/log',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SystemSmsLogList',
          component: () => import('@/views/system/sms-log/list.vue'),
          meta: {
            icon: 'Iphone',
            title: '短信日志',
            roles: ['admin/system.SmsLog/list'],
            activeMenuTop: '/log',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemSmsLogInfo',
          component: () => import('@/views/system/sms-log/info.vue'),
          meta: {
            title: '短信日志信息',
            roles: ['admin/system.SmsLog/info'],
            activeMenu: '/system/sms-log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SystemSmsLogAdd',
          component: () => import('@/views/system/sms-log/add.vue'),
          meta: {
            title: '短信日志添加',
            roles: ['admin/system.SmsLog/add'],
            activeMenu: '/system/sms-log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemSmsLogInfo',
          component: () => import('@/views/system/sms-log/info.vue'),
          meta: {
            title: '短信日志信息',
            roles: ['admin/system.SmsLog/info'],
            activeMenu: '/system/sms-log/list',
            activeMenuTop: '/log',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemSmsLogEdit',
          component: () => import('@/views/system/sms-log/edit.vue'),
          meta: {
            title: '短信日志修改',
            roles: ['admin/system.SmsLog/edit'],
            activeMenu: '/system/sms-log/list',
            activeMenuTop: '/log',
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
