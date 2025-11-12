<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <RouterView />
  </NConfigProvider>
</template>

<script setup lang="ts">
// ----------import----------
// 套件
import { NConfigProvider, darkTheme } from 'naive-ui';
// 共用型別
// 元件
// 商業邏輯
import { themeColors } from '@/utils/index';
// store
import { useUserStore } from '@/stores/index';
// ---------------------------

// ----------初始化----------
const { primary, primaryHover, primaryActive } = themeColors.colors;

const themeOverrides = {
  common: {
    primaryColor: primary,
    primaryColorHover: primaryHover,
    primaryColorPressed: primaryActive,
  },
};
const userStore = useUserStore();

// 每次進入頁面檢查登入狀態
onMounted(() => {
  userLoginCheck();
});

const userLoginCheck = async () => {
  const res = await userStore.requestLoginCheck();
  if (!res.success) {
    // 這裡可以根據需求做錯誤提示或重導

    return;
  }

  console.log('API:登入驗證成功', res);
};
// --------------------------
</script>
