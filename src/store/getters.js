const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  userToken: state => state.user.userToken,
  nickname: state => state.user.nickname,
  username: state => state.user.username,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  permission_routes: state => state.permission.routes,
  systemName: state => state.settings.systemName,
  faviconUrl: state => state.settings.faviconUrl,
  pageTitle: state => state.settings.pageTitle,
  logoUrl: state => state.settings.logoUrl,
  tokenName: state => state.settings.tokenName,
  tokenType: state => state.settings.tokenType
}
export default getters
