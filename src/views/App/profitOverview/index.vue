<template>
  <div class="text-textColor">
    <loadingAreaOverlay :loadingId="profitOverviewStore.trendChartLoading" class="px-0">
      <div class="mb-4">
        <trendChart
          v-show="!isTrendChartLoading"
          class="h-70"
          :chartData="profitOverviewStore.trendChartData"
        />
      </div>
      <div v-if="isTrendChartLoading" class="my-20"></div>
    </loadingAreaOverlay>

    <div class="flex items-center justify-between">
      <baseButton color="primary" @click="openTotalInvestDialog">資金管理</baseButton>
      <div class="flex items-center">
        <baseButton color="primary"><div class="i-mdi:chevron-left text-5"></div></baseButton>
        <div class="text-5 mx-2 text-center">
          <p><span class="text-danger">9月</span>歷史</p>
          <p>交易紀錄</p>
        </div>

        <baseButton color="primary"><div class="i-mdi:chevron-right text-5"></div></baseButton>
      </div>

      <baseButton color="primary" @click="openAssetDialog">新增資產</baseButton>
    </div>
    <loadingAreaOverlay :loadingId="profitOverviewStore.totalTradesLoading" class="px-0">
      <baseTable
        v-if="!isTrendChartLoading && !isTotalTradesLoading"
        :columns="bridgedColumns"
        :data="bridgedData"
        :row-key="bridgedRowKey"
        v-model:expanded-row-keys="expanded"
        :page-size="10"
        class="mt-4"
      />
      <div v-if="isTotalTradesLoading" class="my-20"></div>
    </loadingAreaOverlay>
  </div>
  <totalInvestDialog
    v-model="totalInvestDlgOpen"
    :current-invest="currentInvest"
    :loading="submitting"
    initial-mode="deposit"
    @submit="onSubmit"
  />
  <newAssetDialog v-model="newAssetDlgOpen" :loading="submitting" />
  <editAssetDialog v-model="editAssetDlgOpen" :loading="submitting" />
  <deleteAssetDialog v-model="deleteAssetDlgOpen" :loading="submitting" />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import type { DataTableColumns } from 'naive-ui';
import type { TradeItem } from './api/index';
// 元件
import {
  trendChart,
  totalInvestDialog,
  newAssetDialog,
  editAssetDialog,
  deleteAssetDialog,
} from './comps/index';
import { baseButton, baseTable } from '@/components/index';
import { loadingAreaOverlay } from '@/components/modules/loadingModule/index';
// 商業邏輯
// store
import { useAreaLoadingStore } from '@/components/modules/loadingModule/store/index';
import { useProfitOverviewStore } from '@/stores/index';
// ---------------------------

// ----------初始化----------
const profitOverviewStore = useProfitOverviewStore(); // 投資組合 store
const loadingStore = useAreaLoadingStore(); // 讀取狀態 store

const isTrendChartLoading = computed(() =>
  loadingStore.isLoading(profitOverviewStore.trendChartLoading)
);
// 損益概況讀取狀態
const isTotalTradesLoading = computed(() =>
  loadingStore.isLoading(profitOverviewStore.totalTradesLoading)
);

onMounted(async () => {
  await profitOverviewStore.fetchTrendChartData(2025); // 請求趨勢圖點位資料
  await profitOverviewStore.fetchTotalTradesData(2025, 10, 1); // 請求損益概況資料
});
// -------------------------

// ----------欄位設定----------
interface StockRow {
  tradesId: string;
  stockId: string;
  stockName: string;
  tradesDate: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyCost: number;
  actualRealizedPnl: number;
  stockProfit: number;
  profitLossRate: number;
  note: string;
}

const columns: DataTableColumns<TradeItem> = [
  {
    title: '股票名稱',
    key: 'stockName',
    align: 'center',
    minWidth: 40,
    render: (row: StockRow) => row.stockName,
  },
  {
    title: '交易日期',
    key: 'tradesDate',
    align: 'center',
    minWidth: 20,
    render: (row) => row.tradesDate,
  },
  {
    title: '損益(%)',
    key: 'stockProfit', // key 可以對應一個欄位，但顯示內容自訂
    align: 'center',
    minWidth: 20,
    render: (row) => {
      const cls =
        row.profitLossRate > 0
          ? 'text-danger'
          : row.profitLossRate < 0
            ? 'text-success'
            : 'text-neutral_300';
      return h('span', { class: cls }, `${row.profitLossRate.toFixed(2)}%`);
    },
  },
  {
    type: 'expand',
    width: 56,
    renderExpand: (row) =>
      h('div', { class: ' flex' }, [
        h('div', { class: 'mt-2 flex flex-col gap-2 p-3 text-left' }, [
          h('div', `買進價格：${row.buyPrice.toLocaleString()}`),
          h('div', `賣出價格：${row.sellPrice.toLocaleString()}`),
          h('div', `股數：${row.quantity.toLocaleString()}`),
          h('div', `總成本：${row.buyCost.toLocaleString()}`),
          h('div', `總市值：${row.actualRealizedPnl.toLocaleString()}`),
          h(
            'div',
            {
              class:
                row.stockProfit > 0
                  ? 'text-danger'
                  : row.stockProfit < 0
                    ? 'text-success'
                    : 'text-neutral_300',
            },
            `實際損益：${row.stockProfit.toLocaleString()} (${row.profitLossRate.toFixed(2)}%)`
          ),
          h('div', `備註：${row.note ?? '-'}`),
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
  () => profitOverviewStore.totalTradesList as unknown as Record<string, unknown>[]
);

const bridgedRowKey = (row: Record<string, unknown>) => (row as unknown as StockRow).tradesId;
// ------------------------

// ----------資金管理----------
const openTotalInvestDialog = () => {
  totalInvestDlgOpen.value = true;
};

const totalInvestDlgOpen = ref(false);
const submitting = ref(false); // 提交狀態
const currentInvest = ref(1250000);

async function onSubmit(payload: { mode: 'deposit' | 'withdraw'; amount: number }) {
  submitting.value = true;
  try {
    if (payload.mode === 'deposit') {
      console.log('觸發投入資金API');
      // ← 實作你的 API
    } else {
      console.log('觸發提領資金API');
      // ← 實作你的 API
    }
    // 成功後：關窗 + refresh
    // dlgOpen.value = false;
    console.log('刷新取得最新投資金額');
  } finally {
    submitting.value = false;
  }
}
// ---------------------------

// ----------新增資產----------

const openAssetDialog = () => {
  newAssetDlgOpen.value = true;
};

const newAssetDlgOpen = ref(false);
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
