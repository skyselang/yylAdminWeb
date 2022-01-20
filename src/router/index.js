import Vue from 'vue'
import Router from 'vue-router'

/* 路由模块 */
Vue.use(Router)

import constant from './modules/constant'
/* 动态路由，当路由表太长时，可以将它拆分成小模块 */
import member from './modules/member'
import cms from './modules/cms'
import file from './modules/file'
import setting from './modules/setting'
import rule from './modules/rule'
import system from './modules/system'

/**
 * 配置说明
 *
 * // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * hidden: true // (默认 false)
 *
 * // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * redirect: 'noRedirect'
 *
 * // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式
 * // 只有一个时，会将那个子路由当做根路由显示在侧边栏
 * // 若你想不管路由下面的 children 声明的个数多少都显示你的根路由
 * // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * alwaysShow: true
 *
 * // 设定路由的名字，一定要填写且与vue文件name一致，不然使用<keep-alive>时会出现各种问题
 * name: 'Index'
 * meta: {
 *   roles: ['admin/Index/index'] // 设置该路由进入的权限（菜单链接roles），支持多个权限叠加
 *   title: '控制台' // 设置该路由在侧边栏和面包屑中展示的名字
 *   icon: 'el-icon-s-home' // 设置该路由的图标，element-ui 的 icon
 *   noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 *   breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
 *   affix: true // 若果设置为true，它则会固定在tags-view中(默认 false)
 *   // 当路由设置了该属性，则会高亮相对应的侧边栏。
 *   // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
 *   // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
 *   activeMenu: '/article/list'
 * }
 */

/**
 * constantRoutes
 * 不需要动态判断权限的路由，如登录、404、401等页面
 * 所有用户都可以访问
 */
export const constantRoutes = constant

/**
 * asyncRoutes
 * 需要动态判断权限并通过 addRoutes 动态添加的页面
 * 需要分配相应权限才可以访问
 */
export const asyncRoutes = [
  // 会员管理
  member,
  // 内容管理
  cms,
  // 文件管理
  file,
  // 设置管理
  setting,
  // 权限管理
  rule,
  // 系统管理
  system,

  // 404页面，必须放在最后!!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // 去掉url中的#号，需要服务器支持
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
