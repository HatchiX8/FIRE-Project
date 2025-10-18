<template>
  <div>
    <div><trendChart class="h-45" :chartData="portfolioStore.summaryList" /></div>
    <div class="mb-4 flex">
      <baseButton class="ml-auto" color="primary" @click="openAssetDialog">新增資產</baseButton>
    </div>

    <baseTable
      :columns="bridgedColumns"
      :data="bridgedData"
      :row-key="bridgedRowKey"
      v-model:expanded-row-keys="expanded"
      :page-size="10"
    />
  </div>
  <newAssetDialog v-model="newAssetDlgOpen" :loading="submitting" />
  <sellAssetDialog v-model="sellAssetDialogOpen" :loading="submitting" />
  <editAssetDialog v-model="editAssetDlgOpen" :loading="submitting" />
  <deleteAssetDialog v-model="deleteAssetDlgOpen" :loading="submitting" />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import { type DataTableColumns } from 'naive-ui';
// 元件
import {
  trendChart,
  newAssetDialog,
  sellAssetDialog,
  editAssetDialog,
  deleteAssetDialog,
} from './comps/index';
import { baseTable, baseButton } from '@/components/index';
import { formatPriceSmart } from '@/utils/index';
// 商業邏輯
// store
import { usePortfolioStore } from '@/stores/index';
// ---------------------------

// ----------初始化----------
const portfolioStore = usePortfolioStore();

onMounted(() => {
  portfolioStore.fetchSummaryData(); // 請求資產配置資料
});
// -------------------------

// ----------欄位設定----------
interface StockRow {
  assetId: string; // UUID
  stockId: string; // 2330
  stockName: string; // 台積電
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  marketValue: number;
  totalCost: number;
  profitRate: number; // 3.16
  created_at: string;
  updated_at: string;
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
    title: '市價/持有均價',
    key: 'currentPrice', // key 可以對應一個欄位，但顯示內容自訂
    align: 'center',
    minWidth: 20,
    render: (row: StockRow): string =>
      `${formatPriceSmart(row.currentPrice)} / ${formatPriceSmart(row.buyPrice)}`,
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
          h('div', `建倉日期：${row.created_at}`),
          h('div', `最後一筆更新日期：${row.updated_at}`),
          h('div', `備註：${row.note ?? '-'}`),
          h(
            baseButton,
            {
              class: 'w-20',
              size: 'small',
              color: 'primary',
              onClick: () => openSellAssetDialog(row.stockId),
            },
            { default: () => '賣出' }
          ),
        ]),

        h('div', { class: 'mt-2 ml-auto flex flex-col gap-4' }, [
          h(
            baseButton,
            { size: 'small', color: 'success', onClick: () => openEditAssetDialog(row.stockId) },
            { default: () => '編輯備註' }
          ),
          h(
            baseButton,
            { size: 'small', color: 'danger', onClick: () => openDeleteAssetDialog(row.stockId) },
            { default: () => '刪除資產' }
          ),
        ]),
      ]),
  },
];

// ----------假資料----------
// const data = {
//   totalInvest: 170000,
//   cashInvest: 65000,
//   stockCost: 105000,
//   stockValue: 110000,
//   positionRatio: 0.617,
//   stockProfit: 5000,
//   profitRate: 4.76,
// };

const fakeData: StockRow[] = [
  {
    assetId: 'UUID-2330',
    stockId: '2330',
    stockName: '台積電',
    quantity: 100,
    buyPrice: 580,
    currentPrice: 600.5,
    marketValue: 60000,
    totalCost: 58162,
    profitRate: 3.16,
    created_at: '2025/08/11',
    updated_at: '2025/08/11',
    note: '跌破月線停損停利',
  },
  {
    assetId: 'UUID-0050',
    stockId: '0050',
    stockName: '元大台灣50',
    quantity: 100,
    buyPrice: 580,
    currentPrice: 600,
    marketValue: 60000,
    totalCost: 58162,
    profitRate: 3.16,
    created_at: '2025/08/11',
    updated_at: '2025/08/11',
    note: '跌破月線停損停利',
  },
  {
    assetId: 'UUID-00638L',
    stockId: '00638L',
    stockName: '台灣50',
    quantity: 100,
    buyPrice: 580,
    currentPrice: 600,
    marketValue: 60000,
    totalCost: 58162,
    profitRate: -3.16,
    created_at: '2025/08/11',
    updated_at: '2025/08/11',
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

// ----------新增資產----------
const submitting = ref(false); // 提交狀態

const openAssetDialog = () => {
  newAssetDlgOpen.value = true;
};

const newAssetDlgOpen = ref(false);
// ---------------------------

// ----------賣出資產----------
const openSellAssetDialog = (stockId: string) => {
  console.log('觸發點擊，ID為:', stockId);
  sellAssetDialogOpen.value = true;
};

const sellAssetDialogOpen = ref(false);
// ---------------------------

// ----------編輯資產----------
const editAssetDlgOpen = ref(false);

const openEditAssetDialog = (stockId: string) => {
  console.log('觸發點擊，ID為:', stockId);
  editAssetDlgOpen.value = true;
};
// ---------------------------

// ----------刪除資產----------
const deleteAssetDlgOpen = ref(false);

const openDeleteAssetDialog = (stockId: string) => {
  console.log('觸發點擊，ID為:', stockId);
  deleteAssetDlgOpen.value = true;
};
// ---------------------------
</script>
