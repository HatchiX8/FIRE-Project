<template>
  <div class="bg-backgroundSurface border-b-primaryActive border-b border-solid">
    <div class="flex items-center justify-between">
      <a href="/Landing/page1" class="flex items-center no-underline">
        <h1 class="text-primary flex items-center text-xl font-bold">
          <img
            src="/src/assets/images/FIRE-logo.png"
            alt="FIRE 投資版記帳APP"
            class="mr-2 h-12 w-12"
          />
          FIRE
        </h1>
      </a>
      <baseButton
        v-if="!userStore.isLoggedIn"
        color="primary"
        class="text-4 mr-2"
        ghost
        @click="userLogin"
        >登入</baseButton
      >
      <a
        v-else
        href="#"
        class="text-6 text-primary hover:text-primaryHover mr-4"
        @click="userStore.logout"
        ><div class="i-mdi:login-variant"></div
      ></a>
      <!-- <baseButton color="primary" class="mr-2" ghost><div class="i-mdi:logout"></div></baseButton> -->
    </div>
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
import { baseButton } from '@/components/index';
// 商業邏輯
// store
import { useUserStore, useStockMetaStore } from '@/stores/index';
// ---------------------------

// ----------初始化-----------
const userStore = useUserStore();
const stockMetaStore = useStockMetaStore();

const userLogin = async () => {
  const res = await userStore.requestLogin();
  if (!res.success) {
    // 這裡可以根據需求做錯誤提示或重導
    return;
  }
  console.log('API:登入成功', res);
  await stockMetaStore.fetchStockMeta();
};
// ---------------------------
</script>
