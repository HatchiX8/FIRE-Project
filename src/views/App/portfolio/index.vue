<template>
  <div>
    <loadingAreaOverlay :loadingId="portfolioStore.summaryLoading">
      <div>
        <trendChart
          v-show="!isSummaryLoading"
          class="h-45"
          :chartData="portfolioStore.summaryList"
        />
      </div>
      <div v-if="isSummaryLoading" class="my-20"></div>
    </loadingAreaOverlay>

    <div v-show="!isHoldingsLoading && !isSummaryLoading" class="flex">
      <baseButton class="ml-auto" color="primary" @click="openAssetDialog">新增資產</baseButton>
    </div>

    <loadingAreaOverlay :loadingId="portfolioStore.holdingsLoading" class="px-0">
      <baseTable
        v-if="!isHoldingsLoading && !isSummaryLoading"
        :columns="bridgedColumns"
        :data="bridgedData"
        :row-key="bridgedRowKey"
        v-model:expanded-row-keys="expanded"
        :page-size="10"
    /></loadingAreaOverlay>
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
import type { StockRow } from './api/index';
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
import { loadingAreaOverlay } from '@/components/modules/loadingModule/index';
// 商業邏輯
// store
import { useAreaLoadingStore } from '@/components/modules/loadingModule/store/index';
import { usePortfolioStore } from '@/stores/index';
// ---------------------------

// ----------初始化----------
const portfolioStore = usePortfolioStore(); // 投資組合 store
const loadingStore = useAreaLoadingStore(); // 讀取狀態 store

// 獲取資金配置讀取狀態
const isSummaryLoading = computed(() => loadingStore.isLoading(portfolioStore.summaryLoading));

const isHoldingsLoading = computed(() => loadingStore.isLoading(portfolioStore.holdingsLoading));

onMounted(async () => {
  await portfolioStore.fetchSummaryData(); // 請求資產配置資料
  await portfolioStore.fetchHoldingsData(1); // 請求持股配置資料
});
// -------------------------

// ----------欄位設定----------

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

const expanded = ref<Array<string | number>>([]);
// ----------斷言----------
/** ✅ 這三個是「橋接變數」，把 TS 斷言放到 script */
const bridgedColumns = columns as unknown as DataTableColumns<Record<string, unknown>>;

const bridgedData = computed(
  () => portfolioStore.holdingsList as unknown as Record<string, unknown>[]
);

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
