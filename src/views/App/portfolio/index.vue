<template>
  <div>
    <trendChart :chartData="data" />
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
import { trendChart } from './comps/index';
// 商業邏輯

// ---------------------------

// ----------區域----------
const data = {
  totalInvest: 170000,
  cashInvest: 65000,
  stockCost: 105000,
  stockValue: 110000,
  positionRatio: 0.617,
  stockProfit: 5000,
  profitRate: 4.76,
};
// -------------------------
</script>
