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
  <newAssetDialog
    :stockOptions="stockMetaStore.stocks"
    v-model="newAssetDlgOpen"
    :loading="submitting"
  />
  <sellAssetDialog
    :assetValue="selectedAsset"
    v-model="sellAssetDialogOpen"
    :loading="submitting"
    @submitSellAsset="requestSellAsset"
  />
  <editAssetDialog
    :assetValue="selectedAsset"
    v-model="editAssetDlgOpen"
    :loading="submitting"
    @submitEditAsset="requestEditAsset"
  />
  <deleteAssetDialog
    :assetValue="selectedAsset"
    v-model="deleteAssetDlgOpen"
    :loading="submitting"
    @submitDeleteAsset="requestDeleteAsset"
  />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import { type DataTableColumns } from 'naive-ui';
import type { StockRow, EditStockPayload, SellStockPayload } from './api/index';
// 元件
import {
  trendChart,
  newAssetDialog,
  sellAssetDialog,
  editAssetDialog,
  deleteAssetDialog,
} from './comps/index';
import { baseTable, baseButton } from '@/components/index';
import { loadingAreaOverlay } from '@/modules/loadingModule/index';
// 商業邏輯
import { formatPriceSmart } from '@/utils/index';
// store
import { useAreaLoadingStore } from '@/modules/loadingModule/store/index';
import { usePortfolioStore, useStockMetaStore } from '@/stores/index';
// ---------------------------

// ----------初始化----------
const portfolioStore = usePortfolioStore(); // 投資組合 store
const loadingStore = useAreaLoadingStore(); // 讀取狀態 store
const stockMetaStore = useStockMetaStore(); // 股票資訊 store

// 獲取資金配置讀取狀態
const isSummaryLoading = computed(() => loadingStore.isLoading(portfolioStore.summaryLoading));

const isHoldingsLoading = computed(() => loadingStore.isLoading(portfolioStore.holdingsLoading));

const selectedAsset = ref<StockRow>({} as StockRow); // 紀錄當前所選擇的資產ID
const submitting = ref(false); // 表單提交狀態

onMounted(async () => {
  await getSummaryData(); // 請求資產配置資料
  getHoldingsData(1); // 請求持股配置資料
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
    title: '市價/買進價格',
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
          h('div', `總成本：${row.totalCost.toLocaleString()}`),
          h('div', `總市值：${row.marketValue.toLocaleString()}`),
          // 未實現損益樣式較複雜，改用自執行函式處理
          (() => {
            const val = typeof row.stockProfit === 'number' ? row.stockProfit : null;
            const cls =
              val === null
                ? 'text-neutral_300'
                : val > 0
                  ? 'text-danger'
                  : val < 0
                    ? 'text-success'
                    : 'text-neutral_300';
            return h('div', { class: 'flex items-center' }, [
              h('span', '未實現損益：'),
              h('span', { class: `${cls} ml-1` }, val !== null ? val.toLocaleString() : '-'),
            ]);
          })(),

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
            { default: () => '賣出' }
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
// ------------------------

// ----------工具函式----------
// 清除所選資產
const clearSelectedAsset = () => {
  selectedAsset.value = {} as StockRow;
  console.log('觸發清除', selectedAsset.value);
};
// ---------------------------

// ----------新增資產----------
const newAssetDlgOpen = ref(false); // 新增資產彈窗開關

const openAssetDialog = () => {
  newAssetDlgOpen.value = true;
};
// ---------------------------

// ----------賣出資產----------
const sellAssetDialogOpen = ref(false); // 賣出資產彈窗開關

const openSellAssetDialog = (assetRow: StockRow) => {
  clearSelectedAsset();
  selectedAsset.value = assetRow;
  sellAssetDialogOpen.value = true;
};
// ---------------------------

// ----------編輯資產----------
const editAssetDlgOpen = ref(false); // 編輯資產彈窗開關

const openEditAssetDialog = (assetRow: StockRow) => {
  clearSelectedAsset();
  selectedAsset.value = assetRow;
  editAssetDlgOpen.value = true;
};
// ---------------------------

// ----------刪除資產----------
const deleteAssetDlgOpen = ref(false); // 刪除資產彈窗開關

const openDeleteAssetDialog = (assetRow: StockRow) => {
  clearSelectedAsset();
  selectedAsset.value = assetRow;
  deleteAssetDlgOpen.value = true;
};
// ---------------------------

// ----------API請求----------
// 請求資產一覽
const getSummaryData = async () => {
  const res = await portfolioStore.fetchSummaryData();

  if (!res.success) {
    // 這裡可以根據需求做錯誤提示或重導
    return;
  } else {
    console.log('✅ 成功取得資產配置資料:', res.data);
  }
};

// 請求持股一覽
const getHoldingsData = async (page: number) => {
  const res = await portfolioStore.fetchHoldingsData(page);

  if (!res.success) {
    // 這裡可以根據需求做錯誤提示或重導
    return;
  } else {
    console.log('✅ 成功取得持股配置資料:', res.data);
  }
};

// 請求編輯資產
const requestEditAsset = async (payload: {
  assetId: string | null;
  formValue: EditStockPayload;
}) => {
  const { assetId, formValue } = payload;

  if (!assetId) {
    console.log('❌ 編輯資產失敗，缺少 assetId');
    return;
  }

  const res = await portfolioStore.editAsset(assetId, formValue);

  if (!res.success) {
    // 這裡可以根據需求做錯誤提示或重導
    return;
  } else {
    console.log('✅ 成功編輯資產:', res.success);
    clearSelectedAsset();
    editAssetDlgOpen.value = false;
  }
};

// 請求刪除資產
const requestDeleteAsset = async (assetId: string) => {
  const res = await portfolioStore.deleteAsset(assetId);

  if (!res.success) {
    // 這裡可以根據需求做錯誤提示或重導
    return;
  } else {
    console.log('✅ 成功刪除資產:', res.success);
    clearSelectedAsset();
    deleteAssetDlgOpen.value = false;
  }
};

// 請求賣出資產
const requestSellAsset = async (payload: {
  assetId: string | null;
  formValue: SellStockPayload;
}) => {
  const { assetId, formValue } = payload;

  if (!assetId) {
    console.log('❌ 編輯資產失敗，缺少 assetId');
    return;
  }

  const res = await portfolioStore.sellAsset(assetId, formValue);

  if (!res.success) {
    // 這裡可以根據需求做錯誤提示或重導
    return;
  } else {
    console.log('✅ 成功賣出資產:', res.success);
    clearSelectedAsset();
    sellAssetDialogOpen.value = false;
  }
};
// ---------------------------
</script>
