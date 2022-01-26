import Layout from '@/layout'

const adminAuth = {
  path: '/auth',
  name: 'AuthRule',
  meta: {
    title: '权限管理',
    icon: 'el-icon-lock',
    roles: [
      'admin/admin.Menu/list',
      'admin/admin.Role/list',
      'admin/admin.User/list',
      'admin/admin.UserLog/list',
      'admin/admin.UserLog/stat',
      'admin/admin.UserCenter/info'
    ]
  },
  redirect: 'noRedirect',
  component: Layout,
  alwaysShow: true,
  children: [
    {
      path: 'menu',
      name: 'AuthMenu',
      meta: {
        title: '菜单管理',
        icon: 'el-icon-menu',
        roles: ['admin/admin.Menu/list']
      },
      component: () => import('@/views/admin/auth/menu')
    },
    {
      path: 'role',
      name: 'AuthRole',
      meta: {
        title: '角色管理',
        icon: 'el-icon-s-custom',
        roles: ['admin/admin.Role/list']
      },
      component: () => import('@/views/admin/auth/role')
    },
    {
      path: 'user',
      name: 'AuthUser',
      meta: {
        title: '用户管理',
        icon: 'el-icon-user-solid',
        roles: ['admin/admin.User/list']
      },
      component: () => import('@/views/admin/auth/user')
    },
    {
      path: 'user-log',
      name: 'AuthUserLog',
      meta: {
        title: '用户日志',
        icon: 'el-icon-notebook-1',
        roles: ['admin/admin.UserLog/list']
      },
      component: () => import('@/views/admin/auth/user-log')
    },
    {
      path: 'user-log-stat',
      name: 'AuthUserLogStat',
      meta: {
        title: '用户日志统计',
        icon: 'el-icon-notebook-2',
        roles: ['admin/admin.UserLog/stat']
      },
      component: () => import('@/views/admin/auth/user-log-stat')
    },
    {
      path: 'user-center',
      name: 'AuthUserCenter',
      meta: {
        title: '个人中心',
        icon: 'el-icon-user',
        roles: ['admin/admin.UserCenter/info']
      },
      component: () => import('@/views/admin/auth/user-center')
    }
  ]
}
export default adminAuth
