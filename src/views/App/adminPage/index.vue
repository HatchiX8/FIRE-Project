<template>
  <div class="md:(px-4 mx-auto) max-w-6xl">
    <upgradeTable :tableData="adminPageStore.upgradeList" />
    <memberTable />
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
import upgradeTable from './comps/upgradeTable.vue';
import memberTable from './comps/memberTable.vue';
// 商業邏輯
// store
import { useAdminPageStore } from '@/stores/modules/adminPage/store';
// ---------------------------

// ----------初始化-----------
const adminPageStore = useAdminPageStore();

const requestUserUpgradeList = async () => {
  await adminPageStore.fetchUserUpgradeList();
};

onMounted(async () => {
  await requestUserUpgradeList();
  console.log('檢視表格資料', adminPageStore.upgradeList);
});
// -------------------------
</script>
