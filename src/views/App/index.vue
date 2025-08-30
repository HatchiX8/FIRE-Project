<template>
  <div class="flex min-h-dvh flex-col">
    <headerComp />

    <main class="bg-background flex-1 overflow-auto p-4">
      <router-view />
    </main>

    <menuComp />
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { headerComp, menuComp } from '@/components/index';
// 共用型別
// 元件
// 商業邏輯

// ---------------------------

// ----------區域----------
// -------------------------
</script>
