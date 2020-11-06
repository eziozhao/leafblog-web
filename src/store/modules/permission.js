import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// 判断是否有权限访问该菜单
function hasPermission(menus, route) {
  if (route.name) {
    const currMenu = getMenu(route.name, menus)
    if (currMenu != null) {
      if (currMenu.hidden != null) {
        route.hidden = currMenu.hidden !== 0
      }
      return true
    } else {
      if (route.hidden !== undefined && route.hidden === true) {
        return true
      } else {
        return false
      }
    }
  } else {
    return true
  }
}

// 根据路由名称获取菜单
function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i]
    if (name === menu.name) {
      return menu
    }
  }
  return null
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, data) {
    return new Promise(resolve => {
      const { menus } = data
      const { username } = data
      const accessedRouters = asyncRoutes.filter(v => {
        if (username === 'admin') return true
        if (hasPermission(menus, v)) {
          if (v.children && v.children.length > 0) {
            if (v.children.length === 1) {
              return v
            }
            v.children = v.children.filter(child => {
              if (hasPermission(menus, child)) {
                return child
              }
              return false
            })
            return v
          } else {
            return v
          }
        }
        return false
      })
      commit('SET_ROUTES', accessedRouters)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
