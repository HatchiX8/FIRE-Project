<template>
  <div class="text-textColor">
    <div class="mb-4"><trendChart class="h-70" :chartData="data" /></div>
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

      <baseButton color="primary">新增資產</baseButton>
    </div>
    <baseTable
      :columns="bridgedColumns"
      :data="bridgedData"
      :row-key="bridgedRowKey"
      v-model:expanded-row-keys="expanded"
      :page-size="10"
      class="mt-4"
    />
  </div>
  <totalInvestDialog
    v-model="totalInvestDlgOpen"
    :current-invest="currentInvest"
    :loading="submitting"
    initial-mode="deposit"
    @submit="onSubmit"
  />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import type { DataTableColumns } from 'naive-ui';
// 元件
import { trendChart, totalInvestDialog } from './comps/index';
import { baseButton, baseTable } from '@/components/index';
// 商業邏輯

// ---------------------------

// ----------區域----------
const data = {
  date: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  countW: [150, 200, 170, 250, 300, 220, 180, 160, 140, 120, 130, 150],
  countG: [120, 180, 160, 240, 290, 210, 190, 170, 150, 130, 140, 160],
  countR: [100, 160, 140, 220, 270, 200, 180, 160, 140, 120, 130, 150],
  countY: [80, 140, 120, 200, 250, 190, 170, 150, 130, 110, 120, 140],
  all_Count: [650, 820, 710, 930, 1110, 1010, 900, 800, 700, 600, 650, 720],
};
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

const columns: DataTableColumns<StockRow> = [
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

const fakeData: StockRow[] = [
  {
    tradesId: 'UUID-2330',
    stockId: '2330',
    stockName: '台積電',
    tradesDate: '2025/08/11',
    buyPrice: 113,
    sellPrice: 120,
    quantity: 1000,
    buyCost: 113000,
    actualRealizedPnl: 120000,
    stockProfit: -7000,
    profitLossRate: -3,
    note: '跌破10日線清倉',
  },
  {
    tradesId: 'UUID-0050',
    stockId: '0050',
    stockName: '元大台灣50',
    tradesDate: '2025/08/11',
    buyPrice: 113,
    sellPrice: 120,
    quantity: 1000,
    buyCost: 113000,
    actualRealizedPnl: 120000,
    stockProfit: 7000,
    profitLossRate: 3,
    note: '跌破10日線清倉',
  },
  {
    tradesId: 'UUID-00638L',
    stockId: '00638L',
    stockName: '台灣50',
    tradesDate: '2025/08/11',
    buyPrice: 113,
    sellPrice: 120,
    quantity: 1000,
    buyCost: 113000,
    actualRealizedPnl: 120000,
    stockProfit: 7000,
    profitLossRate: 3,
    note: '跌破10日線清倉',
  },
];

const expanded = ref<Array<string | number>>([]);
// ----------斷言----------
/** ✅ 這三個是「橋接變數」，把 TS 斷言放到 script */
const bridgedColumns = columns as unknown as DataTableColumns<Record<string, unknown>>;

const bridgedData = fakeData as unknown as Record<string, unknown>[];

const bridgedRowKey = (row: Record<string, unknown>) => (row as unknown as StockRow).tradesId;
// ------------------------

const openDialog = (stockId: string) => {
  // 打開對話框的邏輯
  console.log('觸發點擊，ID為:', stockId);
};

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
</script>
