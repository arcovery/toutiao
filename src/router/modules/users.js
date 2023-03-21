export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/chat/index.vue'),
        meta: {
          keepAlive: true, // 此组件要被缓存
        },
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/Video/VideoView.vue'),
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/HomeView.vue'),
        meta: {
          keepAlive: true, // 此组件要被缓存
        },
      },
      {
        path: '/mine',
        name: 'mine',
        component: () => import('@/views/Mine/index.vue'),
        meta: {
          isLogin: true,
        },
      },
    ],
  },

  {
    path: '/mine/editor',
    name: 'editor',
    component: () => import('@/views/Mine/editor.vue'),
    meta: {
      isLogin: true,
    },
  },
  {
    path: '/article/:article_id',
    name: 'article',
    component: () => import('@/views/article/index.vue'),
    meta: {
      isLogin: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginView.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/index.vue'),
    meta: {
      keepAlive: true, // 此组件要被缓存
    },
  },
]
