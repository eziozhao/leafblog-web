const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  addRoutes: state => state.permission.addRoutes,
  permission_routes: state => state.permission.routes

}
export default getters
