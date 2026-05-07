<template>
  <aside class="app-sidebar z-20 hidden flex-shrink-0 flex-col justify-between md:flex md:w-20 xl:w-64">
    <div class="flex flex-col gap-8 p-4 xl:p-6">
      <RouterLink
        to="/App/portfolio"
        class="flex items-center justify-center gap-3 no-underline xl:justify-start"
      >
        <div class="app-logo-mark rounded-xl p-2 shadow-lg">
          <div class="i-mdi:trending-up h-6 w-6 text-white"></div>
        </div>
        <div class="hidden xl:block">
          <h1 class="text-lg font-bold leading-tight text-white">FIRE</h1>
          <p class="text-[10px] font-bold uppercase tracking-widest text-textSecondary">
            STOCKS JOURNAL
          </p>
        </div>
      </RouterLink>

      <nav class="flex flex-col gap-2">
        <RouterLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center justify-center gap-3 rounded-xl px-4 py-3 no-underline transition-all xl:justify-start"
          :class="
            isActive(item.to)
              ? 'bg-surfaceHover text-white font-bold'
              : 'text-textSecondary hover:bg-surface hover:text-white'
          "
        >
          <div :class="[item.icon, 'h-5 w-5']"></div>
          <span class="hidden text-sm font-medium xl:inline">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>

    <div class="flex flex-col gap-1 border-t border-outlineSoft p-4 xl:p-6">
      <button
        class="flex items-center justify-center gap-3 rounded-lg border-0 bg-transparent px-4 py-2 text-left text-textSecondary transition-colors hover:text-white xl:justify-start"
        @click="userLogout"
      >
        <div class="i-mdi:logout h-4 w-4"></div>
        <span class="hidden text-sm font-medium xl:inline">登出</span>
      </button>
    </div>
  </aside>

  <nav
    class="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-outline bg-surface px-4 py-3 backdrop-blur-2xl md:hidden"
  >
    <RouterLink
      v-for="item in menuItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium no-underline transition-colors"
      :class="isActive(item.to) ? 'text-primary' : 'text-textSecondary hover:text-white'"
    >
      <div :class="[item.icon, 'h-5 w-5']"></div>
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/index';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const menuItems = [
  {
    to: '/App/portfolio',
    label: '投資組合',
    icon: 'i-mdi:view-dashboard-outline',
  },
  {
    to: '/App/profitOverview',
    label: '損益總覽',
    icon: 'i-mdi:chart-line',
  },
  {
    to: '/App/userProfile',
    label: '個人資料',
    icon: 'i-mdi:account-circle-outline',
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
.app-sidebar {
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(36px);
}

.app-logo-mark {
  background: #6366f1;
  box-shadow: 0 18px 36px rgba(99, 102, 241, 0.22);
}
</style>
