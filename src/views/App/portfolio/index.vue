<template>
  <div class="text-textColor">
    <div class="mx-auto max-w-6xl md:px-4">
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
// 斷言 - ✅ 這三個是「橋接變數」，把 TS 斷言放到 script
const bridgedColumns = columns as unknown as DataTableColumns<Record<string, unknown>>;

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
