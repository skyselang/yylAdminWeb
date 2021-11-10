const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  adminToken: state => state.user.adminToken,
  nickname: state => state.user.nickname,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  systemName: state => state.settings.systemName,
  pageTitle: state => state.settings.pageTitle,
  logoUrl: state => state.settings.logoUrl,
  faviconUrl: state => state.settings.faviconUrl
}
export default getters
