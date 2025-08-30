<template>
  <div>
    <div><trendChart class="h-45" :chartData="data" /></div>

    <paginationTable :columns="columns" :data="fakeData" :pageSize="10" />
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
import { trendChart } from './comps/index';
import { paginationTable } from '@/components/index';
// 商業邏輯

// ---------------------------
interface Column {
  title: string;
  key: string;
  align: 'left' | 'center' | 'right';
  width: string;
}

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

// ----------欄位設定----------
const columns: Column[] = [
  { title: 'Coil_ID', key: 'coil_id', align: 'center', width: '10%' },
  { title: 'Time', key: 'time', align: 'center', width: '15%' },
];

// ----------假資料----------
const fakeData = [
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },

  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
];
</script>
