<template>
  <div class="relative flex h-dvh w-full overflow-hidden bg-background text-onSurface">
    <div class="app-bg-orb app-bg-orb-primary"></div>
    <div class="app-bg-orb app-bg-orb-success"></div>
    <div class="app-bg-orb app-bg-orb-danger"></div>

    <aside
      class="z-20 hidden flex-shrink-0 flex-col justify-between border-r border-outlineSoft bg-surface backdrop-blur-3xl md:flex md:w-20 xl:w-64"
    >
      <div class="flex flex-col gap-8 p-4 xl:p-6">
        <RouterLink
          to="/App/portfolio"
          class="flex items-center justify-center gap-3 no-underline xl:justify-start"
        >
          <div class="rounded-xl bg-primary p-2 shadow-lg shadow-primary/20">
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

    <main class="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
      <header
        class="z-20 flex items-center justify-end border-b border-outline bg-surface px-4 py-3 backdrop-blur-xl md:px-6 xl:px-8 xl:py-4"
      >
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

      <section
        class="relative flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 scroll-smooth md:p-6 xl:p-10"
      >
        <div class="mx-auto w-full max-w-7xl pb-12">
          <RouterView />
        </div>
      </section>
    </main>

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
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useStockMetaStore, useUserStore } from '@/stores/index';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const stockMetaStore = useStockMetaStore();

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
    to: '/App/adminPage',
    label: '管理頁面',
    icon: 'i-mdi:shield-account-outline',
  },
] as const;

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

onMounted(async () => {
  const r = await userStore.ensureMe();

  if (r.success) {
    await stockMetaStore.fetchStockMeta();
  }
});

const userLogout = async () => {
  const res = await userStore.requestLogout('manual');
  if (!res.success) {
    return;
  }

  router.push('/Landing/home');
};
</script>

<style scoped>
.app-bg-orb {
  position: absolute;
  z-index: 0;
  border-radius: 9999px;
  pointer-events: none;
  filter: blur(90px);
  transform: translateZ(0);
}

.app-bg-orb-primary {
  top: -22%;
  left: -12%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(99, 102, 241, 0) 68%);
}

.app-bg-orb-success {
  top: 28%;
  right: -10%;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%);
}

.app-bg-orb-danger {
  bottom: -14%;
  left: 18%;
  width: 440px;
  height: 440px;
  background: radial-gradient(circle, rgba(244, 63, 94, 0.14) 0%, rgba(244, 63, 94, 0) 68%);
}

@media (max-width: 767px) {
  .app-bg-orb {
    filter: blur(70px);
  }

  .app-bg-orb-primary {
    width: 420px;
    height: 420px;
  }

  .app-bg-orb-success {
    width: 360px;
    height: 360px;
  }

  .app-bg-orb-danger {
    width: 320px;
    height: 320px;
  }
}
</style>
