const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout'),
    meta: {requiresAuth: true},
    children: [
      {name: 'home', path: '/', component: () => import('pages/Index.vue')},
      {name: 'calendar', path: '/calendar', component: () => import('pages/CalendarPage')},
      {name: 'chart', path: '/chart', component: () => import('pages/ChartPage')},
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/notAuth'),
    children: [
      {name: 'auth', path: '/auth', component: () => import('pages/Auth')},
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
