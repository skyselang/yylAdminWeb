export const Layout = () => import('@/layout/index.vue')
import { getRouteRoles } from '@/utils/index'

/**
 * 设置管理路由
 */
const routes = {
  path: '/setting',
  redirect: 'noRedirect',
  component: Layout,
  meta: {
    icon: 'Setting',
    title: '设置管理',
    roles: [],
    activeMenuTop: '/setting',
    hidden: false,
    keepAlive: true,
    alwaysShow: false
  },
  children: [
    {
      path: 'setting',
      name: 'SettingSetting',
      component: () => import('@/views/setting/setting/setting.vue'),
      meta: {
        icon: 'Setting',
        title: '设置管理',
        roles: ['admin/setting.Setting/basicInfo', 'admin/setting.Setting/contactInfo'],
        activeMenuTop: '/setting',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      }
    },
    {
      path: 'member',
      name: 'MemberSetting',
      component: () => import('@/views/member/setting/setting.vue'),
      meta: {
        icon: 'User',
        title: '会员设置',
        roles: [
          'admin/member.Setting/basicInfo',
          'admin/member.Setting/logregInfo',
          'admin/member.Setting/thirdInfo',
          'admin/member.Setting/captchaInfo',
          'admin/member.Setting/logInfo',
          'admin/member.Setting/apiInfo',
          'admin/member.Setting/tokenInfo'
        ],
        activeMenuTop: '/setting',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      }
    },
    {
      path: 'content',
      name: 'ContentSetting',
      component: () => import('@/views/content/setting/setting.vue'),
      meta: {
        icon: 'Reading',
        title: '内容设置',
        roles: ['admin/content.Setting/basicInfo', 'admin/content.Setting/apiInfo'],
        activeMenuTop: '/setting',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      }
    },
    {
      path: 'file',
      name: 'FileSetting',
      component: () => import('@/views/file/setting/setting.vue'),
      meta: {
        icon: 'Files',
        title: '文件设置',
        roles: ['admin/file.Setting/basicInfo', 'admin/file.Setting/limitInfo', 'admin/file.Setting/apiInfo'],
        activeMenuTop: '/setting',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      }
    },
    {
      path: 'carousel',
      name: 'SettingCarousel',
      redirect: 'noRedirect',
      meta: {
        icon: 'VideoPlay',
        title: '轮播管理',
        roles: ['admin/setting.Carousel/list'],
        activeMenuTop: '/setting',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SettingCarouselList',
          component: () => import('@/views/setting/carousel/list.vue'),
          meta: {
            title: '轮播管理',
            roles: ['admin/setting.Carousel/list'],
            activeMenuTop: '/setting',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SettingCarouselInfo',
          component: () => import('@/views/setting/carousel/info.vue'),
          meta: {
            title: '轮播信息',
            roles: ['admin/setting.Carousel/info'],
            activeMenu: '/setting/carousel/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SettingCarouselAdd',
          component: () => import('@/views/setting/carousel/add.vue'),
          meta: {
            title: '轮播添加',
            roles: ['admin/setting.Carousel/add'],
            activeMenu: '/setting/carousel/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SettingCarouselEdit',
          component: () => import('@/views/setting/carousel/edit.vue'),
          meta: {
            title: '轮播修改',
            roles: ['admin/setting.Carousel/edit'],
            activeMenu: '/setting/carousel/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'notice',
      name: 'SettingNotice',
      redirect: 'noRedirect',
      meta: {
        icon: 'ChatLineRound',
        title: '通告管理',
        roles: ['admin/setting.Notice/list'],
        activeMenuTop: '/setting',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SettingNoticeList',
          component: () => import('@/views/setting/notice/list.vue'),
          meta: {
            title: '通告管理',
            roles: ['admin/setting.Notice/list'],
            activeMenuTop: '/setting',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SettingNoticeInfo',
          component: () => import('@/views/setting/notice/info.vue'),
          meta: {
            title: '通告信息',
            roles: ['admin/setting.Notice/info'],
            activeMenu: '/setting/notice/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SettingNoticeAdd',
          component: () => import('@/views/setting/notice/add.vue'),
          meta: {
            title: '通告添加',
            roles: ['admin/setting.Notice/add'],
            activeMenu: '/setting/notice/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SettingNoticeEdit',
          component: () => import('@/views/setting/notice/edit.vue'),
          meta: {
            title: '通告修改',
            roles: ['admin/setting.Notice/edit'],
            activeMenu: '/setting/notice/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'accord',
      name: 'SettingAccord',
      redirect: 'noRedirect',
      meta: {
        icon: 'Document',
        title: '协议管理',
        roles: ['admin/setting.Accord/list'],
        activeMenuTop: '/setting',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SettingAccordList',
          component: () => import('@/views/setting/accord/list.vue'),
          meta: {
            icon: 'Document',
            title: '协议管理',
            roles: ['admin/setting.Accord/list'],
            activeMenuTop: '/setting',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SettingAccordInfo',
          component: () => import('@/views/setting/accord/info.vue'),
          meta: {
            title: '协议信息',
            roles: ['admin/setting.Accord/info'],
            activeMenu: '/setting/accord/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SettingAccordAdd',
          component: () => import('@/views/setting/accord/add.vue'),
          meta: {
            title: '协议添加',
            roles: ['admin/setting.Accord/add'],
            activeMenu: '/setting/accord/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SettingLinkInfo',
          component: () => import('@/views/setting/link/info.vue'),
          meta: {
            title: '友链信息',
            roles: ['admin/setting.Link/info'],
            activeMenu: '/setting/link/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SettingAccordEdit',
          component: () => import('@/views/setting/accord/edit.vue'),
          meta: {
            title: '协议修改',
            roles: ['admin/setting.Accord/edit'],
            activeMenu: '/setting/accord/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'link',
      name: 'SettingLink',
      redirect: 'noRedirect',
      meta: {
        icon: 'Link',
        title: '友链管理',
        roles: ['admin/setting.Link/list'],
        activeMenuTop: '/setting',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SettingLinkList',
          component: () => import('@/views/setting/link/list.vue'),
          meta: {
            title: '友链管理',
            roles: ['admin/setting.Link/list'],
            activeMenuTop: '/setting',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SettingLinkInfo',
          component: () => import('@/views/setting/link/info.vue'),
          meta: {
            title: '友链信息',
            roles: ['admin/setting.Link/info'],
            activeMenu: '/setting/link/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SettingLinkAdd',
          component: () => import('@/views/setting/link/add.vue'),
          meta: {
            title: '友链添加',
            roles: ['admin/setting.Link/add'],
            activeMenu: '/setting/link/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SettingLinkEdit',
          component: () => import('@/views/setting/link/edit.vue'),
          meta: {
            title: '友链修改',
            roles: ['admin/setting.Link/edit'],
            activeMenu: '/setting/accord/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'feedback',
      name: 'SettingFeedback',
      redirect: 'noRedirect',
      meta: {
        icon: 'ChatLineRound',
        title: '反馈管理',
        roles: ['admin/setting.Feedback/list'],
        activeMenuTop: '/setting',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SettingFeedbackList',
          component: () => import('@/views/setting/feedback/list.vue'),
          meta: {
            title: '反馈管理',
            roles: ['admin/setting.Feedback/list'],
            activeMenuTop: '/setting',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SettingFeedbackInfo',
          component: () => import('@/views/setting/feedback/info.vue'),
          meta: {
            title: '反馈信息',
            roles: ['admin/setting.Feedback/info'],
            activeMenu: '/setting/feedback/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add',
          name: 'SettingFeedbackAdd',
          component: () => import('@/views/setting/feedback/add.vue'),
          meta: {
            title: '反馈添加',
            roles: ['admin/setting.Feedback/add'],
            activeMenu: '/setting/feedback/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SettingFeedbackEdit',
          component: () => import('@/views/setting/feedback/edit.vue'),
          meta: {
            title: '反馈修改',
            roles: ['admin/setting.Feedback/edit'],
            activeMenu: '/setting/feedback/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    },
    {
      path: 'region',
      name: 'SettingRegion',
      meta: {
        icon: 'MapLocation',
        title: '地区管理',
        roles: ['admin/setting.Region/list'],
        activeMenuTop: '/setting',
        hidden: false,
        keepAlive: true,
        alwaysShow: false
      },
      children: [
        {
          path: 'list',
          name: 'SettingRegionList',
          component: () => import('@/views/setting/region/list.vue'),
          meta: {
            title: '地区管理',
            roles: ['admin/setting.Region/list'],
            activeMenuTop: '/setting',
            hidden: false,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'info/:id',
          name: 'SettingRegionInfo',
          component: () => import('@/views/setting/region/info.vue'),
          meta: {
            title: '地区信息',
            roles: ['admin/setting.Region/info'],
            activeMenu: '/setting/region/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'add/:pid?',
          name: 'SettingRegionAdd',
          component: () => import('@/views/setting/region/add.vue'),
          meta: {
            title: '地区添加',
            roles: ['admin/setting.Region/add'],
            activeMenu: '/setting/region/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        },
        {
          path: 'edit/:id',
          name: 'SettingRegionEdit',
          component: () => import('@/views/setting/region/edit.vue'),
          meta: {
            title: '地区修改',
            roles: ['admin/setting.Region/edit'],
            activeMenu: '/setting/region/list',
            activeMenuTop: '/setting',
            hidden: true,
            keepAlive: true,
            alwaysShow: false
          }
        }
      ]
    }
  ]
}

routes.meta.roles = getRouteRoles(routes)

export default routes
