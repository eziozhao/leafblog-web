import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: { title: '文章管理', icon: 'article' },
    children: [{
      path: 'list',
      name: 'List',
      component: () => import('@/views/article/index'),
      meta: { title: '文章列表', icon: 'list' }
    },
    {
      path: 'publish',
      name: 'Publish',
      component: () => import('@/views/article/publish'),
      meta: { title: '发表文章', icon: 'publish' }
    },
    {
      path: 'category',
      name: 'Category',
      component: () => import('@/views/article/category'),
      meta: { title: '分类列表', icon: 'category' }
    },
    {
      path: 'bin',
      name: 'Bin',
      component: () => import('@/views/article/bin'),
      meta: { title: '回收站', icon: 'bin' }
    },
    {
      path: 'detail/:id(\\d+)',
      name: 'ArticleDetail',
      component: () => import('@/views/article/ArticleDetail'),
      meta: { title: '文章详情', activeMenu: '/article/list' },
      hidden: true
    },
    {
      path: 'edit/:id(\\d+)',
      name: 'Publish',
      component: () => import('@/views/article/publish'),
      meta: { title: '修改文章', activeMenu: '/article/list' },
      hidden: true
    }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/user',
    name: 'Auth',
    meta: { title: '权限管理', icon: 'auth' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/auth/user'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/auth/role'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'resource',
        name: 'Resource',
        component: () => import('@/views/auth/resource'),
        meta: { title: '资源管理', icon: 'resource' }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    name: 'Log',
    redirect: '/log/log-list',
    children: [{
      path: 'log-list',
      name: 'LogList',
      component: () => import('@/views/log/index'),
      meta: { title: '日志管理', icon: 'log' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
