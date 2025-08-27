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
          path: 'portfolio',
          name: 'Portfolio',
          component: () => import('@/views/App/portfolio/index.vue'),
        },
        {
          path: 'profitOverview',
          name: 'ProfitOverview',
          component: () => import('@/views/App/profitOverview/index.vue'),
        },
        {
          path: 'userProfile',
          name: 'UserProfile',
          component: () => import('@/views/App/userProfile/index.vue'),
        },
      ],
    },
    {
      path: '/Landing',
      component: () => import('@/views/Landing/index.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/Landing/home/index.vue'),
        },
        {
          path: 'developerGuide',
          name: 'DeveloperGuide',
          component: () => import('@/views/Landing/developerGuide/index.vue'),
        },
        {
          path: 'usageNotes',
          name: 'UsageNotes',
          component: () => import('@/views/Landing/usageNotes/index.vue'),
        },
      ],
    },
  ],
});

export default router;
