export const Layout = () => import('@/layout/index.vue')
import { getRouteRoles } from '@/utils/index'

/**
 * 系统管理路由
 */
const routes = {
  path: '/system',
  redirect: 'noRedirect',
  component: Layout,
  meta: {
    icon: 'SetUp',
    title: '系统管理',
    roles: [],
    activeMenuTop: '/system',
    hidden: false,
    keepAlive: true,
    alwaysShow: false
  },
  children: [
    {
      path: 'setting',
      name: 'SystemSetting',
      component: () => import('@/views/system/setting/setting.vue'),
      meta: {
        icon: 'SetUp',
        title: '系统设置',
        roles: [
          'admin/system.Setting/systemInfo',
          'admin/system.Setting/captchaInfo',
          'admin/system.Setting/emailInfo',
          'admin/system.Setting/logInfo',
          'admin/system.Setting/cacheInfo',
          'admin/system.Setting/apiInfo',
          'admin/system.Setting/tokenInfo',
          'admin/system.Setting/serverInfo',
          'admin/system.UserCenter/setting'
        ],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      }
    },
    {
      path: 'user',
      name: 'SystemUser',
      redirect: 'noRedirect',
      meta: {
        icon: 'UserFilled',
        title: '用户管理',
        roles: ['admin/system.User/list'],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SystemUserList',
          component: () => import('@/views/system/user/list.vue'),
          meta: {
            title: '用户管理',
            roles: ['admin/system.User/list'],
            activeMenuTop: '/system',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemUserInfo',
          component: () => import('@/views/system/user/info.vue'),
          meta: {
            title: '用户信息',
            roles: ['admin/system.User/info'],
            activeMenu: '/system/user/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SystemUserAdd',
          component: () => import('@/views/system/user/add.vue'),
          meta: {
            title: '用户添加',
            roles: ['admin/system.User/add'],
            activeMenu: '/system/user/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemUserEdit',
          component: () => import('@/views/system/user/edit.vue'),
          meta: {
            title: '用户修改',
            roles: ['admin/system.User/edit'],
            activeMenu: '/system/user/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'role',
      name: 'SystemRole',
      redirect: 'noRedirect',
      meta: {
        icon: 'Avatar',
        title: '角色管理',
        roles: ['admin/system.Role/list'],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SystemRoleList',
          component: () => import('@/views/system/role/list.vue'),
          meta: {
            title: '角色管理',
            roles: ['admin/system.Role/list'],
            activeMenuTop: '/system',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemRoleInfo',
          component: () => import('@/views/system/role/info.vue'),
          meta: {
            title: '角色信息',
            roles: ['admin/system.Role/info'],
            activeMenu: '/system/role/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SystemRoleAdd',
          component: () => import('@/views/system/role/add.vue'),
          meta: {
            title: '角色添加',
            roles: ['admin/system.Role/add'],
            activeMenu: '/system/role/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemRoleEdit',
          component: () => import('@/views/system/role/edit.vue'),
          meta: {
            title: '角色修改',
            roles: ['admin/system.Role/edit'],
            activeMenu: '/system/role/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'menu',
      name: 'SystemMenu',
      redirect: 'noRedirect',
      meta: {
        icon: 'Menu',
        title: '菜单管理',
        roles: ['admin/system.Menu/list'],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SystemMenuList',
          component: () => import('@/views/system/menu/list.vue'),
          meta: {
            title: '菜单管理',
            roles: ['admin/system.Menu/list'],
            activeMenuTop: '/system',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemMenuInfo',
          component: () => import('@/views/system/menu/info.vue'),
          meta: {
            title: '菜单信息',
            roles: ['admin/system.Menu/info'],
            activeMenu: '/system/menu/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add/:pid?',
          name: 'SystemMenuAdd',
          component: () => import('@/views/system/menu/add.vue'),
          meta: {
            title: '菜单添加',
            roles: ['admin/system.Menu/add'],
            activeMenu: '/system/menu/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemMenuEdit',
          component: () => import('@/views/system/menu/edit.vue'),
          meta: {
            title: '菜单修改',
            roles: ['admin/system.Menu/eit'],
            activeMenu: '/system/menu/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'dept',
      name: 'SystemDept',
      redirect: 'noRedirect',
      meta: {
        icon: 'Stamp',
        title: '部门管理',
        roles: ['admin/system.Dept/list'],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SystemDeptList',
          component: () => import('@/views/system/dept/list.vue'),
          meta: {
            title: '部门管理',
            roles: ['admin/system.Dept/list'],
            activeMenuTop: '/system',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemDeptInfo',
          component: () => import('@/views/system/dept/info.vue'),
          meta: {
            title: '部门信息',
            roles: ['admin/system.Dept/info'],
            activeMenu: '/system/dept/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add/:pid?',
          name: 'SystemDeptAdd',
          component: () => import('@/views/system/dept/add.vue'),
          meta: {
            title: '部门添加',
            roles: ['admin/system.Dept/add'],
            activeMenu: '/system/dept/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemDeptEdit',
          component: () => import('@/views/system/dept/edit.vue'),
          meta: {
            title: '部门修改',
            roles: ['admin/system.Dept/edit'],
            activeMenu: '/system/dept/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'post',
      name: 'SystemPost',
      redirect: 'noRedirect',
      meta: {
        icon: 'Postcard',
        title: '职位管理',
        roles: ['admin/system.Post/list'],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SystemPostList',
          component: () => import('@/views/system/post/list.vue'),
          meta: {
            title: '职位管理',
            roles: ['admin/system.Post/list'],
            activeMenuTop: '/system',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemPostInfo',
          component: () => import('@/views/system/post/info.vue'),
          meta: {
            title: '职位信息',
            roles: ['admin/system.Post/info'],
            activeMenu: '/system/post/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add/:pid?',
          name: 'SystemPostAdd',
          component: () => import('@/views/system/post/add.vue'),
          meta: {
            title: '职位添加',
            roles: ['admin/system.Post/add'],
            activeMenu: '/system/post/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemPostEdit',
          component: () => import('@/views/system/post/edit.vue'),
          meta: {
            title: '职位修改',
            roles: ['admin/system.Post/edit'],
            activeMenu: '/system/post/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'notice',
      name: 'SystemNotice',
      redirect: 'noRedirect',
      meta: {
        icon: 'ChatLineRound',
        title: '公告管理',
        roles: ['admin/system.Notice/list'],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SystemNoticeList',
          component: () => import('@/views/system/notice/list.vue'),
          meta: {
            title: '公告管理',
            roles: ['admin/system.Notice/list'],
            activeMenuTop: '/system',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemNoticeInfo',
          component: () => import('@/views/system/notice/info.vue'),
          meta: {
            title: '公告信息',
            roles: ['admin/system.Notice/info'],
            activeMenu: '/system/notice/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SystemNoticeAdd',
          component: () => import('@/views/system/notice/add.vue'),
          meta: {
            title: '公告添加',
            roles: ['admin/system.Notice/add'],
            activeMenu: '/system/notice/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemNoticeEdit',
          component: () => import('@/views/system/notice/edit.vue'),
          meta: {
            title: '公告修改',
            roles: ['admin/system.Notice/edit'],
            activeMenu: '/system/notice/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'message',
      name: 'SystemMessage',
      redirect: 'noRedirect',
      meta: {
        icon: 'BellFilled',
        title: '消息管理',
        roles: ['admin/system.Message/list'],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SystemMessageList',
          component: () => import('@/views/system/message/list.vue'),
          meta: {
            title: '消息管理',
            roles: ['admin/system.Message/list'],
            activeMenuTop: '/system',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemMessageInfo',
          component: () => import('@/views/system/message/info.vue'),
          meta: {
            title: '消息信息',
            roles: ['admin/system.Message/info'],
            activeMenu: '/system/message/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SystemMessageAdd',
          component: () => import('@/views/system/message/add.vue'),
          meta: {
            title: '消息添加',
            roles: ['admin/system.Message/add'],
            activeMenu: '/system/message/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemMessageEdit',
          component: () => import('@/views/system/message/edit.vue'),
          meta: {
            title: '消息修改',
            roles: ['admin/system.Message/edit'],
            activeMenu: '/system/message/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'user-message',
      name: 'SystemUserMessage',
      redirect: 'noRedirect',
      meta: {
        icon: 'Bell',
        title: '用户消息',
        roles: ['admin/system.UserMessage/list'],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SystemUserMessageList',
          component: () => import('@/views/system/user-message/list.vue'),
          meta: {
            title: '用户消息',
            roles: ['admin/system.UserMessage/list'],
            activeMenuTop: '/system',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SystemUserMessageInfo',
          component: () => import('@/views/system/user-message/info.vue'),
          meta: {
            title: '用户消息信息',
            roles: ['admin/system.UserMessage/info'],
            activeMenu: '/system/user-message/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SystemUserMessageAdd',
          component: () => import('@/views/system/user-message/add.vue'),
          meta: {
            title: '用户消息添加',
            roles: ['admin/system.UserMessage/add'],
            activeMenu: '/system/user-message/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SystemUserMessageEdit',
          component: () => import('@/views/system/user-message/edit.vue'),
          meta: {
            title: '用户消息修改',
            roles: ['admin/system.UserMessage/edit'],
            activeMenu: '/system/user-message/list',
            activeMenuTop: '/system',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'apidoc',
      name: 'SystemApidoc',
      component: () => import('@/views/system/apidoc/apidoc.vue'),
      meta: {
        icon: 'Document',
        title: '接口文档',
        roles: ['admin/system.Apidoc/apidoc'],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      }
    },
    {
      path: 'user-center',
      name: 'SystemUserCenter',
      component: () => import('@/views/system/user-center/index.vue'),
      meta: {
        icon: 'User',
        title: '个人中心',
        roles: [
          'admin/system.UserCenter/info',
          'admin/system.UserCenter/edit',
          'admin/system.UserCenter/pwd',
          'admin/system.UserCenter/logList',
          'admin/system.UserCenter/messageList'
        ],
        activeMenuTop: '/system',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      }
    }
  ]
}

routes.meta.roles = getRouteRoles(routes)

export default routes
