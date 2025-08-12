const defaultSettings = {
  systemName: 'yylAdmin',
  pageTitle: '',
  faviconUrl: '',
  logoUrl: '',
  loginBgUrl: '',
  loginBgColor: '#f0f2f5',
  tokenType: 'header',
  tokenName: 'AdminToken',
  timeout: 60,
  sidebarLogo: true,
  sidebarName: true,
  fixedHeader: true,
  tagsView: true,
  watermarkEnabled: 0,
  watermarkContent: '',
  storePrefix: import.meta.env.VITE_APP_STORE_PREFIX || 'admin_', // 本地存储前缀
  size: 'default', // 组件大小：large大、default默认、small小
  layout: 'left', // 导航模式：left、top、mix
  theme: 'light', // 主题模式：light明亮，dark暗黑
  themeColor: '#409EFF', // 主题颜色
  sidebarColor: 'white', // 侧边栏颜色: blue经典蓝、white极简白
  pageLimit: 15, // 分页每页默认数量，从分页每页数量选项中选取
  pageLimits: [10, 12, 15, 18, 20, 30, 50, 80, 100, 150, 200, 300, 500, 800, 1000], // 分页每页数量选项
  language: 'zh-cn', // 语言：zh-cn中文，en英文
  addEditDialog: true, // 添加修改是否弹窗方式，true对话框弹窗，false新标签页面
  frontRouter: true // 是否开启前端路由，true前端静态路由，false后端动态路由
}

export default defaultSettings
