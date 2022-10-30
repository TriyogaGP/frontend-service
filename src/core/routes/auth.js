export default [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/LoginUser',
    name: 'LoginUser',
    component: () => import('@/views/LoginUser.vue')
  },
  {
    path: '/forgotpass/:siteLogin',
    name: 'ForgotPass',
    component: () => import('@/views/ForgotPass.vue')
  },
  {
    path: '/undercontruction',
    name: 'UnderContruction',
    component: () => import('@/views/UnderContruction.vue')
  },
]
