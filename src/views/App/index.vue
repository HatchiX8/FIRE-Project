<template>
  <div class="app-shell text-onSurface relative flex h-dvh w-full overflow-hidden">
    <div class="app-bg-orb app-bg-orb-primary"></div>
    <div class="app-bg-orb app-bg-orb-success"></div>
    <div class="app-bg-orb app-bg-orb-danger"></div>

    <appMenu />

    <main class="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
      <appHeader />

      <section
        class="app-content-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden scroll-smooth p-3 pb-24 md:p-4 xl:p-6"
      >
        <div class="mx-auto w-full max-w-[92rem] pb-12">
          <RouterView />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useStockMetaStore, useUserStore } from '@/stores/index';
import appHeader from './comps/appHeader.vue';
import appMenu from './comps/appMenu.vue';

const userStore = useUserStore();
const stockMetaStore = useStockMetaStore();

onMounted(async () => {
  const r = await userStore.ensureMe();

  if (r.success) {
    await stockMetaStore.fetchStockMeta();
  }
});
</script>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  height: 100%;
  overflow: hidden;
}

.app-content-scrollbar {
  scrollbar-color: rgba(99, 102, 241, 0.72) rgba(255, 255, 255, 0.04);
  scrollbar-width: thin;
}

.app-content-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.app-content-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 999px;
}

.app-content-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(129, 140, 248, 0.9), rgba(99, 102, 241, 0.58));
  border: 2px solid rgba(2, 6, 23, 0.72);
  border-radius: 999px;
}

.app-content-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(165, 180, 252, 0.95), rgba(99, 102, 241, 0.78));
}

.app-bg-orb {
  position: absolute;
  z-index: 0;
  border-radius: 9999px;
  pointer-events: none;
  transform: translateZ(0);
}

.app-shell {
  background:
    radial-gradient(circle at 50% 0%, rgba(15, 23, 42, 0.24), rgba(2, 6, 23, 0.94) 46%), #01040d;
}

.app-bg-orb-primary {
  top: -18%;
  left: -5%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(99, 102, 241, 0) 68%);
  filter: blur(80px);
}

.app-bg-orb-success {
  top: 28%;
  right: -5%;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%);
  filter: blur(50px);
}

.app-bg-orb-danger {
  bottom: -15%;
  left: 15%;
  width: 640px;
  height: 640px;
  background: radial-gradient(circle, rgba(244, 63, 94, 0.14) 0%, rgba(244, 63, 94, 0) 68%);
  filter: blur(30px);
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
