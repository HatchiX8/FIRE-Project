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

    <div class="md:(mx-auto px-4) flex max-w-6xl items-center justify-between">
      <div></div>
      <div class="flex items-center">
        <baseButton color="primary"><div class="i-mdi:chevron-left text-5"></div></baseButton>
        <div class="text-5 mx-2 text-center">
          <p><span class="text-danger">9月</span>歷史</p>
          <p>交易紀錄</p>
        </div>

        <baseButton color="primary"><div class="i-mdi:chevron-right text-5"></div></baseButton>
      </div>

      <baseButton color="primary" @click="openReportDialog">新增資產</baseButton>
    </div>

    <loadingAreaOverlay
      :loadingId="profitOverviewStore.totalTradesLoading"
      class="mx-auto max-w-6xl px-0 px-4"
    >
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
  <newReportDialog
    :stockOptions="stockMetaStore.stocks"
    v-model="newReportDlgOpen"
    :loading="isAddReportLoading"
    @submitNewReport="requestAddReport"
  />
  <editReportDialog
    :reportValue="selectedReport"
    v-model="editReportDlgOpen"
    :loading="isEditReportLoading"
    @submitEditReport="requestEditReport"
  />
  <deleteReportDialog
    :reportValue="selectedReport"
    v-model="deleteReportDlgOpen"
    :loading="isDeleteReportLoading"
    @submitDeleteReport="requestDeleteReport"
  />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import type { DataTableColumns } from 'naive-ui';
import type { TradeItem, StockRow, NewReportPayload, EditReportPayload } from './api/index';
// 元件
import { trendChart, newReportDialog, editReportDialog, deleteReportDialog } from './comps/index';
import { baseButton, baseTable } from '@/components/index';
import { loadingAreaOverlay } from '@/modules/loadingModule/index';
// 商業邏輯
import { notify } from '@/utils/index';
// store
import { useAreaLoadingStore } from '@/modules/loadingModule/store/index';
import { useProfitOverviewStore, useStockMetaStore } from '@/stores/index';
// ---------------------------

// ----------初始化----------
const profitOverviewStore = useProfitOverviewStore(); // 投資組合 store
const loadingStore = useAreaLoadingStore(); // 讀取狀態 store
const stockMetaStore = useStockMetaStore(); // 股票資訊 store

const selectedReport = ref<StockRow>({} as StockRow); // 紀錄當前所選擇的資產ID

onMounted(async () => {
  fetchPortfolioOverviewData(2026, 10, 1);
});
// -------------------------

// ----------欄位設定----------
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
    render: (row) => row.sellDate,
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
        h('div', { class: ' flex flex-col gap-2 px-3 text-left flex-1' }, [
          h('div', { class: 'font-semibold mb-2 text-primary' }),
          h('div', `買進價格：${row.buyPrice}`),
          h('div', `剩餘股數：${row.quantity}`),
          h('div', `持有成本：${row.buyCost}`),
          h('div', `買進日期：${row.buyDate}`),
          h('div', `買進策略：${row.buyNote ?? '-'}`),
        ]),
        h('div', { class: ' flex flex-col gap-2 px-3 text-left flex-1' }, [
          h('div', { class: 'font-semibold mb-2 text-success' }),
          h('div', `賣出價格：${row.sellPrice}`),
          h('div', `賣出股數：${row.sellQty}`),
          h('div', `總應收付：${row.sellCost}`),
          h('div', `賣出日期：${row.sellDate}`),
          h(
            'div',
            {
              class:
                row.realizedPnl > 0
                  ? 'text-danger'
                  : row.realizedPnl < 0
                    ? 'text-success'
                    : 'text-neutral_300',
            },
            `實際損益：${row.realizedPnl} (${row.profitLossRate.toFixed(2)}%)`
          ),
          h('div', `賣出備註：${row.sellNote ?? '-'}`),
        ]),

        h('div', { class: 'mt-2 ml-auto flex flex-col gap-4' }, [
          h(
            baseButton,
            { size: 'small', color: 'success', onClick: () => openEditReportDialog(row) },
            { default: () => '編輯' }
          ),
          h(
            baseButton,
            { size: 'small', color: 'danger', onClick: () => openDeleteReportDialog(row) },
            { default: () => '刪除資產' }
          ),
        ]),
      ]),
  },
];

const expanded = ref<Array<string | number>>([]);
// 斷言 - ✅ 這三個是「橋接變數」，把 TS 斷言放到 script
const bridgedColumns = columns as unknown as DataTableColumns<Record<string, unknown>>;

const bridgedData = computed(
  () => profitOverviewStore.totalTradesList as unknown as Record<string, unknown>[]
);

const bridgedRowKey = (row: Record<string, unknown>) => (row as unknown as StockRow).tradesId;
// ------------------------

// ----------工具函式----------
// 清除所選資產
const clearSelectedAsset = () => {
  selectedReport.value = {} as StockRow;
  console.log('觸發清除', selectedReport.value);
};
// ---------------------------

// ----------資產管理----------
// 歷史資訊讀取狀態
const isTrendChartLoading = computed(() =>
  loadingStore.isLoading(profitOverviewStore.trendChartLoading)
);
const isTotalTradesLoading = computed(() =>
  loadingStore.isLoading(profitOverviewStore.totalTradesLoading)
);

const fetchPortfolioOverviewData = async (year: number, month: number, page: number = 1) => {
  await Promise.all([getTrendChartData(year), getTotalTradesData(year, month, page)]);
};

// 趨勢圖資料請求
const getTrendChartData = async (year: number) => {
  const res = await profitOverviewStore.fetchTrendChartData(year);

  if (!res.success) {
    notify('error', res.message);
    return;
  }
};

// 損益概況資料請求
const getTotalTradesData = async (year: number, month: number, page: number) => {
  const res = await profitOverviewStore.fetchTotalTradesData(year, month, page);

  if (!res.success) {
    notify('error', res.message);
    return;
  }
};
// ---------------------------

// ----------新增資產----------
const newReportDlgOpen = ref<boolean>(false);

const openReportDialog = () => {
  newReportDlgOpen.value = true;
};

const isAddReportLoading = computed(() =>
  loadingStore.isLoading(profitOverviewStore.addReportLoading)
);
// 新增歷史交易數據
const requestAddReport = async (payload: NewReportPayload) => {
  const res = await profitOverviewStore.addReport(payload);

  if (!res.success) {
    notify('error', res.message);
    newReportDlgOpen.value = false;
    return;
  } else {
    notify('success', res.message);
    newReportDlgOpen.value = false;
    fetchPortfolioOverviewData(2026, 10, 1);
  }
};

// ---------------------------

// ----------編輯資產----------
const editReportDlgOpen = ref<boolean>(false);

const openEditReportDialog = (reportRow: StockRow) => {
  clearSelectedAsset();
  selectedReport.value = reportRow;
  console.log('觸發點擊，ID為:', reportRow);
  editReportDlgOpen.value = true;
};

const isEditReportLoading = computed(() =>
  loadingStore.isLoading(profitOverviewStore.editReportLoading)
);

// 編輯歷史交易數據
const requestEditReport = async (payload: {
  reportId: string | null;
  formValue: EditReportPayload;
}) => {
  const { reportId, formValue } = payload;
  if (!reportId) {
    notify('error', '無法編輯歷史紀錄，請稍後再試');
    editReportDlgOpen.value = false;
    return;
  }
  const res = await profitOverviewStore.editReport(reportId, formValue);
  if (!res.success) {
    notify('error', res.message);
    editReportDlgOpen.value = false;
    return;
  } else {
    notify('success', res.message);
    editReportDlgOpen.value = false;
    fetchPortfolioOverviewData(2026, 10, 1);
  }
};

// ---------------------------

// ----------刪除資產----------
const deleteReportDlgOpen = ref<boolean>(false);

const openDeleteReportDialog = (reportRow: StockRow) => {
  clearSelectedAsset();
  selectedReport.value = reportRow;
  console.log('觸發點擊，ID為:', reportRow);
  deleteReportDlgOpen.value = true;
};

const isDeleteReportLoading = computed(() =>
  loadingStore.isLoading(profitOverviewStore.deleteReportLoading)
);
// 刪除歷史交易數據
const requestDeleteReport = async (reportId: string) => {
  const res = await profitOverviewStore.deleteReport(reportId);
  if (!res.success) {
    notify('error', res.message);
    deleteReportDlgOpen.value = false;
    return;
  } else {
    notify('success', res.message);
    deleteReportDlgOpen.value = false;
    fetchPortfolioOverviewData(2026, 10, 1);
  }
};
// ---------------------------
</script>
