<template>
  <RouterView />
</template>

<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
// 商業邏輯
// store
import { useUserStore } from '@/stores/index';
// ---------------------------

// ----------初始化----------
const userStore = useUserStore();

// 每次進入頁面檢查登入狀態
onMounted(() => {
  userStore.requestLoginCheck();
});
// --------------------------
</script>
