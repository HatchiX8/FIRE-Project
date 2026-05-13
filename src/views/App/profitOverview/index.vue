<template>
  <div class="text-textColor">
    <div class="flex flex-col gap-6">
      <section class="profit-chart-card bg-surface rounded-3xl p-4 backdrop-blur-xl md:p-6">
        <loadingAreaOverlay :loadingId="profitOverviewStore.trendChartLoading">
          <div>
            <div class="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-xl font-semibold tracking-tight text-white">損益趨勢</h2>
                <p class="text-textSecondary mt-1 text-sm">年度已實現損益走勢</p>
              </div>
              <div class="flex rounded-xl bg-white/5 p-1">
                <span class="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-bold text-white">
                  {{ currentYear }}
                </span>
              </div>
            </div>
            <div class="profit-chart-body">
              <trendChart
                v-if="!isTrendChartLoading"
                class="h-full min-h-0"
                :chartData="profitOverviewStore.trendChartData"
              />
            </div>
          </div>
          <div v-if="isTrendChartLoading" class="my-20"></div>
        </loadingAreaOverlay>
      </section>

      <div v-show="isTrendChartLoading && isTotalTradesLoading" class="mb-4 flex justify-center">
        <p class="text-5">資料請求中...請稍後</p>
      </div>

      <section class="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]">
        <div
          class="profit-table-card bg-surface order-2 rounded-3xl p-3 backdrop-blur-xl md:p-4 xl:p-5 2xl:order-1"
        >
          <loadingAreaOverlay :loadingId="profitOverviewStore.totalTradesLoading">
            <baseTable
              v-if="!isTrendChartLoading && !isTotalTradesLoading"
              :columns="bridgedColumns"
              :data="bridgedData"
              :row-key="bridgedRowKey"
              v-model:expanded-row-keys="expanded"
              :page-size="10"
              :total-page="profitOverviewStore.totalTradesPageInfo.totalPage"
              :current-page="profitOverviewStore.totalTradesPageInfo.currentPage"
              @page-change="handlePageChange"
            />
            <div v-if="isTotalTradesLoading" class="my-20"></div>
          </loadingAreaOverlay>
        </div>

        <aside
          v-show="!isTrendChartLoading && !isTotalTradesLoading"
          class="profit-action-card bg-surface order-1 rounded-3xl p-6 backdrop-blur-xl 2xl:order-2"
        >
          <div class="flex h-full min-w-0 flex-col gap-6">
            <div>
              <p class="text-textSecondary text-[10px] font-bold uppercase tracking-widest">月份</p>
              <div class="profit-month-switcher mt-4 grid items-center gap-3">
                <baseButton class="profit-month-button" color="primary">
                  <div class="i-mdi:chevron-left text-5" @click="prevMonth"></div>
                </baseButton>
                <div class="min-w-0 text-center">
                  <p class="text-3xl font-light leading-none text-white">{{ currentMonth }}</p>
                  <p class="text-textSecondary mt-1 text-xs font-bold uppercase tracking-widest">
                    {{ currentYear }}
                  </p>
                </div>

                <baseButton class="profit-month-button" color="primary">
                  <div class="i-mdi:chevron-right text-5" @click="nextMonth"></div>
                </baseButton>
              </div>
            </div>

            <baseButton class="profit-add-button" color="primary" @click="openReportDialog">
              新增資產
            </baseButton>
          </div>
        </aside>
      </section>
    </div>
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

// 當前年月變數
const currentYear = ref<number>(0);
const currentMonth = ref<number>(0);

onMounted(async () => {
  const today = new Date();
  currentYear.value = today.getFullYear();
  currentMonth.value = today.getMonth() + 1; // getMonth() 是 0-11，需要 +1

  fetchPortfolioOverviewData(currentYear.value, currentMonth.value, 1);
});
// -------------------------

// ----------月份切換----------
// 上一個月
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
  fetchPortfolioOverviewData(currentYear.value, currentMonth.value, 1);
};

// 下一個月
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
  fetchPortfolioOverviewData(currentYear.value, currentMonth.value, 1);
};

// 分頁變動處理
const handlePageChange = (page: number) => {
  getTotalTradesData(currentYear.value, currentMonth.value, page);
};
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
    render: (row) => formatDisplayDate(row.sellDate),
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
      return h('span', { class: cls }, `${row.realizedPnl} ( ${row.profitLossRate.toFixed(2)}% ) `);
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
            { default: () => '編輯紀錄' }
          ),
          h(
            baseButton,
            { size: 'small', color: 'danger', onClick: () => openDeleteReportDialog(row) },
            { default: () => '撤銷紀錄' }
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

const formatDisplayDate = (dateText: string): string => {
  const normalizedDate = dateText.trim().replace(/\//g, '-');
  const match = normalizedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (!match) return normalizedDate;

  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// ----------工具函式----------
// 清除所選資產
const clearSelectedAsset = () => {
  selectedReport.value = {} as StockRow;
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
    fetchPortfolioOverviewData(currentYear.value, currentMonth.value, 1);
  }
};

// ---------------------------

// ----------編輯資產----------
const editReportDlgOpen = ref<boolean>(false);

const openEditReportDialog = (reportRow: StockRow) => {
  clearSelectedAsset();
  selectedReport.value = reportRow;
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
    fetchPortfolioOverviewData(currentYear.value, currentMonth.value, 1);
  }
};

// ---------------------------

// ----------刪除資產----------
const deleteReportDlgOpen = ref<boolean>(false);

const openDeleteReportDialog = (reportRow: StockRow) => {
  clearSelectedAsset();
  selectedReport.value = reportRow;
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
    fetchPortfolioOverviewData(currentYear.value, currentMonth.value, 1);
  }
};
// ---------------------------
</script>

<style scoped>
.profit-chart-card,
.profit-table-card,
.profit-action-card {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.065);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 60px rgba(0, 0, 0, 0.14);
}

.profit-chart-body {
  height: 14rem;
  min-width: 0;
  overflow: hidden;
}

@media (min-width: 768px) {
  .profit-chart-body {
    height: 240px;
  }
}

.profit-table-card :deep(.n-data-table),
.profit-table-card :deep(.n-data-table-base-table),
.profit-table-card :deep(.n-data-table-wrapper),
.profit-table-card :deep(.n-data-table-table),
.profit-table-card :deep(.n-data-table-thead),
.profit-table-card :deep(.n-data-table-tbody),
.profit-table-card :deep(.n-data-table-tr),
.profit-table-card :deep(.n-data-table-th),
.profit-table-card :deep(.n-data-table-td) {
  background-color: transparent;
}

.profit-table-card :deep(.n-data-table-th) {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.profit-table-card :deep(.n-data-table-td),
.profit-table-card :deep(.n-data-table-th) {
  border-color: rgba(255, 255, 255, 0.06);
}

.profit-table-card :deep(.n-data-table-tr:hover .n-data-table-td) {
  background-color: rgba(255, 255, 255, 0.05);
}

.profit-month-switcher {
  grid-template-columns: 2.75rem minmax(0, 1fr) 2.75rem;
}

.profit-month-button {
  width: 2.75rem;
  min-width: 2.75rem;
  height: 2.75rem;
  padding: 0;
}

.profit-add-button {
  width: 100%;
}
</style>
