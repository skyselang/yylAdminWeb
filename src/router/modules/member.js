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
      'admin/member.Log/stat',
      'admin/member.Member/recover'
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
        roles: ['admin/member.Member/list'],
        query: { recycle: 0 }
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
    },
    {
      path: 'member-recover',
      name: 'Member',
      meta: {
        title: '会员回收站',
        icon: 'el-icon-user',
        roles: ['admin/member.Member/recover'],
        query: { recycle: 1 }
      },
      component: () => import('@/views/member/member')
    }
  ]
}
export default member
