<template>
  <div>
    <div><trendChart class="h-45" :chartData="data" /></div>

    <baseTable
      :columns="bridgedColumns"
      :data="bridgedData"
      :row-key="bridgedRowKey"
      v-model:expanded-row-keys="expanded"
      :page-size="10"
    />
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import type { DataTableColumns } from 'naive-ui';
// 元件
import { trendChart } from './comps/index';
import { baseTable, baseButton } from '@/components/index';
// 商業邏輯
// ---------------------------

// ----------欄位設定----------
interface StockRow {
  assetId: string; // UUID
  stockId: string; // 2330
  stockName: string; // 台積電
  quantity: number;
  currentPrice: number;
  marketValue: number;
  totalCost: number;
  profitRate: number; // 3.16
  note?: string;
}

const columns: DataTableColumns<StockRow> = [
  {
    title: '股票名稱',
    key: 'stockName',
    align: 'center',
    minWidth: 40,
    render: (row: StockRow) => row.stockName,
  },
  {
    title: '市價',
    key: 'currentPrice', // key 可以對應一個欄位，但顯示內容自訂
    align: 'center',
    minWidth: 20,
    render: (row) => row.currentPrice.toFixed(2),
  },
  {
    title: '股數',
    key: 'quantity', // key 可以對應一個欄位，但顯示內容自訂
    align: 'center',
    minWidth: 20,
  },
  {
    title: '損益(%)',
    key: 'profitRate', // key 可以對應一個欄位，但顯示內容自訂
    align: 'center',
    minWidth: 20,
    render: (row) => {
      const cls =
        row.profitRate > 0
          ? 'text-danger'
          : row.profitRate < 0
            ? 'text-success'
            : 'text-neutral_300';
      return h('span', { class: cls }, `${row.profitRate.toFixed(2)}%`);
    },
  },
  {
    type: 'expand',
    width: 56,
    renderExpand: (row) =>
      h('div', { class: ' flex' }, [
        h('div', { class: 'mt-2 flex flex-col gap-2 p-3 text-left' }, [
          h('div', `總市值：${row.marketValue.toLocaleString()}`),
          h('div', `總成本：${row.totalCost.toLocaleString()}`),
          h('div', `備註：${row.note ?? '-'}`),
          h(
            baseButton,
            {
              size: 'small',
              color: 'primary',
              class: 'w-20',
              onClick: () => openDialog(row.stockId),
            },
            { default: () => '庫存明細' }
          ),
        ]),

        h('div', { class: 'mt-2 ml-auto flex flex-col gap-4' }, [
          h(
            baseButton,
            { size: 'small', color: 'success', onClick: () => openDialog(row.stockId) },
            { default: () => '編輯備註' }
          ),
          h(
            baseButton,
            { size: 'small', color: 'danger', onClick: () => openDialog(row.stockId) },
            { default: () => '刪除資產' }
          ),
        ]),
      ]),
  },
];

// ----------假資料----------
const data = {
  totalInvest: 170000,
  cashInvest: 65000,
  stockCost: 105000,
  stockValue: 110000,
  positionRatio: 0.617,
  stockProfit: 5000,
  profitRate: 4.76,
};

const fakeData: StockRow[] = [
  {
    assetId: 'UUID-2330',
    stockId: '2330',
    stockName: '台積電',
    quantity: 100,
    currentPrice: 600,
    marketValue: 60000,
    totalCost: 58162,
    profitRate: 3.16,
    note: '跌破月線停損停利',
  },
  {
    assetId: 'UUID-0050',
    stockId: '0050',
    stockName: '元大台灣50',
    quantity: 100,
    currentPrice: 600,
    marketValue: 60000,
    totalCost: 58162,
    profitRate: 3.16,
    note: '跌破月線停損停利',
  },
  {
    assetId: 'UUID-00638L',
    stockId: '00638L',
    stockName: '台灣50',
    quantity: 100,
    currentPrice: 600,
    marketValue: 60000,
    totalCost: 58162,
    profitRate: -3.16,
    note: '跌破月線停損停利',
  },
];

const expanded = ref<Array<string | number>>([]);
// ----------斷言----------
/** ✅ 這三個是「橋接變數」，把 TS 斷言放到 script */
const bridgedColumns = columns as unknown as DataTableColumns<Record<string, unknown>>;

const bridgedData = fakeData as unknown as Record<string, unknown>[];

const bridgedRowKey = (row: Record<string, unknown>) => (row as unknown as StockRow).assetId;
// ------------------------

const openDialog = (stockId: string) => {
  // 打開對話框的邏輯
  console.log('觸發點擊，ID為:', stockId);
};
</script>
