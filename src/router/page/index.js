export default [
  {
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    component: () => import('@/pages/error-page/404.vue'),
    meta: {
      title: '404'
    }
  },
  {
    path: '/401',
    component: () => import('@/pages/error-page/401.vue'),
    meta: {
      title: '401'
    }
  },
]