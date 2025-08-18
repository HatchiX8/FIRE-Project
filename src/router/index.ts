import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
   scrollBehavior() {
    // 始終平滑滾動到頂部
    return { top: 0, behavior: 'smooth' } as ScrollToOptions
  },
  routes: [
    // 登入頁面
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
    },
    // 場域選擇頁面
    {
      path: '/areaSelect',
      component: () => import('@/views/AreaSelect/index.vue'),
    },
    // 場域頁面
    {
      path: '/areaPage',
      component: () => import('@/views/AreaPage/index.vue'),
      children: [
        {
          path: 'W68',
          component: () => import('@/views/AreaPage/W68/index.vue'),
        },
        {
          path: 'Y48',
          component: () => import('@/views/AreaPage/Y48/index.vue'),
        },
        {
          path: 'Y5',
          component: () => import('@/views/AreaPage/Y5/index.vue'),
        },
      ],
    },
  ],
});

export default router;
