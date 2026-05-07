<template>
  <header
    class="app-header z-20 flex items-center justify-between px-4 py-3 md:justify-end md:px-6 xl:px-8 xl:py-4"
  >
    <button
      class="mobile-logout-btn flex h-10 w-10 items-center justify-center rounded-full border bg-transparent transition-colors md:hidden"
      type="button"
      aria-label="登出"
      @click="userLogout"
    >
      <div class="i-mdi:logout h-5 w-5"></div>
    </button>

    <div class="hidden min-w-0 items-center gap-6" aria-hidden="true">
      <div class="group relative">
        <div
          class="i-mdi:magnify absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary transition-colors group-focus-within:text-primary"
        ></div>
        <input
          type="text"
          placeholder="搜尋股票、交易紀錄..."
          class="w-80 rounded-xl border border-outlineSoft bg-surface py-2 pl-10 pr-4 text-sm text-textColor outline-none transition-all placeholder:text-textMuted focus:border-primaryOutline focus:bg-surfaceHover focus:ring-1 focus:ring-primaryOutline"
        />
      </div>

      <nav class="flex gap-8 text-sm font-medium">
        <RouterLink
          v-for="item in topNavItems"
          :key="item.to"
          :to="item.to"
          class="border-b-2 py-1 no-underline transition-all"
          :class="
            isActive(item.to)
              ? 'border-primary text-primary'
              : 'border-transparent text-textSecondary hover:text-white'
          "
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>

    <RouterLink
      to="/App/userProfile"
      class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-outlineStrong bg-backgroundMuted text-primary no-underline transition-colors hover:border-primaryOutline hover:text-white"
    >
      <div class="i-mdi:account h-6 w-6"></div>
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/index';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const topNavItems = [
  {
    to: '/App/portfolio',
    label: '投資組合',
  },
  {
    to: '/App/profitOverview',
    label: '損益總覽',
  },
  {
    to: '/App/userProfile',
    label: '個人資料',
  },
] as const;

const isActive = (path: string) => route.path === path;

const userLogout = async () => {
  const res = await userStore.requestLogout('manual');
  if (!res.success) {
    return;
  }

  router.push('/Landing/home');
};
</script>

<style scoped>
.app-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
}

.mobile-logout-btn {
  border-color: rgba(99, 102, 241, 0.28);
  color: #818cf8;
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.06), 0 14px 32px rgba(99, 102, 241, 0.12);
}

.mobile-logout-btn:hover {
  border-color: rgba(99, 102, 241, 0.45);
  color: #ffffff;
  background: rgba(99, 102, 241, 0.08);
}
</style>
