<template>
  <div class="text-textColor">
    <div class="mb-4"><trendChart class="h-70" :chartData="data" /></div>
    <div class="flex justify-between">
      <baseButton color="primary">資金投入/提領</baseButton>
      <div class="flex items-center">
        <baseButton color="primary"><div class="i-mdi:chevron-left"></div></baseButton>
        <div class="mx-2 text-center">
          <p>8月歷史</p>
          <p>交易紀錄</p>
        </div>

        <baseButton color="primary"><div class="i-mdi:chevron-right"></div></baseButton>
      </div>

      <baseButton color="primary">新增資產</baseButton>
    </div>
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
import { trendChart } from './comps/index';
import { baseButton } from '@/components/index';
// 商業邏輯

// ---------------------------

// ----------區域----------
const data = {
  date: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  countW: [150, 200, 170, 250, 300, 220, 180, 160, 140, 120, 130, 150],
  countG: [120, 180, 160, 240, 290, 210, 190, 170, 150, 130, 140, 160],
  countR: [100, 160, 140, 220, 270, 200, 180, 160, 140, 120, 130, 150],
  countY: [80, 140, 120, 200, 250, 190, 170, 150, 130, 110, 120, 140],
  all_Count: [650, 820, 710, 930, 1110, 1010, 900, 800, 700, 600, 650, 720],
};
// -------------------------
</script>
