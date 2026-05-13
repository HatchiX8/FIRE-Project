<template>
  <div class="landing-shell flex min-h-dvh flex-col">
    <headerComp class="landing-header" />

    <main class="bg-background flex-1 overflow-auto p-4">
      <router-view />
    </main>

    <footerComp class="landing-footer" />
    <menuComp v-if="userStore.isLoggedIn" />
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { headerComp, footerComp, menuComp } from '@/components/index';
// 共用型別
// 元件
// 商業邏輯
// store
import { useUserStore } from '@/stores/modules/user/store';
// ---------------------------

// ----------區域-----------
const userStore = useUserStore();
// -------------------------
</script>

<style scoped>
.landing-shell {
  background: #020617;
}

.landing-shell .landing-header,
.landing-shell .landing-footer {
  background: rgba(15, 23, 42, 0.96);
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.24);
}

.landing-shell .landing-header {
  border-bottom-color: rgba(99, 102, 241, 0.32);
}

.landing-shell .landing-footer {
  border-color: rgba(99, 102, 241, 0.24);
}
</style>
