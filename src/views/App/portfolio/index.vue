<template>
  <div class="text-textColor">
    <div class="flex flex-col gap-6">
      <section
        class="portfolio-summary-card bg-surface relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl transition-all md:p-8 xl:grid xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8"
      >
        <div class="pointer-events-none absolute right-0 top-0 p-8 opacity-5">
          <div class="i-mdi:wallet h-36 w-36 rotate-12 text-white md:h-44 md:w-44"></div>
        </div>
        <loadingAreaOverlay :loadingId="portfolioStore.summaryLoading">
          <div v-show="!isSummaryLoading" class="portfolio-summary-content relative z-10 min-w-0">
            <p class="text-textSecondary mb-3 text-[16px] font-bold uppercase tracking-widest">
              總資產
            </p>
            <h2 class="text-5xl font-light leading-none tracking-tight text-white md:text-6xl">
              {{ portfolioStore.summaryList.totalInvest?.toLocaleString?.() ?? '-' }}
            </h2>
            <div
              class="portfolio-summary-breakdown text-textSecondary mt-5 grid gap-3 text-sm sm:grid-cols-2"
            >
              <div class="flex items-center justify-between gap-6">
                <span>股票成本</span>
                <span class="text-textColor font-medium">
                  {{ portfolioStore.summaryList.stockCost?.toLocaleString?.() ?? '-' }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-6">
                <span>現金資金</span>
                <span class="text-textColor font-medium">
                  {{ portfolioStore.summaryList.cashInvest?.toLocaleString?.() ?? '-' }}
                </span>
              </div>
            </div>

            <div class="mt-6">
              <div
                class="text-textSecondary mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest"
              >
                <span class="text-3 flex items-center gap-2">
                  <i class="bg-primary text-4 h-2 w-2 rounded-full"></i>
                  持股成本
                </span>
                <span class="text-3 flex items-center gap-2">
                  <i class="bg-success h-2 w-2 rounded-full"></i>
                  現金
                </span>
              </div>
              <div class="flex h-1.5 overflow-hidden rounded-full bg-white/5">
                <div class="bg-primary h-full" :style="{ width: stockCostProgressWidth }"></div>
                <div class="bg-success h-full" :style="{ width: cashProgressWidth }"></div>
              </div>
            </div>
          </div>
          <div v-if="isSummaryLoading" class="my-12 min-w-[240px]"></div>
        </loadingAreaOverlay>

        <div
          v-show="!isHoldingsLoading && !isSummaryLoading"
          class="portfolio-action-panel relative z-10 mt-8 flex w-full flex-col items-start justify-center gap-3 pl-0 sm:w-auto xl:mt-0 xl:h-full xl:w-full xl:pl-6"
        >
          <baseButton color="primary" @click="openTotalInvestDialog">資金管理</baseButton>
          <baseButton color="primary" @click="openAssetDialog">建立資產</baseButton>
        </div>
      </section>

      <div v-show="isHoldingsLoading && isSummaryLoading" class="mb-4 flex justify-center">
        <p class="text-5">資料載入中...</p>
      </div>

      <section class="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]">
        <div class="portfolio-table-card bg-surface rounded-3xl p-3 backdrop-blur-xl md:p-4 xl:p-5">
          <loadingAreaOverlay :loadingId="portfolioStore.holdingsLoading">
            <baseTable
              v-if="!isHoldingsLoading && !isSummaryLoading"
              :columns="bridgedColumns"
              :data="bridgedData"
              :row-key="bridgedRowKey"
              v-model:expanded-row-keys="expanded"
              :page-size="10"
              :total-page="portfolioStore.holdingsPagination.totalPage"
              :current-page="portfolioStore.holdingsPagination.currentPage"
              @page-change="handlePageChange"
            />
            <div v-if="isHoldingsLoading" class="my-20"></div>
          </loadingAreaOverlay>
        </div>

        <div class="portfolio-chart-card rounded-3xl p-6 backdrop-blur-xl">
          <loadingAreaOverlay :loadingId="portfolioStore.summaryLoading">
            <trendChart
              v-show="!isSummaryLoading"
              class="h-72 min-h-[18rem]"
              :chartData="portfolioStore.summaryList"
            />
            <div v-if="isSummaryLoading" class="my-20"></div>
          </loadingAreaOverlay>
        </div>
      </section>
    </div>

    <div class="hidden">
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

      <div
        v-show="!isHoldingsLoading && !isSummaryLoading"
        class="md:(mx-auto px-4) flex max-w-6xl items-center justify-between"
      >
        <baseButton color="primary" @click="openTotalInvestDialog">資金管理</baseButton>
        <baseButton class="ml-auto" color="primary" @click="openAssetDialog">建倉</baseButton>
      </div>

      <div v-show="isHoldingsLoading && isSummaryLoading" class="mb-4 flex justify-center">
        <p class="text-5">資料請求中...請稍後</p>
      </div>

      <loadingAreaOverlay :loadingId="portfolioStore.holdingsLoading">
        <baseTable
          v-if="!isHoldingsLoading && !isSummaryLoading"
          :columns="bridgedColumns"
          :data="bridgedData"
          :row-key="bridgedRowKey"
          v-model:expanded-row-keys="expanded"
          :page-size="10"
          :total-page="portfolioStore.holdingsPagination.totalPage"
          :current-page="portfolioStore.holdingsPagination.currentPage"
          @page-change="handlePageChange" />
        <div v-if="isHoldingsLoading" class="my-20"></div
      ></loadingAreaOverlay>
    </div>
  </div>
  <!-- 彈跳試窗 -->
  <totalInvestDialog
    v-model="totalInvestDlgOpen"
    :current-invest="portfolioStore.totalInvest"
    :totalInvestLoading="totalInvestIsLoading"
    :loading="isInvestLoading"
    initial-mode="add"
    @submit="investOnSubmit"
  />
  <newAssetDialog
    :stockOptions="stockMetaStore.stocks"
    v-model="newAssetDlgOpen"
    :loading="addAssetLoading"
    @submitNewAsset="requestAddAsset"
  />
  <sellAssetDialog
    :assetValue="selectedAsset"
    v-model="sellAssetDialogOpen"
    :loading="sellAssetLoading"
    @submitSellAsset="requestSellAsset"
  />
  <editAssetDialog
    :assetValue="selectedAsset"
    v-model="editAssetDlgOpen"
    :loading="editAssetLoading"
    @submitEditAsset="requestEditAsset"
  />
  <deleteAssetDialog
    :assetValue="selectedAsset"
    v-model="deleteAssetDlgOpen"
    :loading="deleteAssetLoading"
    @submitDeleteAsset="requestDeleteAsset"
  />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import { type DataTableColumns } from 'naive-ui';
import type { StockRow, EditStockPayload, SellStockPayload, AddStockPayload } from './api/index';
// 元件
import {
  trendChart,
  totalInvestDialog,
  newAssetDialog,
  sellAssetDialog,
  editAssetDialog,
  deleteAssetDialog,
} from './comps/index';
import { baseTable, baseButton } from '@/components/index';
import { loadingAreaOverlay } from '@/modules/loadingModule/index';
// 商業邏輯
import { formatPriceSmart, notify } from '@/utils/index';
// store
import { useAreaLoadingStore } from '@/modules/loadingModule/store/index';
import { usePortfolioStore, useStockMetaStore } from '@/stores/index';
// ---------------------------

// ----------初始化----------
const portfolioStore = usePortfolioStore(); // 投資組合 store
const loadingStore = useAreaLoadingStore(); // 讀取狀態 store
const stockMetaStore = useStockMetaStore(); // 股票資訊 store

const selectedAsset = ref<StockRow>({} as StockRow); // 紀錄當前所選擇的資產ID
const submitting = ref<boolean>(false); // 表單提交狀態

onMounted(async () => {
  fetchPortfolioData(1);
});

const isFullTable = ref<boolean>(false);

const updateTableMode = () => {
  isFullTable.value = window.matchMedia('(min-width: 768px)').matches;
};

onMounted(() => {
  updateTableMode();
  window.addEventListener('resize', updateTableMode);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateTableMode);
});

const stockCostProgressWidth = computed(() => {
  const stockCost = portfolioStore.summaryList.stockCost ?? 0;
  const cashInvest = portfolioStore.summaryList.cashInvest ?? 0;
  const total = stockCost + cashInvest;

  return total > 0 ? `${(stockCost / total) * 100}%` : '0%';
});

const cashProgressWidth = computed(() => {
  const stockCost = portfolioStore.summaryList.stockCost ?? 0;
  const cashInvest = portfolioStore.summaryList.cashInvest ?? 0;
  const total = stockCost + cashInvest;

  return total > 0 ? `${(cashInvest / total) * 100}%` : '0%';
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
    title: '買進價格',
    //  title: '市價/買進價格', //市價為後續更新預留
    key: 'currentPrice', // key 可以對應一個欄位，但顯示內容自訂
    align: 'center',
    minWidth: 20,
    render: (row: StockRow): string => `${formatPriceSmart(row.buyPrice)}`,
    // `${formatPriceSmart(row.currentPrice)} / ${formatPriceSmart(row.buyPrice)}`,  //市價為後續更新預留
  },
  {
    title: '股數',
    key: 'quantity', // key 可以對應一個欄位，但顯示內容自訂
    align: 'center',
    minWidth: 20,
  },
  // 損益功能為後續更新預留
  // {
  //   title: '損益(%)',
  //   key: 'profitRate', // key 可以對應一個欄位，但顯示內容自訂
  //   align: 'center',
  //   minWidth: 20,
  //   render: (row) => {
  //     const cls =
  //       row.profitRate > 0
  //         ? 'text-danger'
  //         : row.profitRate < 0
  //           ? 'text-success'
  //           : 'text-neutral_300';
  //     return h('span', { class: cls }, `${row.profitRate.toFixed(2)}%`);
  //   },
  // },
  {
    type: 'expand',
    width: 56,
    renderExpand: (row) =>
      h('div', { class: ' flex' }, [
        h('div', { class: 'mt-2 flex flex-col gap-2 p-3 text-left' }, [
          h('div', `總成本：${row.totalCost.toLocaleString()}`),
          // h('div', `總市值：${row.marketValue.toLocaleString()}`),  //市價為後續更新預留
          // //未實現為後續更新預留
          // 未實現損益樣式較複雜，改用自執行函式處理
          // (() => {
          //   const val = typeof row.stockProfit === 'number' ? row.stockProfit : null;
          //   const cls =
          //     val === null
          //       ? 'text-neutral_300'
          //       : val > 0
          //         ? 'text-danger'
          //         : val < 0
          //           ? 'text-success'
          //           : 'text-neutral_300';
          //   return h('div', { class: 'flex items-center' }, [
          //     h('span', '未實現損益：'),
          //     h('span', { class: `${cls} ml-1` }, val !== null ? val.toLocaleString() : '-'),
          //   ]);
          // })(),

          h('div', `建倉日期：${row.buyDate}`),
          h('div', `備註：${row.note ?? '-'}`),
          h(
            baseButton,
            {
              class: 'w-20',
              size: 'small',
              color: 'primary',
              onClick: () => openSellAssetDialog(row),
            },
            { default: () => '平倉' }
          ),
        ]),

        h('div', { class: 'mt-2 ml-auto flex flex-col gap-4' }, [
          h(
            baseButton,
            { size: 'small', color: 'success', onClick: () => openEditAssetDialog(row) },
            { default: () => '編輯' }
          ),
          h(
            baseButton,
            { size: 'small', color: 'danger', onClick: () => openDeleteAssetDialog(row) },
            { default: () => '刪除資產' }
          ),
        ]),
      ]),
  },
];

const expanded = ref<Array<string | number>>([]);

const fullColumns: DataTableColumns<StockRow> = [
  {
    title: '股票名稱',
    key: 'stockName',
    align: 'center',
    minWidth: 120,
    render: (row: StockRow) => row.stockName,
  },
  {
    title: '買進價格',
    key: 'buyPrice',
    align: 'center',
    minWidth: 110,
    render: (row: StockRow): string => `${formatPriceSmart(row.buyPrice)}`,
  },
  {
    title: '股數',
    key: 'quantity',
    align: 'center',
    minWidth: 80,
  },
  {
    title: '總成本',
    key: 'totalCost',
    align: 'center',
    minWidth: 120,
    render: (row: StockRow): string => row.totalCost.toLocaleString(),
  },
  {
    title: '日期',
    key: 'buyDate',
    align: 'center',
    minWidth: 120,
  },
  {
    title: '備註',
    key: 'note',
    align: 'center',
    minWidth: 160,
    render: (row: StockRow): string => row.note ?? '-',
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    minWidth: 96,
    render: (row: StockRow) =>
      h(
        baseButton,
        {
          size: 'small',
          color: 'primary',
          onClick: () => openSellAssetDialog(row),
        },
        { default: () => '平倉' }
      ),
  },
  {
    type: 'expand',
    width: 56,
    renderExpand: (row: StockRow) =>
      h('div', { class: 'flex justify-end gap-3 p-3' }, [
        h(
          baseButton,
          { size: 'small', color: 'success', onClick: () => openEditAssetDialog(row) },
          { default: () => '編輯' }
        ),
        h(
          baseButton,
          { size: 'small', color: 'danger', onClick: () => openDeleteAssetDialog(row) },
          { default: () => '刪除' }
        ),
      ]),
  },
];

const displayColumns = computed(() => (isFullTable.value ? fullColumns : columns));
// 斷言 - ✅ 這三個是「橋接變數」，把 TS 斷言放到 script
const bridgedColumns = computed(
  () => displayColumns.value as unknown as DataTableColumns<Record<string, unknown>>
);

const bridgedData = computed(
  () => portfolioStore.holdingsList as unknown as Record<string, unknown>[]
);

const bridgedRowKey = (row: Record<string, unknown>) => (row as unknown as StockRow).assetId;

const handlePageChange = (page: number) => {
  getHoldingsData(page);
};
// ------------------------

// ----------工具函式----------
// 清除所選資產
const clearSelectedAsset = () => {
  selectedAsset.value = {} as StockRow;
};
// ---------------------------

// ----------資金管理----------
const totalInvestDlgOpen = ref<boolean>(false);
const totalInvestIsLoading = computed(() =>
  loadingStore.isLoading(portfolioStore.totalInvestLoading)
);
const isInvestLoading = computed(() => loadingStore.isLoading(portfolioStore.investLoading));

const openTotalInvestDialog = () => {
  totalInvestDlgOpen.value = true;
  requestGetTotalInvest();
};

// 資金送出設定
const investOnSubmit = async (payload: {
  mode: 'deposit' | 'add' | 'withdraw';
  amount: number;
}) => {
  submitting.value = true;

  try {
    if (payload.mode === 'deposit') {
      requestDepositInvest(payload.amount);
    } else if (payload.mode === 'add') {
      requestAddInvest(payload.amount);
    } else {
      requestWithdrawInvest(payload.amount);
    }
  } finally {
    submitting.value = false;
  }
};

// 取得總資金
const requestGetTotalInvest = async () => {
  const res = await portfolioStore.fetchTotalInvest();

  if (!res.success) {
    notify('error', res.message);
    totalInvestDlgOpen.value = false; // api失敗將關閉彈跳窗
    return;
  }
};

// 投入資金
const requestAddInvest = async (amount: number) => {
  const res = await portfolioStore.addInvest(amount);
  if (!res.success) {
    notify('error', res.message);
    totalInvestDlgOpen.value = false; // api失敗將關閉彈跳窗
    return;
  } else {
    notify('success', res.message);
    totalInvestDlgOpen.value = false;
    getSummaryData();
  }
};

// 提領資金
const requestWithdrawInvest = async (amount: number) => {
  const res = await portfolioStore.withdrawalInvest(amount);
  if (!res.success) {
    notify('error', res.message); // api失敗將關閉彈跳窗
    return;
  } else {
    notify('success', res.message);
    totalInvestDlgOpen.value = false;
    getSummaryData();
  }
};

// 重置資金
const requestDepositInvest = async (amount: number) => {
  const res = await portfolioStore.depositInvest(amount);
  if (!res.success) {
    notify('error', res.message);
    totalInvestDlgOpen.value = false; // api失敗將關閉彈跳窗
    return;
  } else {
    notify('success', res.message);
    totalInvestDlgOpen.value = false;
    getSummaryData();
  }
};
// ---------------------------

// ----------資產管理----------
// 獲取資金配置讀取狀態
const isSummaryLoading = computed(() => loadingStore.isLoading(portfolioStore.summaryLoading));
const isHoldingsLoading = computed(() => loadingStore.isLoading(portfolioStore.holdingsLoading));

// 獲取投資組合資料
const fetchPortfolioData = async (page: number = 1) => {
  await Promise.all([getSummaryData(), getHoldingsData(page)]);
};

// 請求資產一覽
const getSummaryData = async () => {
  const res = await portfolioStore.fetchSummaryData();

  if (!res.success) {
    notify('error', res.message);
    return;
  }
};

// 請求持股一覽
const getHoldingsData = async (page: number) => {
  const res = await portfolioStore.fetchHoldingsData(page);

  if (!res.success) {
    notify('error', res.message);
    return;
  }
};

// ---------------------------

// ----------新增資產----------
const newAssetDlgOpen = ref<boolean>(false); // 新增資產彈窗開關

// 彈窗操作
const openAssetDialog = () => {
  newAssetDlgOpen.value = true;
};

// 請求新增資產
const addAssetLoading = computed(() => loadingStore.isLoading(portfolioStore.addAssetLoading));
const requestAddAsset = async (payload: AddStockPayload) => {
  const res = await portfolioStore.addAsset(payload);

  if (!res.success) {
    // 這裡可以根據需求做錯誤提示或重導
    notify('error', res.message);
    newAssetDlgOpen.value = false;
    return;
  } else {
    notify('success', res.message);
    newAssetDlgOpen.value = false;
    await fetchPortfolioData(1);
  }
};
// ---------------------------

// ----------賣出資產----------
const sellAssetDialogOpen = ref<boolean>(false); // 賣出資產彈窗開關

// 彈窗操作
const openSellAssetDialog = (assetRow: StockRow) => {
  clearSelectedAsset();
  selectedAsset.value = assetRow;
  sellAssetDialogOpen.value = true;
};

// 請求賣出資產
const sellAssetLoading = computed(() => loadingStore.isLoading(portfolioStore.sellAssetLoading));
const requestSellAsset = async (payload: {
  assetId: string | null;
  formValue: SellStockPayload;
}) => {
  const { assetId, formValue } = payload;

  if (!assetId) {
    notify('error', '無法操作賣出資產，請稍後再試');
    sellAssetDialogOpen.value = false;
    return;
  }

  const res = await portfolioStore.sellAsset(assetId, formValue);

  if (!res.success) {
    notify('error', res.message);
    sellAssetDialogOpen.value = false;
    return;
  } else {
    notify('success', res.message);
    clearSelectedAsset();
    sellAssetDialogOpen.value = false;
    await fetchPortfolioData(1);
  }
};

// ---------------------------

// ----------編輯資產----------
const editAssetDlgOpen = ref<boolean>(false); // 編輯資產彈窗開關

// 彈窗操作
const openEditAssetDialog = (assetRow: StockRow) => {
  clearSelectedAsset();
  selectedAsset.value = assetRow;
  editAssetDlgOpen.value = true;
};

// 請求編輯資產
const editAssetLoading = computed(() => loadingStore.isLoading(portfolioStore.editAssetLoading));
const requestEditAsset = async (payload: {
  assetId: string | null;
  formValue: EditStockPayload;
}) => {
  const { assetId, formValue } = payload;

  if (!assetId) {
    notify('error', '編輯資產失敗，請重試');
    return;
  }

  const res = await portfolioStore.editAsset(assetId, formValue);

  if (!res.success) {
    // 這裡可以根據需求做錯誤提示或重導
    notify('error', res.message);
    return;
  } else {
    notify('success', res.message);
    clearSelectedAsset();
    editAssetDlgOpen.value = false;
    await fetchPortfolioData(1);
  }
};
// ---------------------------

// ----------刪除資產----------
const deleteAssetDlgOpen = ref<boolean>(false); // 刪除資產彈窗開關

// 彈窗操作
const openDeleteAssetDialog = (assetRow: StockRow) => {
  clearSelectedAsset();
  selectedAsset.value = assetRow;
  deleteAssetDlgOpen.value = true;
};

// 請求刪除資產
const deleteAssetLoading = computed(() =>
  loadingStore.isLoading(portfolioStore.deleteAssetLoading)
);
const requestDeleteAsset = async (assetId: string) => {
  const res = await portfolioStore.deleteAsset(assetId);

  if (!res.success) {
    notify('error', res.message);
    return;
  } else {
    notify('success', res.message);
    clearSelectedAsset();
    deleteAssetDlgOpen.value = false;
    await fetchPortfolioData(1);
  }
};
// ---------------------------
</script>

<style scoped>
.portfolio-summary-card {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.065);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 60px rgba(0, 0, 0, 0.16);
}

.portfolio-table-card,
.portfolio-chart-card {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.065);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 60px rgba(0, 0, 0, 0.14);
}

.portfolio-table-card :deep(.n-data-table),
.portfolio-table-card :deep(.n-data-table-base-table),
.portfolio-table-card :deep(.n-data-table-wrapper),
.portfolio-table-card :deep(.n-data-table-table),
.portfolio-table-card :deep(.n-data-table-thead),
.portfolio-table-card :deep(.n-data-table-tbody),
.portfolio-table-card :deep(.n-data-table-tr),
.portfolio-table-card :deep(.n-data-table-th),
.portfolio-table-card :deep(.n-data-table-td) {
  background-color: transparent;
}

.portfolio-table-card :deep(.n-data-table-th) {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.portfolio-table-card :deep(.n-data-table-td),
.portfolio-table-card :deep(.n-data-table-th) {
  border-color: rgba(255, 255, 255, 0.06);
}

.portfolio-table-card :deep(.n-data-table-tr:hover .n-data-table-td) {
  background-color: rgba(255, 255, 255, 0.05);
}

@media (min-width: 768px) {
  .portfolio-summary-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(200px, 240px);
    column-gap: 1.5rem;
    align-items: end;
  }

  .portfolio-summary-content > p,
  .portfolio-summary-content > h2 {
    grid-column: 1;
  }

  .portfolio-summary-breakdown {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: end;
    display: flex;
    flex-direction: column;
  }

  .portfolio-summary-content > div:last-child {
    grid-column: 1 / -1;
  }
}

.portfolio-action-panel :deep(.n-button) {
  width: 100%;
}

@media (min-width: 640px) {
  .portfolio-action-panel :deep(.n-button) {
    width: 10rem;
  }
}
</style>
