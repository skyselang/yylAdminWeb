const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  adminUserId: state => state.user.adminUserId,
  adminToken: state => state.user.adminToken,
  username: state => state.user.username,
  nickname: state => state.user.nickname,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
