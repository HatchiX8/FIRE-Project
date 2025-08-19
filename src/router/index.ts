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
      path: '/Home',
      component: () => import('@/views/Home/index.vue'),
      children: [
        {
          path: 'page1',
          component: () => import('@/views/Home/page1/index.vue'),
        },
        {
          path: 'page2',
          component: () => import('@/views/Home/page2/index.vue'),
        },
        {
          path: 'page3',
          component: () => import('@/views/Home/page3/index.vue'),
        },
      ],
    },
  ],
});

export default router;
