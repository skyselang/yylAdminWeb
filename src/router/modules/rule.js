import Layout from '@/layout'

const rule = {
  path: '/admin/rule',
  name: 'AdminRule',
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
      name: 'AdminMenu',
      meta: {
        title: '菜单管理',
        icon: 'el-icon-lock',
        roles: ['admin/admin.Menu/list']
      },
      component: () => import('@/views/admin/menu/menu')
    },
    {
      path: 'role',
      name: 'AdminRole',
      meta: {
        title: '角色管理',
        icon: 'el-icon-lock',
        roles: ['admin/admin.Role/list']
      },
      component: () => import('@/views/admin/role/role')
    },
    {
      path: 'user',
      name: 'AdminUser',
      meta: {
        title: '用户管理',
        icon: 'el-icon-lock',
        roles: ['admin/admin.User/list']
      },
      component: () => import('@/views/admin/user/user')
    },
    {
      path: 'user-log',
      name: 'AdminUserLog',
      meta: {
        title: '用户日志',
        icon: 'el-icon-lock',
        roles: ['admin/admin.UserLog/list']
      },
      component: () => import('@/views/admin/user/user-log')
    },
    {
      path: 'user-center',
      name: 'AdminUserCenter',
      meta: {
        title: '个人中心',
        icon: 'el-icon-lock',
        roles: ['admin/admin.UserCenter/info']
      },
      component: () => import('@/views/admin/user/user-center')
    },
    {
      path: 'user-log-stat',
      name: 'AdminUserLogStat',
      meta: {
        title: '用户日志统计',
        icon: 'el-icon-lock',
        roles: ['admin/admin.UserLog/stat']
      },
      component: () => import('@/views/admin/user/user-log-stat')
    }
  ]
}
export default rule
