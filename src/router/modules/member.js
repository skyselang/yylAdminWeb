import Layout from '@/layout'

const member = {
  path: '/member',
  name: 'member',
  meta: {
    title: '会员管理',
    icon: 'el-icon-user',
    roles: [
      'admin/Member/list',
      'admin/MemberLog/list',
      'admin/Member/stat',
      'admin/MemberLog/stat'
    ]
  },
  redirect: 'noRedirect',
  component: Layout,
  alwaysShow: true,
  children: [
    {
      path: 'member',
      name: 'Member',
      meta: {
        title: '会员管理',
        icon: 'el-icon-user',
        roles: ['admin/Member/list']
      },
      component: () => import('@/views/member/member')
    },
    {
      path: 'member-log',
      name: 'MemberLog',
      meta: {
        title: '会员日志',
        icon: 'el-icon-user',
        roles: ['admin/MemberLog/list']
      },
      component: () => import('@/views/member/member-log')
    },
    {
      path: 'member-stat',
      name: 'MemberStat',
      meta: {
        title: '会员统计',
        icon: 'el-icon-user',
        roles: ['admin/Member/stat']
      },
      component: () => import('@/views/member/member-stat')
    },
    {
      path: 'member-log-stat',
      name: 'MemberLogStat',
      meta: {
        title: '会员日志统计',
        icon: 'el-icon-user',
        roles: ['admin/MemberLog/stat']
      },
      component: () => import('@/views/member/member-log-stat')
    }
  ]
}
export default member
