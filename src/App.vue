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

// --------------------------
</script>
