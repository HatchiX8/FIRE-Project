<template>
  <div class="flex min-h-dvh flex-col">
    <headerComp />

    <main class="bg-background flex-1 overflow-auto p-4">
      <router-view />
    </main>

    <footerComp />
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
