import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    // 始終平滑滾動到頂部
    return { top: 0, behavior: 'smooth' } as ScrollToOptions;
  },
  routes: [
    // 登入頁面
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
    },
    // 本頁
    {
      path: '/App',
      component: () => import('@/views/App/index.vue'),
      children: [
        {
          path: 'page1',
          component: () => import('@/views/App/page1/index.vue'),
        },
        {
          path: 'page2',
          component: () => import('@/views/App/page2/index.vue'),
        },
        {
          path: 'page3',
          component: () => import('@/views/App/page3/index.vue'),
        },
      ],
    },
    {
      path: '/Landing',
      component: () => import('@/views/Landing/index.vue'),
      children: [
        {
          path: 'page1',
          component: () => import('@/views/Landing/page1/index.vue'),
        },
        {
          path: 'page2',
          component: () => import('@/views/Landing/page2/index.vue'),
        },
        {
          path: 'page3',
          component: () => import('@/views/Landing/page3/index.vue'),
        },
        {
          path: 'page4',
          component: () => import('@/views/Landing/page4/index.vue'),
        },
      ],
    },
  ],
});

export default router;
