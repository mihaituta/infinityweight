const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout'),
    meta: {requiresAuth: true},
    children: [
      {path: '/', component: () => import('pages/Index.vue')},
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/notAuth'),
    children: [
      {path: '/auth', component: () => import('pages/Auth')},
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
