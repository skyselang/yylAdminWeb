import Layout from '@/layout'

const member = {
  path: '/member',
  name: 'member',
  meta: {
    title: '会员管理',
    icon: 'el-icon-user',
    roles: [
      'admin/member.Member/list',
      'admin/member.Log/list',
      'admin/member.Member/stat',
      'admin/member.Log/stat'
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
        roles: ['admin/member.Member/list']
      },
      component: () => import('@/views/member/member')
    },
    {
      path: 'log',
      name: 'MemberLog',
      meta: {
        title: '会员日志',
        icon: 'el-icon-user',
        roles: ['admin/member.Log/list']
      },
      component: () => import('@/views/member/member-log')
    },
    {
      path: 'stat',
      name: 'MemberStat',
      meta: {
        title: '会员统计',
        icon: 'el-icon-user',
        roles: ['admin/member.Member/stat']
      },
      component: () => import('@/views/member/member-stat')
    },
    {
      path: 'log-stat',
      name: 'MemberLogStat',
      meta: {
        title: '会员日志统计',
        icon: 'el-icon-user',
        roles: ['admin/member.Log/stat']
      },
      component: () => import('@/views/member/member-log-stat')
    }
  ]
}
export default member
