export const Layout = () => import('@/layout/index.vue')

/**
 * 路由配置项
 * path: '/member',                  // 路由地址，一级需在前面添加/
 * name: 'Member',                   // 路由名字，keepAlive: true时必填
 * redirect: noRedirect,             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * component: Layout,                // 组件
 * meta : {
 *  icon: 'User',                    // 路由图标，element-plus 图标
 *  title: '会员管理',                // 路由标题，路由在侧边栏和面包屑中展示的名字
 *  roles: ['admin/member/list']     // 访问路由的权限标识
 *  activeMenu: '/member/member',    // 当路由设置了该属性，则会高亮相对应的侧边栏，如编辑页需要高亮列表页
 *  activeMenuTop: '/member',        // 当路由设置了该属性，则会高亮相对应的顶部菜单
 *  hidden: true,                    // 当设置 true 的时候该路由不会再侧边栏出现 如401，login，编辑页面/edit/1
 *  keepAlive: true,                 // 如果设置为true，则会被 <keep-alive> 缓存
 *  alwaysShow: true                 // 当一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式
 *                                      只有一个时，会将那个子路由当做根路由显示在侧边栏
 *                                      若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                      你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * }
 */

/**
 * 前端路由
 * 在 src/settings 开启前端路由配置 frontRouter:true，开启后由前端维护路由
 * 在 src/router/modules/ 下根据路由配置项配置路由文件
 * 在此引入配置路由文件
 */
import member from '@/router/modules/member'
import content from '@/router/modules/content'
import file from '@/router/modules/file'
import log from '@/router/modules/log'
import setting from '@/router/modules/setting'
import system from '@/router/modules/system'

const frontRoutes = [member, content, file, log, setting, system]

export default frontRoutes
