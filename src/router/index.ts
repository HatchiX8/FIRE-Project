import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/index';
import { createDiscreteApi } from 'naive-ui';

const { message } = createDiscreteApi(['message']);
let authToastLock = false; // 避免同一次導航彈多次

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    // 始終平滑滾動到頂部
    return { top: 0, behavior: 'smooth' } as ScrollToOptions;
  },
  routes: [
    {
      // 空路由自動導向 /Landing/home
      path: '/',
      redirect: '/Landing/home',
    },
    // 登入頁面
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: () => import('@/views/AuthCallbackPage/index.vue'),
    },
    // 本頁
    {
      path: '/App',
      name: 'App',
      component: () => import('@/views/App/index.vue'),
      meta: { requiresAuth: true }, // ← 整個 /App 底下都需要登入
      redirect: '/App/portfolio',
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
        {
          path: 'adminPage',
          name: 'AdminPage',
          component: () => import('@/views/App/adminPage/index.vue'),
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

router.beforeEach((to, _from, next) => {
  const user = useUserStore();
  const token = user.token;

  // 已登入的使用者若進 /login，導回預設頁
  if (to.path === '/login' && token) {
    return next('/App/portfolio');
  }

  // 需要登入的頁面
  if (to.matched.some((r) => r.meta?.requiresAuth)) {
    if (!token) {
      if (!authToastLock) {
        authToastLock = true;
        message.warning('請先登入以使用此功能');
        // 解鎖，避免快速連點觸發多次
        setTimeout(() => (authToastLock = false), 800);
      }
      const from = encodeURIComponent(to.fullPath);
      return next({ path: '/Landing/home', query: { from, reason: 'auth' } });
    }
  }

  return next();
});

export default router;
